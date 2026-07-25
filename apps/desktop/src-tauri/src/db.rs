//! SQLite persistence for clipboard history.
//!
//! Schema (per the handover):
//!   items(id, content, content_hash, source_app, is_pinned, created_at, last_used_at)
//! with indexes on content_hash (dedup) and created_at (sorting).

use rusqlite::{params, Connection};
use serde::Serialize;
use std::path::Path;

#[derive(Debug, Clone, Serialize)]
pub struct Item {
    pub id: i64,
    pub content: String,
    pub content_hash: String,
    pub source_app: Option<String>,
    pub is_pinned: bool,
    pub created_at: String,
    pub last_used_at: Option<String>,
    /// "text" | "image" — v1 stored text only; the column was added later.
    pub kind: String,
}

pub struct Db {
    conn: Connection,
}

fn now_iso() -> String {
    chrono::Utc::now().to_rfc3339()
}

impl Db {
    pub fn open(path: &Path) -> rusqlite::Result<Self> {
        let conn = Connection::open(path)?;
        conn.pragma_update(None, "journal_mode", "WAL")?;
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS items (
                id            INTEGER PRIMARY KEY,
                content       TEXT NOT NULL,
                content_hash  TEXT NOT NULL,
                source_app    TEXT,
                is_pinned     INTEGER NOT NULL DEFAULT 0,
                created_at    TEXT NOT NULL,
                last_used_at  TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_items_content_hash ON items(content_hash);
            CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);
            ",
        )?;
        // Migration: v1 tables have no `kind` column.
        let has_kind = {
            let mut stmt = conn.prepare("PRAGMA table_info(items)")?;
            let names: Vec<String> = stmt
                .query_map([], |row| row.get(1))?
                .collect::<rusqlite::Result<_>>()?;
            names.iter().any(|n| n == "kind")
        };
        if !has_kind {
            conn.execute_batch("ALTER TABLE items ADD COLUMN kind TEXT NOT NULL DEFAULT 'text'")?;
        }
        Ok(Self { conn })
    }

    /// All items: pinned first, then newest first.
    pub fn list(&self) -> rusqlite::Result<Vec<Item>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content, content_hash, source_app, is_pinned, created_at, last_used_at, kind
             FROM items
             ORDER BY is_pinned DESC, created_at DESC",
        )?;
        let rows = stmt.query_map([], |row| {
            Ok(Item {
                id: row.get(0)?,
                content: row.get(1)?,
                content_hash: row.get(2)?,
                source_app: row.get(3)?,
                is_pinned: row.get::<_, i64>(4)? != 0,
                created_at: row.get(5)?,
                last_used_at: row.get(6)?,
                kind: row.get(7)?,
            })
        })?;
        rows.collect()
    }

    /// Hash of the most recently created item — used for dedup checks.
    pub fn latest_hash(&self) -> rusqlite::Result<Option<String>> {
        let mut stmt = self
            .conn
            .prepare("SELECT content_hash FROM items ORDER BY created_at DESC, id DESC LIMIT 1")?;
        let mut rows = stmt.query([])?;
        Ok(rows.next()?.map(|row| row.get(0)).transpose()?)
    }

    pub fn find_id_by_hash(&self, hash: &str) -> rusqlite::Result<Option<i64>> {
        let mut stmt = self
            .conn
            .prepare("SELECT id FROM items WHERE content_hash = ?1 ORDER BY created_at DESC LIMIT 1")?;
        let mut rows = stmt.query(params![hash])?;
        Ok(rows.next()?.map(|row| row.get(0)).transpose()?)
    }

    pub fn insert(&self, content: &str, hash: &str, source_app: Option<&str>, kind: &str) -> rusqlite::Result<i64> {
        self.conn.execute(
            "INSERT INTO items (content, content_hash, source_app, is_pinned, created_at, last_used_at, kind)
             VALUES (?1, ?2, ?3, 0, ?4, ?4, ?5)",
            params![content, hash, source_app, now_iso(), kind],
        )?;
        Ok(self.conn.last_insert_rowid())
    }

    /// They copied it again — just bump last_used_at, don't duplicate.
    pub fn touch(&self, id: i64) -> rusqlite::Result<()> {
        self.conn.execute(
            "UPDATE items SET last_used_at = ?1 WHERE id = ?2",
            params![now_iso(), id],
        )?;
        Ok(())
    }

    pub fn set_pinned(&self, id: i64, pinned: bool) -> rusqlite::Result<()> {
        self.conn.execute(
            "UPDATE items SET is_pinned = ?1 WHERE id = ?2",
            params![if pinned { 1 } else { 0 }, id],
        )?;
        Ok(())
    }

    pub fn delete(&self, id: i64) -> rusqlite::Result<()> {
        self.conn.execute("DELETE FROM items WHERE id = ?1", params![id])?;
        Ok(())
    }

    /// Clear history — pinned items survive.
    pub fn clear_unpinned(&self) -> rusqlite::Result<()> {
        self.conn.execute("DELETE FROM items WHERE is_pinned = 0", [])?;
        Ok(())
    }

    /// Retention: drop unpinned items older than `days`. Pinned items keep forever.
    pub fn delete_older_than(&self, days: u32) -> rusqlite::Result<()> {
        let cutoff = (chrono::Utc::now() - chrono::Duration::days(days as i64)).to_rfc3339();
        self.conn.execute(
            "DELETE FROM items WHERE is_pinned = 0 AND created_at < ?1",
            params![cutoff],
        )?;
        Ok(())
    }
}

//! Clipboard monitoring: poll every 500ms, hash what we find, dedup
//! against the most recent item. The board silently collects — no
//! notifications, no popups.

use crate::{db::Db, AppState};
use sha2::{Digest, Sha256};
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_clipboard_manager::ClipboardExt;

fn sha256_hex(text: &str) -> String {
    let digest = Sha256::digest(text.as_bytes());
    digest.iter().map(|b| format!("{b:02x}")).collect()
}

/// Returns true if the history changed (new item inserted).
fn record(db: &Db, content: &str, hash: &str) -> bool {
    // Dedup: same as the most recent item → just bump last_used_at.
    match db.latest_hash() {
        Ok(Some(latest)) if latest == hash => {
            if let Ok(Some(id)) = db.find_id_by_hash(hash) {
                let _ = db.touch(id);
            }
            false
        }
        _ => db.insert(content, hash, None).is_ok(),
    }
}

pub fn start_monitor(app: AppHandle) {
    // Seed from the DB so a restart doesn't re-add the current clipboard.
    let mut last_seen: Option<String> = app
        .try_state::<AppState>()
        .and_then(|s| s.db.lock().ok().and_then(|db| db.latest_hash().ok().flatten()));

    std::thread::spawn(move || loop {
        if let Ok(text) = app.clipboard().read_text() {
            let trimmed = text.trim();
            if !trimmed.is_empty() {
                let hash = sha256_hex(&text);
                if last_seen.as_deref() != Some(hash.as_str()) {
                    let changed = app
                        .try_state::<AppState>()
                        .and_then(|s| s.db.lock().ok().map(|db| record(&db, &text, &hash)))
                        .unwrap_or(false);
                    last_seen = Some(hash);
                    if changed {
                        let _ = app.emit("items-changed", ());
                    }
                }
            }
        }
        std::thread::sleep(Duration::from_millis(500));
    });
}

//! Clipboard monitoring: poll every 500ms, hash what we find, dedup
//! against the most recent item. The board silently collects — no
//! notifications, no popups.

use crate::db::Db;
use crate::AppState;
use sha2::{Digest, Sha256};
use std::path::PathBuf;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_clipboard_manager::ClipboardExt;

fn sha256_hex(bytes: &[u8]) -> String {
    let digest = Sha256::digest(bytes);
    digest.iter().map(|b| format!("{b:02x}")).collect()
}

/// Returns true if the history changed (new item inserted).
fn record(db: &Db, content: &str, hash: &str, kind: &str) -> bool {
    // Dedup: same as the most recent item → just bump last_used_at.
    match db.latest_hash() {
        Ok(Some(latest)) if latest == hash => {
            if let Ok(Some(id)) = db.find_id_by_hash(hash) {
                let _ = db.touch(id);
            }
            false
        }
        _ => db.insert(content, hash, None, kind).is_ok(),
    }
}

/// Persist a clipboard image as PNG under app data; returns its path.
fn save_image(app: &AppHandle, hash: &str, img: &tauri::image::Image) -> Option<PathBuf> {
    let dir = app.path().app_data_dir().ok()?.join("images");
    std::fs::create_dir_all(&dir).ok()?;
    let path = dir.join(format!("{hash}.png"));
    if path.exists() {
        return Some(path);
    }
    let buffer = image::RgbaImage::from_raw(img.width(), img.height(), img.rgba().to_vec())?;
    buffer.save(&path).ok()?;
    Some(path)
}

pub fn start_monitor(app: AppHandle) {
    // Seed from the DB so a restart doesn't re-add the current clipboard.
    let mut last_seen: Option<String> = app.try_state::<AppState>().and_then(|s| {
        s.db.lock()
            .ok()
            .and_then(|db| db.latest_hash().ok().flatten())
    });

    std::thread::spawn(move || loop {
        let mut handled_text = false;

        if let Ok(text) = app.clipboard().read_text() {
            if !text.trim().is_empty() {
                handled_text = true;
                let hash = sha256_hex(text.as_bytes());

                // Self-write guard — skip recording if we just wrote this ourselves
                let is_self = if let Some(state) = app.try_state::<AppState>() {
                    if let Ok(mut pending) = state.self_write_pending.lock() {
                        if pending.as_deref() == Some(&hash) {
                            *pending = None;
                            true
                        } else {
                            *pending = None;
                            false
                        }
                    } else {
                        false
                    }
                } else {
                    false
                };

                if is_self {
                    last_seen = Some(hash);
                } else if last_seen.as_deref() != Some(hash.as_str()) {
                    let changed = app
                        .try_state::<AppState>()
                        .and_then(|s| s.db.lock().ok().map(|db| record(&db, &text, &hash, "text")))
                        .unwrap_or(false);
                    last_seen = Some(hash);
                    if changed {
                        let _ = app.emit("items-changed", ());
                        crate::show_toast(&app, "copied");
                    }
                }
            }
        }

        if !handled_text {
            if let Ok(img) = app.clipboard().read_image() {
                let hash = sha256_hex(img.rgba());
                if last_seen.as_deref() != Some(hash.as_str()) {
                    let changed = save_image(&app, &hash, &img)
                        .and_then(|path| {
                            let content = path.to_string_lossy().to_string();
                            app.try_state::<AppState>().and_then(|s| {
                                s.db.lock()
                                    .ok()
                                    .map(|db| record(&db, &content, &hash, "image"))
                            })
                        })
                        .unwrap_or(false);
                    last_seen = Some(hash);
                    if changed {
                        let _ = app.emit("items-changed", ());
                        crate::show_toast(&app, "copied");
                    }
                }
            }
        }

        std::thread::sleep(Duration::from_millis(500));
    });
}

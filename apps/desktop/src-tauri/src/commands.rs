//! Tauri commands exposed to the frontend.

use crate::{config::Settings, db::Item, AppState};
use sha2::{Digest, Sha256};
use tauri::{AppHandle, Emitter, State};
use tauri_plugin_clipboard_manager::ClipboardExt;

fn lock_db<'a>(
    state: &'a State<'a, AppState>,
) -> Result<std::sync::MutexGuard<'a, crate::db::Db>, String> {
    state.db.lock().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_items(state: State<AppState>) -> Result<Vec<Item>, String> {
    lock_db(&state)?.list().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_pinned(id: i64, pinned: bool, state: State<AppState>) -> Result<(), String> {
    lock_db(&state)?
        .set_pinned(id, pinned)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_item(id: i64, state: State<AppState>) -> Result<(), String> {
    lock_db(&state)?.delete(id).map_err(|e| e.to_string())
}

/// Clear history — pinned items survive.
#[tauri::command]
pub fn clear_history(state: State<AppState>) -> Result<(), String> {
    lock_db(&state)?.clear_unpinned().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_settings(state: State<AppState>) -> Result<Settings, String> {
    state
        .settings
        .lock()
        .map(|s| s.clone())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn save_settings(
    settings: Settings,
    app: AppHandle,
    state: State<AppState>,
) -> Result<(), String> {
    // Apply retention immediately if the user just chose one.
    if let Some(days) = settings.retention_days {
        lock_db(&state)?
            .delete_older_than(days)
            .map_err(|e| e.to_string())?;
        let _ = app.emit("items-changed", ());
    }
    *state.settings.lock().map_err(|e| e.to_string())? = settings.clone();
    crate::config::save(&app, &settings).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn write_to_clipboard(
    text: String,
    app: AppHandle,
    state: State<AppState>,
) -> Result<(), String> {
    let hash = Sha256::digest(text.as_bytes());
    let hash_hex = hash.iter().map(|b| format!("{b:02x}")).collect::<String>();
    *state.self_write_pending.lock().map_err(|e| e.to_string())? = Some(hash_hex);
    app.clipboard()
        .write_text(text)
        .map_err(|e| e.to_string())?;
    crate::show_toast(&app, "copied");
    Ok(())
}

#[tauri::command]
pub fn show_toast_cmd(app: AppHandle, kind: String) -> Result<(), String> {
    crate::show_toast(&app, &kind);
    Ok(())
}

#[tauri::command]
pub fn hide_toast_cmd(app: AppHandle) -> Result<(), String> {
    crate::hide_toast(&app);
    Ok(())
}

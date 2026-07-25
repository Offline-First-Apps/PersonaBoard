//! Tauri commands exposed to the frontend.

use crate::{config::Settings, db::Item, AppState};
use tauri::{AppHandle, Emitter, State};

fn lock_db<'a>(state: &'a State<'a, AppState>) -> Result<std::sync::MutexGuard<'a, crate::db::Db>, String> {
    state.db.lock().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_items(state: State<AppState>) -> Result<Vec<Item>, String> {
    lock_db(&state)?.list().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_pinned(id: i64, pinned: bool, state: State<AppState>) -> Result<(), String> {
    lock_db(&state)?.set_pinned(id, pinned).map_err(|e| e.to_string())
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
pub fn save_settings(settings: Settings, app: AppHandle, state: State<AppState>) -> Result<(), String> {
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

pub mod clipboard;
pub mod commands;
pub mod config;
pub mod db;
pub mod tray;

use std::sync::Mutex;
use tauri::{Emitter, Manager};
use tauri_plugin_autostart::ManagerExt;

pub struct AppState {
    pub db: Mutex<db::Db>,
    pub settings: Mutex<config::Settings>,
    pub self_write_pending: Mutex<Option<String>>,
}

pub fn show_toast(app: &tauri::AppHandle, kind: &str) {
    if let Some(window) = app.get_webview_window("toast") {
        if let Ok(Some(monitor)) = window.current_monitor() {
            let m = monitor.size();
            let p = monitor.position();
            let ws = window.outer_size().unwrap_or_default();
            let x = p.x + (m.width as i32 - ws.width as i32) / 2;
            let y = p.y + m.height as i32 - ws.height as i32 - 48;
            let _ = window.set_position(tauri::PhysicalPosition { x, y });
        }
        let _ = window.show();
    }
    let event = if kind == "pasted" { "toast-pasted" } else { "toast-copied" };
    let _ = app.emit(event, ());
}

pub fn hide_toast(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("toast") {
        let _ = window.hide();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .setup(|app| {
            use tauri::Manager;

            let _ = app.autolaunch().enable();

            let data_dir = app.path().app_data_dir().expect("app data dir");
            std::fs::create_dir_all(&data_dir).expect("create app data dir");
            let db = db::Db::open(&data_dir.join("personaboard.db")).expect("open database");

            let settings = config::load(app.handle());
            if let Some(days) = settings.retention_days {
                let _ = db.delete_older_than(days);
            }

            app.manage(AppState {
                db: Mutex::new(db),
                settings: Mutex::new(settings),
                self_write_pending: Mutex::new(None),
            });

            tray::setup(app)?;
            clipboard::start_monitor(app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_items,
            commands::set_pinned,
            commands::delete_item,
            commands::clear_history,
            commands::get_settings,
            commands::save_settings,
            commands::write_to_clipboard,
            commands::show_toast_cmd,
            commands::hide_toast_cmd,
        ])
        // The app lives in the tray: closing the window just hides it.
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let _ = window.hide();
                api.prevent_close();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

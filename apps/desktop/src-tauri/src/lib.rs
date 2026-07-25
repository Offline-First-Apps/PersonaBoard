pub mod clipboard;
pub mod commands;
pub mod config;
pub mod db;
pub mod tray;

use std::sync::Mutex;

pub struct AppState {
    pub db: Mutex<db::Db>,
    pub settings: Mutex<config::Settings>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(|app| {
            use tauri::Manager;

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

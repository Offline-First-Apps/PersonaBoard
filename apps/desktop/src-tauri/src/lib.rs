pub mod clipboard;
pub mod commands;
pub mod db;

use std::sync::Mutex;

pub struct AppState {
    pub db: Mutex<db::Db>,
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
            app.manage(AppState { db: Mutex::new(db) });

            clipboard::start_monitor(app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_items,
            commands::set_pinned,
            commands::delete_item,
            commands::clear_history,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

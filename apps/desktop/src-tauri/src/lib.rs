// NOTE: Entry point only. Clipboard monitoring, DB, tray, hotkey, and
// window management will live in dedicated modules once designs arrive.

pub mod db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

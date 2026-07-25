//! Settings: a small JSON file in the app config dir. No accounts, no
//! cloud — preferences live next to the database.

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Settings {
    /// e.g. "Ctrl+Shift+V" — rebinding arrives with the hotkey work in Tier 3.
    pub hotkey: String,
    /// "center" | "cursor" | "last"
    pub panel_position: String,
    /// None = keep forever; Some(7) / Some(30) = auto-clear after N days.
    pub retention_days: Option<u32>,
    /// A very subtle, soft click when the panel opens. Off by default.
    pub sound_on_open: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            hotkey: "Ctrl+Shift+V".into(),
            panel_position: "center".into(),
            retention_days: None,
            sound_on_open: false,
        }
    }
}

fn settings_path(app: &AppHandle) -> PathBuf {
    app.path()
        .app_config_dir()
        .expect("app config dir")
        .join("settings.json")
}

pub fn load(app: &AppHandle) -> Settings {
    std::fs::read_to_string(settings_path(app))
        .ok()
        .and_then(|raw| serde_json::from_str(&raw).ok())
        .unwrap_or_default()
}

pub fn save(app: &AppHandle, settings: &Settings) -> std::io::Result<()> {
    let path = settings_path(app);
    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir)?;
    }
    let raw = serde_json::to_string_pretty(settings)?;
    std::fs::write(path, raw)
}

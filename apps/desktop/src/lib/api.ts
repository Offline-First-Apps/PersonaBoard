import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

/* Typed bridge to the Rust backend. */

export interface DbItem {
  id: number;
  content: string;
  content_hash: string;
  source_app: string | null;
  is_pinned: boolean;
  created_at: string;
  last_used_at: string | null;
  kind: string;
}

export const getItems = () => invoke<DbItem[]>("get_items");

export const setPinned = (id: number, pinned: boolean) =>
  invoke<void>("set_pinned", { id, pinned });

export const deleteItem = (id: number) => invoke<void>("delete_item", { id });

export const clearHistory = () => invoke<void>("clear_history");

export const copyToClipboard = (text: string) => invoke<void>("write_to_clipboard", { text });

export interface Settings {
  hotkey: string;
  panel_position: "center" | "cursor" | "last";
  retention_days: number | null;
  sound_on_open: boolean;
}

export const getSettings = () => invoke<Settings>("get_settings");

export const saveSettings = (settings: Settings) => invoke<void>("save_settings", { settings });

/** Fires when the tray menu asks for the settings panel. */
export function onOpenSettings(callback: () => void) {
  return listen("open-settings", callback).then((unlisten) => unlisten);
}

/** Fires whenever the panel becomes visible. */
export function onPanelShown(callback: () => void) {
  return listen("panel-shown", callback).then((unlisten) => unlisten);
}

/** Fires when the clipboard monitor records a new item. */
export function onItemsChanged(callback: () => void) {
  return listen("items-changed", callback).then((unlisten) => unlisten);
}

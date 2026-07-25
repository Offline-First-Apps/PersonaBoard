import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

/* Typed bridge to the Rust backend. */

export interface DbItem {
  id: number;
  content: string;
  content_hash: string;
  source_app: string | null;
  is_pinned: boolean;
  created_at: string;
  last_used_at: string | null;
}

export const getItems = () => invoke<DbItem[]>("get_items");

export const setPinned = (id: number, pinned: boolean) =>
  invoke<void>("set_pinned", { id, pinned });

export const deleteItem = (id: number) => invoke<void>("delete_item", { id });

export const clearHistory = () => invoke<void>("clear_history");

export const copyToClipboard = (text: string) => writeText(text);

/** Fires when the clipboard monitor records a new item. */
export function onItemsChanged(callback: () => void) {
  return listen("items-changed", callback).then((unlisten) => unlisten);
}

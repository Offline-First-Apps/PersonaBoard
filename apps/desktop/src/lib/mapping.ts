import { convertFileSrc } from "@tauri-apps/api/core";
import type { DbItem } from "./api";
import type { ClipboardItemData, ClipboardItemType } from "./types";

/* Map a database row to what the board renders. Text rows are classified
   into text / link / code; image rows point at their stored PNG. */

function classify(content: string): ClipboardItemType {
  const t = content.trim();
  if (/^https?:\/\/\S+$/.test(t) || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(t)) return "link";
  if (/\n/.test(t) && /([{}();]|=>|^\s*(const|let|var|function|def|class|import)\s)/m.test(t))
    return "code";
  return "text";
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));

  if (seconds < 45) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const date = new Date(then);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function toBoardItem(row: DbItem): ClipboardItemData {
  if (row.kind === "image") {
    return {
      id: String(row.id),
      type: "image",
      text: "Copied image",
      time: formatRelativeTime(row.last_used_at ?? row.created_at),
      imageUrl: convertFileSrc(row.content),
      pinned: row.is_pinned,
    };
  }
  return {
    id: String(row.id),
    type: classify(row.content),
    text: row.content,
    time: formatRelativeTime(row.last_used_at ?? row.created_at),
    pinned: row.is_pinned,
  };
}

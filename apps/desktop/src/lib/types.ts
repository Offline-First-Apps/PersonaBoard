/* Shared board item model — what the UI renders. */

export type ClipboardItemType = "text" | "link" | "code" | "image" | "video" | "file";

export interface ClipboardItemData {
  id: string;
  type: ClipboardItemType;
  text: string;
  /** Human-friendly timestamp, e.g. "6 minutes ago" */
  time: string;
  /** Optional gold chip, e.g. "Tracking number" */
  label?: string;
  /** Secondary info, e.g. "PDF · 412 KB", "JavaScript" */
  meta?: string;
  /** Placeholder thumbnail colors for media items (v2) */
  swatch?: string[];
  pinned?: boolean;
}

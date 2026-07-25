/* The clipboard item model + believable mock data (used until the Rust
   bridge lands in Tier 2). */

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
  /** Placeholder thumbnail colors for media items */
  swatch?: string[];
  pinned?: boolean;
}

export const PINNED_ITEMS: ClipboardItemData[] = [
  {
    id: "p1",
    type: "text",
    text: "Ship what matters. Cut what doesn't. — team offsite notes, keep for the retro deck",
    time: "Yesterday, 4:32 PM",
    pinned: true,
  },
  {
    id: "p2",
    type: "code",
    text: "SB-PB-2291-QK7",
    time: "Mon, 9:10 AM",
    label: "Tracking number",
    pinned: true,
  },
  {
    id: "p3",
    type: "image",
    text: "moodboard-warm-paper-03.png",
    time: "Mon, 8:52 AM",
    meta: "2,400 × 1,600 · 3.1 MB",
    swatch: ["#E7D9B8", "#C79A5B", "#7C5A34"],
    pinned: true,
  },
];

export const TIMELINE_ITEMS: ClipboardItemData[] = [
  {
    id: "t1",
    type: "text",
    text: "Could we push the sync review to Thursday? I want the new caching layer in before we walk through it.",
    time: "Just now",
  },
  {
    id: "t2",
    type: "image",
    text: "onboarding-flow-v3-annotated.png",
    time: "2 minutes ago",
    meta: "1,920 × 1,080 · 1.8 MB",
    swatch: ["#F3ECE0", "#D9C8A6", "#8C806E"],
  },
  {
    id: "t3",
    type: "link",
    text: "fonts.klim.co.nz/untitled-serif/specimen",
    time: "6 minutes ago",
    meta: "Klim Type Foundry",
  },
  {
    id: "t4",
    type: "video",
    text: "panel-motion-study-final.mp4",
    time: "12 minutes ago",
    meta: "0:18 · 1080p · 24.6 MB",
    swatch: ["#3A2E1E", "#6E5636", "#B8863D"],
  },
  {
    id: "t5",
    type: "code",
    text: "const debounce = (fn, wait = 200) => {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), wait);\n  };\n};",
    time: "18 minutes ago",
    meta: "JavaScript",
  },
  {
    id: "t6",
    type: "file",
    text: "reorder-confirmation-8827-final-v2.pdf",
    time: "34 minutes ago",
    meta: "PDF · 412 KB",
  },
  {
    id: "t7",
    type: "text",
    text: "412 Laurel Street, Unit 3, Portland OR 97214",
    time: "41 minutes ago",
  },
  {
    id: "t8",
    type: "text",
    text: "\"The best interfaces disappear. They leave only the feeling of having been helped.\"",
    time: "1 hour ago",
  },
  {
    id: "t9",
    type: "file",
    text: "q3-partner-agreement-signed.docx",
    time: "1 hour ago",
    meta: "Word · 88 KB",
  },
  {
    id: "t10",
    type: "image",
    text: "desk-reference-morning-light.jpg",
    time: "2 hours ago",
    meta: "3,024 × 4,032 · 4.4 MB",
    swatch: ["#EFE6D3", "#C9A46B", "#463424"],
  },
  {
    id: "t11",
    type: "text",
    text: "Let's keep the onboarding to two screens. Anything more and people bounce before they see the board fill up.",
    time: "Yesterday, 11:04 AM",
  },
  {
    id: "t12",
    type: "link",
    text: "notion.so/personaboard/copy-voice-guide",
    time: "Yesterday, 9:40 AM",
    meta: "Notion",
  },
];

export const ALL_ITEMS: ClipboardItemData[] = [...PINNED_ITEMS, ...TIMELINE_ITEMS];

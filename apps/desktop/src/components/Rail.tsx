import type { ClipboardItemType } from "../lib/types";
import {
  IconBrowser,
  IconCode,
  IconFile,
  IconGrid,
  IconImage,
  IconMessage,
  IconSettings,
  IconVideo,
} from "./icons";

export type FilterId = "all" | ClipboardItemType;

export interface FilterDef {
  id: FilterId;
  label: string;
  icon: (props: { style?: React.CSSProperties }) => React.ReactNode;
}

export const FILTERS: FilterDef[] = [
  { id: "all", label: "Everything", icon: IconGrid },
  { id: "text", label: "Text", icon: IconMessage },
  { id: "link", label: "Links", icon: IconBrowser },
  { id: "image", label: "Images", icon: IconImage },
  { id: "video", label: "Video", icon: IconVideo },
  { id: "file", label: "Files", icon: IconFile },
  { id: "code", label: "Code", icon: IconCode },
];

interface RailProps {
  activeFilter: FilterId;
  onFilterChange: (id: FilterId) => void;
  counts: Record<FilterId, number>;
  onOpenSettings?: () => void;
}

/* Left rail: quick access by kind. Collapses to icon-only on narrow
   windows and hides entirely on the smallest (see global.css). */
export function Rail({ activeFilter, onFilterChange, counts, onOpenSettings }: RailProps) {
  return (
    <nav aria-label="Filter by kind" className="pb-rail">
      <div className="pb-rail-wordmark">PersonaBoard</div>
      {FILTERS.map((f) => {
        const Icon = f.icon;
        const active = activeFilter === f.id;
        const count = counts[f.id] || 0;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            aria-pressed={active}
            title={f.label}
            className={`pb-rail-btn${active ? " pb-rail-btn-active" : ""}`}
          >
            <Icon style={{ flexShrink: 0 }} />
            <span className="pb-rail-label">{f.label}</span>
            {count > 0 && <span className="pb-rail-count">{count}</span>}
          </button>
        );
      })}

      <div className="pb-rail-footer">
        <button className="pb-rail-btn" title="Settings" onClick={onOpenSettings}>
          <IconSettings style={{ flexShrink: 0 }} />
          <span className="pb-rail-label">Settings</span>
        </button>
      </div>
    </nav>
  );
}

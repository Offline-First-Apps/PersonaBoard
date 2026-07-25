import { FILTERS } from "./Rail";
import type { FilterId } from "./Rail";

interface EverythingTabsProps {
  typeTab: FilterId;
  onTabChange: (id: FilterId) => void;
  counts: Record<FilterId, number>;
}

/* In-page kind tabs on the Everything page — the rail stays the page
   switcher; these narrow without leaving it. */
export function EverythingTabs({ typeTab, onTabChange, counts }: EverythingTabsProps) {
  return (
    <div role="tablist" aria-label="Narrow everything by kind" className="pb-tabs">
      {FILTERS.map((f) => {
        const active = typeTab === f.id;
        const count = counts[f.id] || 0;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(f.id)}
            className={`pb-tab${active ? " pb-tab-active" : ""}`}
          >
            {f.id === "all" ? "All" : f.label}
            <span className="pb-tab-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

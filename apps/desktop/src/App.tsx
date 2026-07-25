import { useState } from "react";
import { ALL_ITEMS, TIMELINE_ITEMS } from "./data/mock";
import { ClipboardItem } from "./components/ClipboardItem";
import { IconSearch } from "./components/icons";

/* The board panel. In the real app this fills the frameless Tauri window;
   sizing is responsive rather than the design's fixed 1000×780. */
export default function App() {
  const [query, setQuery] = useState("");

  const hasQuery = query.trim().length > 0;
  const matchesQuery = (text: string) => text.toLowerCase().includes(query.trim().toLowerCase());
  const filteredTimeline = hasQuery ? TIMELINE_ITEMS.filter((it) => matchesQuery(it.text)) : TIMELINE_ITEMS;
  const noResults = hasQuery && filteredTimeline.length === 0;

  return (
    <main className="pb-panel pb-app" aria-label="PersonaBoard, your clipboard history">
      <div className="pb-board">
        {/* Header */}
        <header className="pb-header">
          <div className="pb-header-row">
            <div>
              <p className="pb-title">Everything</p>
              <p className="pb-subtitle">{ALL_ITEMS.length} things kept on your board</p>
            </div>
            <div className="pb-hotkey-chip">⌃⇧V</div>
          </div>

          <div className="pb-search">
            <IconSearch style={{ color: "var(--pb-text-tertiary)", flexShrink: 0 }} />
            <input
              className="pb-search-input"
              placeholder="Find anything..."
              aria-label="Search your board"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {hasQuery && (
              <button aria-label="Clear search" onClick={() => setQuery("")} className="pb-icon-btn pb-search-clear">
                ×
              </button>
            )}
          </div>
        </header>

        {/* Scrollable content */}
        <div className="pb-scroll pb-content">
          {noResults ? (
            <div className="pb-empty">
              <p className="pb-empty-title">Nothing matches yet.</p>
              <p className="pb-empty-body">No item on your board mentions &ldquo;{query}&rdquo;.</p>
            </div>
          ) : (
            <section aria-label="Recent clipboard items">
              <div className="pb-grid">
                {filteredTimeline.map((item) => {
                  const wide = item.type === "text" || item.type === "code";
                  return (
                    <div key={item.id} className={wide ? "pb-span-2" : undefined}>
                      <ClipboardItem item={item} dense={item.type === "image" || item.type === "video"} />
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="pb-footer">
          <span className="pb-footer-left">
            {ALL_ITEMS.length} things kept, across text, links, images, video, files, and code
          </span>
          <span className="pb-footer-right">On this machine only</span>
        </footer>
      </div>
    </main>
  );
}

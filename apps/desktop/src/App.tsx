import { ALL_ITEMS, TIMELINE_ITEMS } from "./data/mock";
import { ClipboardItem } from "./components/ClipboardItem";
import { IconSearch } from "./components/icons";

/* The board panel. In the real app this fills the frameless Tauri window;
   sizing is responsive rather than the design's fixed 1000×780. */
export default function App() {
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
            />
          </div>
        </header>

        {/* Scrollable content */}
        <div className="pb-scroll pb-content">
          <section aria-label="Recent clipboard items">
            <div className="pb-grid">
              {TIMELINE_ITEMS.map((item) => {
                const wide = item.type === "text" || item.type === "code";
                return (
                  <div key={item.id} className={wide ? "pb-span-2" : undefined}>
                    <ClipboardItem item={item} dense={item.type === "image" || item.type === "video"} />
                  </div>
                );
              })}
            </div>
          </section>
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

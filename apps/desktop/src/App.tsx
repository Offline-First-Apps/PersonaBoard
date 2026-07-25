import { useCallback, useEffect, useState } from "react";
import type { ClipboardItemData } from "./lib/types";
import { copyToClipboard, deleteItem, getItems, onItemsChanged, setPinned } from "./lib/api";
import { toBoardItem } from "./lib/mapping";
import { ClipboardItem } from "./components/ClipboardItem";
import { EverythingTabs } from "./components/EverythingTabs";
import { IconSearch, IconStar } from "./components/icons";
import { FILTERS, Rail } from "./components/Rail";
import type { FilterId } from "./components/Rail";

/* The board panel. In the real app this fills the frameless Tauri window;
   sizing is responsive rather than the design's fixed 1000×780. */
export default function App() {
  const [items, setItems] = useState<ClipboardItemData[]>([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [typeTab, setTypeTab] = useState<FilterId>("all");

  const refresh = useCallback(async () => {
    const rows = await getItems();
    setItems(rows.map(toBoardItem));
  }, []);

  useEffect(() => {
    void refresh();
    let unlisten: (() => void) | undefined;
    void onItemsChanged(() => void refresh()).then((fn) => (unlisten = fn));
    return () => unlisten?.();
  }, [refresh]);

  // Rail picks the page; on the Everything page, in-page tabs narrow by kind
  const effectiveKind = activeFilter === "all" ? typeTab : activeFilter;
  const hasQuery = query.trim().length > 0;

  const matchesFilter = (it: ClipboardItemData) => effectiveKind === "all" || it.type === effectiveKind;
  const matchesQuery = (it: ClipboardItemData) =>
    it.text.toLowerCase().includes(query.trim().toLowerCase());

  const visible = items.filter((it) => matchesFilter(it) && (!hasQuery || matchesQuery(it)));
  const pinnedItems = visible.filter((it) => it.pinned);
  const timelineItems = visible.filter((it) => !it.pinned);
  const noResults = (hasQuery || effectiveKind !== "all") && visible.length === 0;

  // Everything page + All tab (no search): group the timeline by kind
  const grouped = activeFilter === "all" && typeTab === "all" && !hasQuery;

  const counts = FILTERS.reduce(
    (acc, f) => {
      acc[f.id] = f.id === "all" ? items.length : items.filter((i) => i.type === f.id).length;
      return acc;
    },
    {} as Record<FilterId, number>
  );

  const togglePin = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, pinned: !it.pinned } : it)));
    void setPinned(Number(id), !item.pinned);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    void deleteItem(Number(id));
  };

  const copyAgain = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (item) void copyToClipboard(item.text);
  };

  const renderGrid = (list: ClipboardItemData[]) => (
    <div className="pb-grid">
      {list.map((item) => {
        const wide = item.type === "text" || item.type === "code";
        return (
          <div key={item.id} className={wide ? "pb-span-2" : undefined}>
            <ClipboardItem
              item={item}
              dense={item.type === "image" || item.type === "video"}
              onPin={togglePin}
              onCopy={copyAgain}
              onDelete={removeItem}
            />
          </div>
        );
      })}
    </div>
  );

  const activeLabel = FILTERS.find((f) => f.id === activeFilter)?.label || "Everything";

  return (
    <main className="pb-panel pb-app" aria-label="PersonaBoard, your clipboard history">
      <Rail activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />

      <div className="pb-board">
        {/* Header */}
        <header className="pb-header">
          <div className="pb-header-row">
            <div>
              <p className="pb-title">{activeLabel}</p>
              <p className="pb-subtitle">
                {counts[effectiveKind]} thing{counts[effectiveKind] === 1 ? "" : "s"} kept on your board
              </p>
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

        {activeFilter === "all" && (
          <EverythingTabs typeTab={typeTab} onTabChange={setTypeTab} counts={counts} />
        )}

        {/* Scrollable content */}
        <div className="pb-scroll pb-content">
          {items.length === 0 ? (
            <div className="pb-empty">
              <p className="pb-empty-title">Your board is quiet.</p>
              <p className="pb-empty-body">Copy something, and it will be here when you need it.</p>
            </div>
          ) : noResults ? (
            <div className="pb-empty">
              <p className="pb-empty-title">Nothing matches yet.</p>
              <p className="pb-empty-body">
                {hasQuery
                  ? <>No item on your board mentions &ldquo;{query}&rdquo;.</>
                  : "This kind hasn't found its way to your board."}
              </p>
            </div>
          ) : (
            <>
              {pinnedItems.length > 0 && (
                <section aria-label="Kept close" className="pb-pinned-section">
                  <h2 className="pb-section-heading">
                    <IconStar style={{ color: "var(--pb-accent)" }} /> Kept close
                  </h2>
                  {renderGrid(pinnedItems)}
                </section>
              )}

              {grouped ? (
                FILTERS.filter((f) => f.id !== "all").map((f) => {
                  const kindItems = timelineItems.filter((it) => it.type === f.id);
                  if (kindItems.length === 0) return null;
                  const KindIcon = f.icon;
                  return (
                    <section key={f.id} aria-label={f.label} className="pb-kind-section">
                      <h2 className="pb-section-heading">
                        <KindIcon style={{ color: "var(--pb-text-tertiary)" }} />
                        {f.label}
                        <span className="pb-section-count">{kindItems.length}</span>
                        <span aria-hidden="true" className="pb-section-rule" />
                      </h2>
                      {renderGrid(kindItems)}
                    </section>
                  );
                })
              ) : (
                <section aria-label="Recent clipboard items">
                  {pinnedItems.length > 0 && <h2 className="pb-section-heading">Recent</h2>}
                  {renderGrid(timelineItems)}
                </section>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="pb-footer">
          <span className="pb-footer-left">
            {items.length} things kept, across text, links, images, video, files, and code
          </span>
          <span className="pb-footer-right">On this machine only</span>
        </footer>
      </div>
    </main>
  );
}

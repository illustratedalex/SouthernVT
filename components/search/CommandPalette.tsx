"use client";

import type { SearchResult } from "@/types/Search";
import { useSearch } from "./SearchProvider";

const groupConfig = [
  { key: "places", label: "Places" },
  { key: "collections", label: "Collections" },
  { key: "media", label: "Media" },
  { key: "basecamp", label: "Basecamp" },
] as const;

export function CommandPalette() {
  const {
    open,
    query,
    selectedIndex,
    groupedResults,
    recentSearches,
    quickActions,
    flatResults,
    setQuery,
    setSelectedIndex,
    closePalette,
    activateResult,
  } = useSearch();

  if (!open) {
    return null;
  }

  const indexedGroups = groupConfig
    .map((group) => ({
      group,
      items: groupedResults[group.key],
    }))
    .filter(({ items }) => items.length > 0)
    .reduce<Array<{ group: (typeof groupConfig)[number]; rows: Array<{ item: SearchResult; index: number }> }>>((acc, entry) => {
      const startIndex = acc.reduce((count, current) => count + current.rows.length, 0);
      const rows = entry.items.map((item, offset) => ({ item, index: startIndex + offset }));
      acc.push({ group: entry.group, rows });
      return acc;
    }, []);

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center bg-[#10231a]/55 px-4 pb-6 pt-12 backdrop-blur-sm sm:pt-20" onClick={closePalette}>
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[32px] border border-[#d8c9ad] bg-[#f8f2e4] shadow-[0_30px_90px_rgba(0,0,0,0.4)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[#dccfb6] bg-white/85 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#d8c9ad] bg-[#fcfaf6] px-4 py-3">
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Search</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search places, collections, media, or Basecamp actions"
              className="w-full bg-transparent text-base text-slate-800 outline-none"
            />
            <span className="rounded-md border border-[#d8c9ad] bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">Esc</span>
          </div>
        </div>

        <div className="grid max-h-[68vh] gap-0 overflow-hidden lg:grid-cols-[1fr_280px]">
          <div className="overflow-y-auto p-3">
            {query.trim() ? (
              flatResults.length ? (
                <div className="space-y-4">
                  {indexedGroups.map(({ group, rows }) => {
                    return (
                      <section key={group.key}>
                        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{group.label}</p>
                        <div className="mt-1 space-y-1">
                          {rows.map(({ item, index }) => (
                            <ResultRow
                              key={`${item.type}-${item.id}`}
                              item={item}
                              active={index === selectedIndex}
                              onMouseEnter={() => setSelectedIndex(index)}
                              onClick={() => activateResult(item)}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#e2d5bd] bg-white/80 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-700">No results found</p>
                  <p className="mt-2 text-sm text-slate-600">Try a different phrase or a broader keyword.</p>
                </div>
              )
            ) : (
              <div className="space-y-5">
                <section>
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Recent searches</p>
                  <div className="mt-1 space-y-1">
                    {recentSearches.length ? (
                      recentSearches.map((search) => (
                        <button
                          key={search}
                          type="button"
                          onClick={() => setQuery(search)}
                          className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-white"
                        >
                          {search}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-3 text-sm text-slate-600">Recent searches will appear here after you open a result.</p>
                    )}
                  </div>
                </section>

                <section>
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Quick actions</p>
                  <div className="mt-1 space-y-1">
                    {quickActions.map((action) => (
                      <ResultRow
                        key={action.id}
                        item={action}
                        active={false}
                        onMouseEnter={() => undefined}
                        onClick={() => activateResult(action)}
                      />
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          <aside className="border-t border-[#dccfb6] bg-white/65 p-4 lg:border-l lg:border-t-0">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Keyboard</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <KeyboardHint keys="Ctrl K" label="Open or close" />
              <KeyboardHint keys="↑ ↓" label="Move through results" />
              <KeyboardHint keys="Enter" label="Open selected result" />
              <KeyboardHint keys="Esc" label="Close palette" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  item,
  active,
  onMouseEnter,
  onClick,
}: {
  item: SearchResult;
  active: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-[#1f3b2f]/35 bg-white shadow-sm"
          : "border-transparent bg-transparent hover:border-[#d8c9ad] hover:bg-white/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
          <p className="mt-1 text-sm text-slate-600">{item.subtitle}</p>
        </div>
        <span className="rounded-full bg-[#f1e8d5] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
          {item.type}
        </span>
      </div>
    </button>
  );
}

function KeyboardHint({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e2d5bd] bg-[#fcfaf6] px-3 py-2">
      <span>{label}</span>
      <span className="rounded-md border border-[#d8c9ad] bg-white px-2 py-0.5 text-xs font-semibold text-slate-600">{keys}</span>
    </div>
  );
}

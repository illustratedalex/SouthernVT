"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildGlobalSearchIndex, runGlobalSearch, type GlobalSearchItem } from "@/lib/search/globalSearch";

const RECENT_KEY = "southernvt-recent-searches";

const typeLabel: Record<GlobalSearchItem["type"], string> = {
  place: "Place",
  collection: "Collection",
  article: "Article",
  event: "Event",
  deal: "Deal",
};

export function GlobalSearch() {
  const router = useRouter();
  const index = useMemo(() => buildGlobalSearchIndex(), []);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);

  const results = useMemo(() => runGlobalSearch(query, index), [query, index]);
  const showingRecent = !query.trim();

  const pushRecent = useCallback((value: string) => {
    setRecent((current) => {
      const next = [value, ...current.filter((item) => item !== value)].slice(0, 6);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const openResult = useCallback((item: GlobalSearchItem) => {
    pushRecent(item.title);
    setOpen(false);
    setQuery("");
    router.push(item.href);
  }, [pushRecent, router]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(RECENT_KEY);
      if (saved) {
        // Initial hydration from localStorage is safe for this local-only state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecent(JSON.parse(saved) as string[]);
      }
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onOverlayKeyDown = (event: KeyboardEvent) => {
      if (!results.length) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % results.length);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + results.length) % results.length);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        openResult(results[activeIndex]);
      }
    };

    window.addEventListener("keydown", onOverlayKeyDown);
    return () => window.removeEventListener("keydown", onOverlayKeyDown);
  }, [activeIndex, open, results, openResult]);

  useEffect(() => {
    // Keeping selection in sync with the active query is safe local UI state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(0);
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full border border-[#d8c9ad] bg-[#f8f2e4] px-4 py-2 text-sm font-semibold text-[#1f3b2f] shadow-[0_14px_35px_rgba(31,59,47,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(31,59,47,0.25)] md:flex"
      >
        Search
        <span className="rounded-md border border-[#d8c9ad] bg-white px-1.5 py-0.5 text-xs">Ctrl K</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-start justify-center bg-[#10231a]/45 px-4 pb-6 pt-16 backdrop-blur-sm sm:pt-24" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-[#d8c9ad] bg-[#f8f2e4] shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-[#dccfb6] bg-white/80 p-4">
              <div className="flex items-center gap-3 rounded-2xl border border-[#d8c9ad] bg-[#fcfaf6] px-4 py-3">
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1f3b2f]">Search</span>
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search places, collections, articles, events, deals"
                  className="w-full bg-transparent text-base text-slate-800 outline-none"
                />
                <span className="rounded-md border border-[#d8c9ad] bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">Esc</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {showingRecent ? (
                <section>
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Recent searches</p>
                  <div className="mt-1 space-y-1">
                    {recent.length ? (
                      recent.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-white"
                        >
                          {term}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-3 text-sm text-slate-600">No recent searches yet. Try Places, Collections, Events, or Deals.</p>
                    )}
                  </div>
                </section>
              ) : results.length ? (
                <section className="space-y-1">
                  {results.map((item, index) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => openResult(item)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        activeIndex === index
                          ? "border-[#1f3b2f]/35 bg-white shadow-sm"
                          : "border-transparent bg-transparent hover:border-[#d8c9ad] hover:bg-white/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                        </div>
                        <span className="rounded-full bg-[#f1e8d5] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
                          {typeLabel[item.type]}
                        </span>
                      </div>
                    </button>
                  ))}
                </section>
              ) : (
                <div className="space-y-3 px-3 py-4 text-sm text-slate-600">
                  <p>No results yet. Try a different phrase.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => router.push("/collections")} className="rounded-xl border border-[#d8c9ad] bg-white px-3 py-2 text-left text-sm font-medium text-slate-700">
                      Browse Collections
                    </button>
                    <button type="button" onClick={() => router.push("/places/hamilton-falls")} className="rounded-xl border border-[#d8c9ad] bg-white px-3 py-2 text-left text-sm font-medium text-slate-700">
                      Popular Place: Hamilton Falls
                    </button>
                    <button type="button" onClick={() => router.push("/places/jamaica-state-park")} className="rounded-xl border border-[#d8c9ad] bg-white px-3 py-2 text-left text-sm font-medium text-slate-700">
                      Popular Place: Jamaica State Park
                    </button>
                    <button type="button" onClick={() => router.push("/explorer")} className="rounded-xl border border-[#d8c9ad] bg-white px-3 py-2 text-left text-sm font-medium text-slate-700">
                      Open Explorer Mode
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

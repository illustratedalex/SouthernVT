"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { searchAll } from "@/lib/search/SearchService";
import type { GroupedSearchResults, SearchResult } from "@/types/Search";

interface SearchContextValue {
  open: boolean;
  query: string;
  selectedIndex: number;
  groupedResults: GroupedSearchResults;
  recentSearches: string[];
  quickActions: SearchResult[];
  flatResults: SearchResult[];
  setQuery: (value: string) => void;
  setOpen: (value: boolean) => void;
  setSelectedIndex: (value: number) => void;
  openPalette: () => void;
  closePalette: () => void;
  activateResult: (result: SearchResult) => void;
}

const RECENT_KEY = "southernvt-command-palette-recent";

const emptyResults: GroupedSearchResults = {
  places: [],
  collections: [],
  media: [],
  basecamp: [],
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [groupedResults, setGroupedResults] = useState<GroupedSearchResults>(emptyResults);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const flatResults = useMemo(
    () => [...groupedResults.places, ...groupedResults.collections, ...groupedResults.media, ...groupedResults.basecamp],
    [groupedResults],
  );

  const quickActions = useMemo(() => groupedResults.basecamp.slice(0, 4), [groupedResults.basecamp]);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const activateResult = useCallback((result: SearchResult) => {
    if (!result?.url) {
      return;
    }

    setRecentSearches((current) => {
      const next = [result.title, ...current.filter((item) => item !== result.title)].slice(0, 8);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // ignore local storage errors
      }
      return next;
    });

    setOpen(false);
    setQuery("");
    router.push(result.url);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      void searchAll(query).then((nextResults) => {
        if (!cancelled) {
          setGroupedResults(nextResults);
        }
      });
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    // Keep keyboard selection reset in sync with query changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!flatResults.length) {
      if (selectedIndex !== 0) {
        // Safe local state correction for list-size changes.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedIndex(0);
      }
      return;
    }

    if (selectedIndex >= flatResults.length) {
      // Safe local state correction for list-size changes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIndex(flatResults.length - 1);
    }
  }, [flatResults.length, selectedIndex]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(RECENT_KEY);
      if (saved) {
        // Safe hydration from local storage for local UI state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentSearches(JSON.parse(saved) as string[]);
      }
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }

      if (!open) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closePalette();
        return;
      }

      if (event.key === "ArrowDown" && flatResults.length) {
        event.preventDefault();
        setSelectedIndex((current) => (current + 1) % flatResults.length);
      }

      if (event.key === "ArrowUp" && flatResults.length) {
        event.preventDefault();
        setSelectedIndex((current) => (current - 1 + flatResults.length) % flatResults.length);
      }

      if (event.key === "Enter" && flatResults.length) {
        event.preventDefault();
        const selected = flatResults[selectedIndex];
        if (selected) {
          activateResult(selected);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flatResults, open, selectedIndex, closePalette, activateResult]);

  const openPalette = () => setOpen(true);

  return (
    <SearchContext.Provider
      value={{
        open,
        query,
        selectedIndex,
        groupedResults,
        recentSearches,
        quickActions,
        flatResults,
        setQuery,
        setOpen,
        setSelectedIndex,
        openPalette,
        closePalette,
        activateResult,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return context;
}

import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { searchAll } from "@/lib/search/SearchService";
import { createPageMetadata } from "@/lib/seo";
import type { SearchResult, SearchResultType } from "@/types/Search";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

const emptySearchSuggestions = [
  "Waterfalls",
  "Stays",
  "Restaurants",
  "Bellows Falls",
  "Manchester",
  "Family friendly",
  "Rainy day",
] as const;

const resultTypeLabels: Record<SearchResultType, string> = {
  place: "Place",
  business: "Business",
  stay: "Stay",
  guide: "Guide",
  collection: "Collection",
  event: "Event",
};

export const metadata: Metadata = createPageMetadata({
  title: "Search SouthernVT | Places, businesses, stays, and guides",
  description: "Search Southern Vermont places, local businesses, stays, collections, guides, and events.",
  path: "/search",
});

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const groupedResults = await searchAll(query);
  const results: SearchResult[] = [
    ...groupedResults.places,
    ...groupedResults.businesses,
    ...groupedResults.stays,
    ...groupedResults.guides,
    ...groupedResults.collections,
    ...groupedResults.events,
  ];

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="border-b border-(--color-pine)/20 bg-gradient-to-br from-[#12241d] via-[#1f3b2f] to-[#405d4c] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">Search SouthernVT</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">Find places, businesses, stays, guides, and events.</h1>
          <form action="/search" method="get" className="mt-6 max-w-3xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search waterfalls, restaurants, stays, guides..."
                className="h-12 w-full rounded-2xl border border-white/20 bg-white/95 px-4 text-sm text-slate-900 placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-(--color-maple-gold) px-6 text-sm font-semibold text-(--color-forest-green) motion-safe:transition motion-safe:hover:opacity-90"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        {!query ? (
          <div className="rounded-[24px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Try these suggestions</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {emptySearchSuggestions.map((suggestion) => (
                <Link
                  key={suggestion}
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="rounded-full border border-[#d8c9ad] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-[24px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">No results yet. Try a broader search or suggest a place.</p>
            <Link
              href="/feedback?category=Missing%20Place"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-(--color-forest-green) px-5 text-sm font-semibold text-(--color-cream) motion-safe:transition motion-safe:hover:bg-(--color-pine)"
            >
              Suggest a Place
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {results.length} result{results.length === 1 ? "" : "s"} for <span className="font-semibold text-slate-900">&quot;{query}&quot;</span>
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm transition hover:border-[#d7c4a0] hover:shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{result.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{result.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-[#f1e8d5] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
                      {resultTypeLabels[result.type]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

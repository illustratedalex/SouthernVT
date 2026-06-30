import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FeatureGate } from "@/components/FeatureGate";
import { CollectionCard } from "@/components/public/CollectionCard";
import { CollectionFilters } from "@/components/public/CollectionFilters";
import { ComingSoon } from "@/components/public/ComingSoon";
import { createPageMetadata } from "@/lib/seo";
import { getCollections } from "@/lib/repositories/collectionRepository";

interface CollectionsPageProps {
  searchParams: Promise<{
    q?: string;
    season?: string;
    audience?: string;
  }>;
}

export const metadata: Metadata = createPageMetadata({
  title: "Collection Guides for Southern Vermont",
  description: "Explore curated Southern Vermont guides by season, audience, and travel style.",
  path: "/collections",
});

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const params = await searchParams;
  const search = params.q?.trim() ?? "";
  const season = params.season?.trim() || "All";
  const audience = params.audience?.trim() || "All";

  const loadedCollections = await getCollections();
  const safeCollections = Array.isArray(loadedCollections) ? loadedCollections : [];
  const allPublished = safeCollections.filter((collection) => collection.status === "published");

  const seasons = [...new Set(allPublished.map((collection) => collection.season))].sort((a, b) => a.localeCompare(b));
  const audiences = [...new Set(allPublished.map((collection) => collection.audience))].sort((a, b) => a.localeCompare(b));

  const featuredCollections = allPublished.filter((collection) => collection.featured).slice(0, 4);

  const filteredCollections = allPublished.filter((collection) => {
    const matchesSearch =
      !search ||
      [collection.title, collection.subtitle, collection.description, collection.season, collection.audience, ...(Array.isArray(collection.tags) ? collection.tags : [])]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesSeason = season === "All" || collection.season === season;
    const matchesAudience = audience === "All" || collection.audience === audience;

    return matchesSearch && matchesSeason && matchesAudience;
  });

  return (
    <FeatureGate
      flag="publicCollections"
      fallback={
        <ComingSoon
          title="Collections Are Being Expanded"
          description="Our team is rolling out richer collection narratives, stronger route previews, and upgraded planning modules."
          eyebrow="Public Collections"
        />
      }
    >
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-gradient-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">SouthernVT Guides</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Plan with curated local collections.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            Discover seasonal itineraries and themed guide collections built from the best places across Southern Vermont.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <CollectionFilters search={search} season={season} audience={audience} seasons={seasons} audiences={audiences} />

        {featuredCollections.length ? (
          <section className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-pine)">Featured collections</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Popular trailhead guides</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-3xl font-semibold text-slate-900">Browse all guides</h2>
            <p className="text-sm text-slate-600">{filteredCollections.length} result{filteredCollections.length === 1 ? "" : "s"}</p>
          </div>

          {filteredCollections.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#e8dfc8] bg-white p-6 text-sm leading-7 text-slate-700 shadow-sm">
              No collections match those filters yet. Try another season or audience.
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
    </FeatureGate>
  );
}

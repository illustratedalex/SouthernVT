import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FeatureGate } from "@/components/FeatureGate";
import { ComingSoon } from "@/components/public/ComingSoon";
import { PlaceCard } from "@/components/public/PlaceCard";
import { PublicSearchFilters } from "@/components/public/PublicSearchFilters";
import { createPageMetadata } from "@/lib/seo";
import { getPlaces } from "@/repositories/PlaceRepository";

interface PlacesPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    category?: string;
  }>;
}

export const metadata: Metadata = createPageMetadata({
  title: "Explore Places in Southern Vermont",
  description: "Browse waterfalls, trails, inns, breweries, and local favorites across Southern Vermont.",
  path: "/places",
});

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
  const params = await searchParams;
  const search = params.q?.trim() ?? "";
  const placeType = params.type?.trim() || "All";
  const category = params.category?.trim() || "All";

  const loadedPlaces = await getPlaces();
  const safePlaces = Array.isArray(loadedPlaces) ? loadedPlaces : [];
  const allPublished = safePlaces.filter((place) => place.status === "published");

  const placeTypes = [...new Set(allPublished.map((place) => place.placeType))].sort((a, b) => a.localeCompare(b));
  const categories = [...new Set(allPublished.flatMap((place) => (Array.isArray(place.categories) ? place.categories : [])))].sort((a, b) => a.localeCompare(b));

  const featuredPlaces = allPublished.filter((place) => place.featured).slice(0, 4);

  const filteredPlaces = allPublished.filter((place) => {
    const matchesSearch =
      !search ||
      [place.name, place.description, place.city, place.placeType, ...(Array.isArray(place.categories) ? place.categories : []), ...(Array.isArray(place.tags) ? place.tags : [])]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesType = placeType === "All" || place.placeType === placeType;
    const matchesCategory = category === "All" || (Array.isArray(place.categories) && place.categories.includes(category));

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <FeatureGate
      flag="publicPlaces"
      fallback={
        <ComingSoon
          title="Places Directory Is On The Way"
          description="We are shaping a richer public places experience with editorial highlights, seasonal context, and cleaner discovery tools."
          eyebrow="Public Places"
        />
      }
    >
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-gradient-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">SouthernVT Directory</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Find places worth the detour.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            Explore handpicked places across Southern Vermont, from scenic trails and swimming holes to inns, breweries, and weekend stops.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <PublicSearchFilters search={search} placeType={placeType} category={category} placeTypes={placeTypes} categories={categories} />

        {featuredPlaces.length ? (
          <section className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-pine)">Featured places</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Editor favorites for this season</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-3xl font-semibold text-slate-900">Browse all places</h2>
            <p className="text-sm text-slate-600">{filteredPlaces.length} result{filteredPlaces.length === 1 ? "" : "s"}</p>
          </div>

          {filteredPlaces.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#e8dfc8] bg-white p-6 text-sm leading-7 text-slate-700 shadow-sm">
              No places match those filters yet. Try a different category or place type.
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
    </FeatureGate>
  );
}

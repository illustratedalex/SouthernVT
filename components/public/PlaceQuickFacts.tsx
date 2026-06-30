import type { Place } from "@/types/Place";

interface PlaceQuickFactsProps {
  place: Place;
  averageRating: number;
  reviewCount: number;
  nearbyPlacesCount: number;
  collectionsCount: number;
  guidesCount: number;
  eventsCount: number;
  dealsCount: number;
}

function formatRating(value: number) {
  return value ? value.toFixed(1) : "0.0";
}

export function PlaceQuickFacts({
  place,
  averageRating,
  reviewCount,
  nearbyPlacesCount,
  collectionsCount,
  guidesCount,
  eventsCount,
  dealsCount,
}: PlaceQuickFactsProps) {
  const facts = [
    { label: "Type", value: place.placeType },
    { label: "Location", value: place.city },
    { label: "Rating", value: `${formatRating(averageRating)} (${reviewCount})` },
    { label: "Nearby", value: `${nearbyPlacesCount} places` },
    { label: "Collections", value: `${collectionsCount} featured` },
    { label: "Guides", value: `${guidesCount} related` },
    { label: "Events", value: `${eventsCount} nearby` },
    { label: "Deals", value: `${dealsCount} nearby` },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {facts.map((fact) => (
        <article key={fact.label} className="rounded-3xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">{fact.label}</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{fact.value}</p>
        </article>
      ))}
    </section>
  );
}

import type { Place } from "@/types/Place";

interface CollectionPlaceListProps {
  places: Place[];
}

export function CollectionPlaceList({ places }: CollectionPlaceListProps) {
  return (
    <section className="rounded-[30px] border border-(--color-pine)/20 bg-white p-8 shadow-[0_20px_70px_rgba(31,59,47,0.08)]">
      <h2 className="text-2xl font-semibold text-(--color-forest-green)">Places in this collection</h2>
      {places.length ? (
        <div className="mt-6 grid gap-4">
          {places.map((place, index) => (
            <article key={place.id} className="flex flex-col gap-4 rounded-[22px] border border-(--color-pine)/15 bg-(--color-cream) p-4 sm:flex-row sm:items-start">
              <img src={place.featuredImage} alt={place.name} className="h-28 w-full rounded-xl object-cover sm:w-40" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-pine)">Stop {index + 1}</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{place.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{place.placeType} · {place.city}, {place.state}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{place.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">This guide does not have published places linked yet.</p>
      )}
    </section>
  );
}

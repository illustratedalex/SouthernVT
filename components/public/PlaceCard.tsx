import Link from "next/link";
import type { Place } from "@/types/Place";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <article className="overflow-hidden rounded-[26px] border border-[#e8dfc8] bg-white shadow-[0_14px_48px_rgba(31,59,47,0.1)] motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_18px_55px_rgba(31,59,47,0.14)]">
      <div className="relative h-48 overflow-hidden">
        <img src={place.featuredImage} alt={place.name} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-full bg-(--color-cream)/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-(--color-forest-green)">
          {place.placeType}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{place.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{place.city}, {place.state}</p>
        </div>

        <p className="line-clamp-3 text-sm leading-7 text-slate-700">{place.description}</p>

        <div className="flex flex-wrap gap-2">
          {place.categories.slice(0, 3).map((category) => (
            <span key={category} className="rounded-full bg-[#f7efe1] px-3 py-1 text-xs font-semibold text-[#1f3b2f]">
              {category}
            </span>
          ))}
        </div>

        <Link
          href={`/places/${place.slug}`}
          className="inline-flex rounded-full bg-(--color-forest-green) px-4 py-2 text-sm font-semibold text-(--color-cream) motion-safe:transition motion-safe:hover:bg-(--color-pine) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-maple-gold) focus-visible:ring-offset-2"
        >
          View place
        </Link>
      </div>
    </article>
  );
}

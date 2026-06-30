import type { Place } from "@/types/Place";

interface PlaceInfoCardsProps {
  place: Place;
}

export function PlaceInfoCards({ place }: PlaceInfoCardsProps) {
  return (
    <div className="space-y-4">
      <article className="rounded-[24px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-pine)">Location</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">{place.address}, {place.city}, {place.state} {place.zip}</p>
      </article>

      <article className="rounded-[24px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-pine)">Contact</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          <p>{place.phone}</p>
          <p>{place.email}</p>
          <a href={place.website} target="_blank" rel="noreferrer" className="text-(--color-forest-green) underline-offset-2 hover:underline">
            Visit website
          </a>
        </div>
      </article>

      <article className="rounded-[24px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-pine)">Hours</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">{place.hours || "Hours vary by season. Please contact the venue directly for current times."}</p>
      </article>

      <article className="rounded-[24px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-pine)">Amenities</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {place.amenities.length ? (
            place.amenities.map((amenity) => (
              <span key={amenity} className="rounded-full bg-[#f7efe1] px-3 py-1 text-xs font-semibold text-(--color-forest-green)">
                {amenity}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-600">Amenities are being updated by the SouthernVT editorial team.</p>
          )}
        </div>
      </article>
    </div>
  );
}

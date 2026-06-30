import type { Place } from "@/types/Place";

interface PlaceAmenitiesProps {
  place: Place;
}

export function PlaceAmenities({ place }: PlaceAmenitiesProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
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
    </section>
  );
}

import Link from "next/link";
import type { Place } from "@/types/Place";

interface PlaceLocationCardProps {
  place: Place;
}

export function PlaceLocationCard({ place }: PlaceLocationCardProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.city} VT`)}`;

  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-pine)">Location and directions</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">
        {place.address}, {place.city}, {place.state} {place.zip}
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Coordinates: {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={mapsUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#1f3b2f] px-4 py-2 text-sm font-semibold text-[#f8f2e4]">
          Open in Maps
        </Link>
        <Link href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${place.latitude},${place.longitude}`)}`} target="_blank" rel="noreferrer" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700">
          Get directions
        </Link>
      </div>
    </section>
  );
}

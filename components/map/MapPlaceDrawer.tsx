"use client";

import Link from "next/link";
import type { Place } from "@/types/Place";

interface MapPlaceDrawerProps {
  place: Place | null;
  onClose: () => void;
}

export function MapPlaceDrawer({ place, onClose }: MapPlaceDrawerProps) {
  const open = Boolean(place);

  return (
    <>
      <aside className={`hidden w-[22rem] shrink-0 border-l border-[#e2d7bf] bg-white p-5 lg:block ${open ? "" : "opacity-70"}`}>
        {place ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Selected place</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{place.name}</h2>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border border-[#d7cbb3] px-3 py-1 text-xs font-semibold text-slate-700">Close</button>
            </div>

            <p className="text-sm font-medium text-slate-600">{place.placeType}</p>
            <p className="text-sm leading-7 text-slate-700">{place.description}</p>
            <p className="text-sm text-slate-700">{place.address}, {place.city}, {place.state} {place.zip}</p>

            <div className="flex flex-wrap gap-2">
              {place.amenities.map((amenity) => (
                <span key={amenity} className="rounded-full bg-[#f7efe1] px-3 py-1 text-xs font-semibold text-[#1f3b2f]">{amenity}</span>
              ))}
              {place.featured ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Featured</span> : null}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link href={`/places/${place.slug}`} className="inline-flex justify-center rounded-full bg-[#1f3b2f] px-4 py-2 text-sm font-semibold text-[#f8f2e4]">
                View details
              </Link>
              <button type="button" className="rounded-full border border-[#d7cbb3] px-4 py-2 text-sm font-semibold text-slate-700">
                Add to trip (coming soon)
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-600">Select a pin to view place details.</p>
        )}
      </aside>

      <div className={`fixed inset-x-0 bottom-0 z-40 rounded-t-[26px] border border-[#e2d7bf] bg-white p-4 shadow-[0_-20px_60px_rgba(31,59,47,0.18)] transition lg:hidden ${open ? "translate-y-0" : "translate-y-full"}`}>
        {place ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">{place.name}</h2>
              <button type="button" onClick={onClose} className="rounded-full border border-[#d7cbb3] px-3 py-1 text-xs font-semibold text-slate-700">Close</button>
            </div>
            <p className="text-sm text-slate-600">{place.placeType}</p>
            <p className="line-clamp-3 text-sm leading-7 text-slate-700">{place.description}</p>
            <div className="flex gap-2">
              <Link href={`/places/${place.slug}`} className="inline-flex flex-1 justify-center rounded-full bg-[#1f3b2f] px-4 py-2 text-sm font-semibold text-[#f8f2e4]">
                View details
              </Link>
              <button type="button" className="rounded-full border border-[#d7cbb3] px-4 py-2 text-sm font-semibold text-slate-700">
                Add to trip
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

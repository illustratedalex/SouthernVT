import type { Place } from "@/types/Place";
import { getTypeIcon } from "./MapMarker";

interface MapPopupProps {
  place: Place;
  onViewDetails: () => void;
  onAddToTrip: () => void;
}

export function MapPopup({ place, onViewDetails, onAddToTrip }: MapPopupProps) {
  return (
    <div className="w-[min(92vw,340px)] overflow-hidden rounded-[24px] border border-[#e8dfc8] bg-white shadow-[0_20px_50px_rgba(31,59,47,0.2)]">
      <div className="h-36 overflow-hidden border-b border-[#efe6d1] bg-[#f7efe1]">
        <img src={place.featuredImage} alt={place.name} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getTypeIcon(place.placeType)}</span>
          <span className="rounded-full bg-[#f7efe1] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
            {place.placeType}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{place.name}</h3>
        <p className="line-clamp-3 text-sm leading-7 text-slate-700">{place.description}</p>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Distance: -- mi</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onViewDetails}
            className="rounded-full bg-[#1f3b2f] px-4 py-2 text-sm font-semibold text-[#f8f2e4] transition hover:bg-[#3e5b4a]"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={onAddToTrip}
            className="rounded-full border border-[#d9ccb2] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f7efe1]"
          >
            Add to Trip
          </button>
        </div>
      </div>
    </div>
  );
}

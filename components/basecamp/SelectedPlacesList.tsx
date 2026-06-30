import type { Place } from "@/types/Place";

interface SelectedPlacesListProps {
  places: Place[];
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SelectedPlacesList({ places, onMoveUp, onMoveDown, onRemove }: SelectedPlacesListProps) {
  if (!places.length) {
    return <p className="text-sm text-slate-500">Select places to build this collection.</p>;
  }

  return (
    <div className="space-y-3">
      {places.map((place, index) => (
        <div key={place.id} className="flex items-center justify-between gap-3 rounded-[22px] border border-[#e8dfc8] bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe1] text-sm font-bold text-[#1f3b2f]">
              {index + 1}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{place.name}</p>
              <p className="text-sm text-slate-500">{place.city}, {place.state}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onMoveUp(place.id)} className="rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-stone-50">
              ↑
            </button>
            <button type="button" onClick={() => onMoveDown(place.id)} className="rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-stone-50">
              ↓
            </button>
            <button type="button" onClick={() => onRemove(place.id)} className="rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-stone-50">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

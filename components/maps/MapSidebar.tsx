import type { Place } from "@/types/Place";
import type { MapFiltersState } from "@/lib/maps/MapService";
import { MapFilters } from "./MapFilters";
import { MapLegend } from "./MapLegend";

interface MapSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: MapFiltersState;
  onFiltersChange: (next: MapFiltersState) => void;
  filterOptions: {
    placeTypes: string[];
    categories: string[];
    amenities: string[];
    seasons: string[];
  };
  visiblePlaces: Place[];
  onSelectPlace: (place: Place) => void;
}

export function MapSidebar({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  filterOptions,
  visiblePlaces,
  onSelectPlace,
}: MapSidebarProps) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="absolute left-4 top-4 z-20 rounded-full bg-[#1f3b2f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f8f2e4] shadow-lg lg:hidden"
      >
        Filters
      </button>

      <aside
        className={`absolute left-0 top-0 z-30 h-full w-[86vw] max-w-[360px] transform border-r border-[#d7cbb3] bg-[#f8f2e4] p-4 shadow-[0_20px_60px_rgba(31,59,47,0.22)] transition duration-300 lg:relative lg:z-10 lg:w-[340px] lg:max-w-none lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Trailhead Map</p>
            <p className="mt-1 text-sm text-slate-600">{visiblePlaces.length} places visible</p>
          </div>
          <button type="button" onClick={onToggle} className="rounded-full border border-[#d7cbb3] px-3 py-1 text-xs font-semibold text-slate-700 lg:hidden">
            Close
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pb-6" style={{ maxHeight: "calc(100vh - 84px)" }}>
          <MapFilters
            filters={filters}
            onChange={onFiltersChange}
            placeTypes={filterOptions.placeTypes}
            categories={filterOptions.categories}
            amenities={filterOptions.amenities}
            seasons={filterOptions.seasons}
          />

          <MapLegend placeTypes={filterOptions.placeTypes} />

          <section className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Results</h3>
            <div className="mt-3 space-y-2">
              {visiblePlaces.slice(0, 10).map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => onSelectPlace(place)}
                  className="w-full rounded-xl border border-[#efe6d1] bg-[#fcfaf6] px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:border-[#d8b15d]"
                >
                  {place.name}
                  <span className="mt-1 block text-xs font-medium text-slate-500">{place.placeType} · {place.city}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

"use client";

import type { PlaceType } from "@/types/Place";

export interface MapFilters {
  search: string;
  placeType: PlaceType | "All";
  categories: string[];
  amenities: string[];
  featuredOnly: boolean;
}

interface MapFilterSidebarProps {
  filters: MapFilters;
  placeTypes: Array<PlaceType>;
  categories: string[];
  amenities: string[];
  resultCount: number;
  mobileOpen: boolean;
  onMobileToggle: () => void;
  onSearchChange: (value: string) => void;
  onPlaceTypeChange: (value: PlaceType | "All") => void;
  onCategoryToggle: (value: string) => void;
  onAmenityToggle: (value: string) => void;
  onFeaturedOnlyToggle: (value: boolean) => void;
}

function PillButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        active ? "border-[#1f3b2f] bg-[#1f3b2f] text-[#f8f2e4]" : "border-[#d7cbb3] bg-white text-slate-700 hover:bg-[#f7efe1]"
      }`}
    >
      {label}
    </button>
  );
}

export function MapFilterSidebar({
  filters,
  placeTypes,
  categories,
  amenities,
  resultCount,
  mobileOpen,
  onMobileToggle,
  onSearchChange,
  onPlaceTypeChange,
  onCategoryToggle,
  onAmenityToggle,
  onFeaturedOnlyToggle,
}: MapFilterSidebarProps) {
  return (
    <aside className="border-r border-[#e2d7bf] bg-[#fcfaf6] lg:w-80 lg:shrink-0 lg:overflow-y-auto">
      <div className="border-b border-[#ece1ca] p-4 lg:hidden">
        <button type="button" onClick={onMobileToggle} className="w-full rounded-full border border-[#d7cbb3] bg-white px-4 py-3 text-sm font-semibold text-slate-800">
          {mobileOpen ? "Hide filters" : "Show filters"}
        </button>
      </div>

      <div className={`${mobileOpen ? "block" : "hidden"} space-y-5 p-4 lg:block lg:p-5`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Filters</p>
          <p className="mt-2 text-sm text-slate-600">{resultCount} published places visible</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Search</label>
          <input
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, tags, city"
            className="h-11 w-full rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Place Type</label>
          <select
            value={filters.placeType}
            onChange={(event) => onPlaceTypeChange(event.target.value as PlaceType | "All")}
            className="h-11 w-full rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="All">All types</option>
            {placeTypes.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <PillButton
                key={item}
                label={item}
                active={filters.categories.includes(item)}
                onClick={() => onCategoryToggle(item)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {amenities.map((item) => (
              <PillButton
                key={item}
                label={item}
                active={filters.amenities.includes(item)}
                onClick={() => onAmenityToggle(item)}
              />
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-full border border-[#d7cbb3] bg-white px-4 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.featuredOnly}
            onChange={(event) => onFeaturedOnlyToggle(event.target.checked)}
          />
          Featured only
        </label>
      </div>
    </aside>
  );
}

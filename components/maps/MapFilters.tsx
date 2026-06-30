import type { MapFiltersState } from "@/lib/maps/MapService";

interface MapFiltersProps {
  filters: MapFiltersState;
  placeTypes: string[];
  categories: string[];
  amenities: string[];
  seasons: string[];
  onChange: (next: MapFiltersState) => void;
}

export function MapFilters({ filters, placeTypes, categories, amenities, seasons, onChange }: MapFiltersProps) {
  const toggleArrayValue = (key: "placeTypes" | "categories" | "amenities", value: string) => {
    const current = filters[key];
    onChange({
      ...filters,
      [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Search</label>
        <input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search places"
          className="h-11 w-full rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
        />
      </div>

      <FilterGroup label="Place Type" options={placeTypes} selected={filters.placeTypes} onToggle={(value) => toggleArrayValue("placeTypes", value)} />
      <FilterGroup label="Categories" options={categories} selected={filters.categories} onToggle={(value) => toggleArrayValue("categories", value)} />
      <FilterGroup label="Amenities" options={amenities} selected={filters.amenities} onToggle={(value) => toggleArrayValue("amenities", value)} />

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Season</label>
        <select
          value={filters.season}
          onChange={(event) => onChange({ ...filters, season: event.target.value })}
          className="h-11 w-full rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-2 rounded-xl border border-[#e8dfc8] bg-white px-3 py-2 text-xs font-semibold text-slate-700">
          <input type="checkbox" checked={filters.featuredOnly} onChange={(event) => onChange({ ...filters, featuredOnly: event.target.checked })} />
          Featured only
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-[#e8dfc8] bg-white px-3 py-2 text-xs font-semibold text-slate-700">
          <input type="checkbox" checked={filters.openNow} onChange={(event) => onChange({ ...filters, openNow: event.target.checked })} />
          Open now
        </label>
      </div>
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterGroup({ label, options, selected, onToggle }: FilterGroupProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">{label}</p>
      <div className="max-h-28 space-y-2 overflow-y-auto pr-1">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 rounded-xl border border-[#e8dfc8] bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

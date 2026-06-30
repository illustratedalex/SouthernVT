import { Input } from "@/components/ui";

interface PlaceFiltersProps {
  search: string;
  placeType: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function PlaceFilters({ search, placeType, onSearchChange, onTypeChange }: PlaceFiltersProps) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm md:grid-cols-[1.3fr_0.8fr]">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search places" className="h-12 rounded-full" />
      <select
        value={placeType}
        onChange={(event) => onTypeChange(event.target.value)}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      >
        <option value="All">All place types</option>
        <option value="Restaurant">Restaurant</option>
        <option value="Waterfall">Waterfall</option>
        <option value="Hotel">Hotel</option>
        <option value="Trail">Trail</option>
      </select>
    </div>
  );
}

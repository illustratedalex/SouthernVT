import { Input } from "@/components/ui";
import type { PlaceStatus, PlaceType } from "@/types/Place";

interface PlaceFiltersProps {
  search: string;
  placeType: PlaceType | "All";
  status: PlaceStatus | "All";
  onSearchChange: (value: string) => void;
  onTypeChange: (value: PlaceType | "All") => void;
  onStatusChange: (value: PlaceStatus | "All") => void;
}

const placeTypes: Array<PlaceType> = [
  "Restaurant",
  "Waterfall",
  "Brewery",
  "Hotel",
  "Trail",
  "Covered Bridge",
  "Maker Studio",
  "Farm Stand",
  "Scenic Overlook",
  "Shop",
];

const statuses: Array<PlaceStatus> = ["draft", "published", "archived"];

export function PlaceFilters({ search, placeType, status, onSearchChange, onTypeChange, onStatusChange }: PlaceFiltersProps) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search places" className="h-12 rounded-full" />
      <select
        value={placeType}
        onChange={(event) => onTypeChange(event.target.value as PlaceType | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      >
        <option value="All">All place types</option>
        {placeTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as PlaceStatus | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      >
        <option value="All">All statuses</option>
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

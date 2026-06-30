import { Input } from "@/components/ui";
import type { CollectionSeason, CollectionStatus } from "@/types/Collection";

interface CollectionFiltersProps {
  search: string;
  season: string;
  status: string;
  onSearchChange: (value: string) => void;
  onSeasonChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const seasons: Array<"All" | CollectionSeason> = ["All", "Spring", "Summer", "Fall", "Winter", "Year-Round"];
const statuses: Array<"All" | CollectionStatus> = ["All", "draft", "published", "archived"];

export function CollectionFilters({ search, season, status, onSearchChange, onSeasonChange, onStatusChange }: CollectionFiltersProps) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search collections" className="h-12 rounded-full" />
      <select
        value={season}
        onChange={(event) => onSeasonChange(event.target.value)}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      >
        {seasons.map((item) => (
          <option key={item} value={item}>
            {item === "All" ? "All seasons" : item}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item === "All" ? "All statuses" : item}
          </option>
        ))}
      </select>
    </div>
  );
}

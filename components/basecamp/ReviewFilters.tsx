import { Input } from "@/components/ui";
import type { ReviewStatus } from "@/types/Review";

interface ReviewFiltersProps {
  search: string;
  status: ReviewStatus | "All";
  placeId: string | "All";
  places: Array<{ id: string; name: string }>;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ReviewStatus | "All") => void;
  onPlaceChange: (value: string | "All") => void;
}

const statuses: ReviewStatus[] = ["pending", "approved", "rejected", "archived"];

export function ReviewFilters({
  search,
  status,
  placeId,
  places,
  onSearchChange,
  onStatusChange,
  onPlaceChange,
}: ReviewFiltersProps) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm lg:grid-cols-[1.2fr_0.8fr_1fr]">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search reviews" className="h-12 rounded-full" />

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as ReviewStatus | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none"
      >
        <option value="All">All statuses</option>
        {statuses.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select
        value={placeId}
        onChange={(event) => onPlaceChange(event.target.value as string | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none"
      >
        <option value="All">All places</option>
        {places.map((place) => (
          <option key={place.id} value={place.id}>{place.name}</option>
        ))}
      </select>
    </div>
  );
}

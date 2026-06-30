import { Input } from "@/components/ui";
import type { EventStatus, EventType } from "@/types/Event";

interface EventFiltersProps {
  search: string;
  status: EventStatus | "All";
  eventType: EventType | "All";
  sort: "date-asc" | "date-desc";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: EventStatus | "All") => void;
  onEventTypeChange: (value: EventType | "All") => void;
  onSortChange: (value: "date-asc" | "date-desc") => void;
}

const statuses: Array<EventStatus> = ["draft", "review", "scheduled", "published", "archived"];
const eventTypes: Array<EventType> = ["market", "festival", "music", "walk", "craft", "community"];

export function EventFilters({
  search,
  status,
  eventType,
  sort,
  onSearchChange,
  onStatusChange,
  onEventTypeChange,
  onSortChange,
}: EventFiltersProps) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search events" className="h-12 rounded-full" />

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as EventStatus | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none"
      >
        <option value="All">All statuses</option>
        {statuses.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select
        value={eventType}
        onChange={(event) => onEventTypeChange(event.target.value as EventType | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none"
      >
        <option value="All">All event types</option>
        {eventTypes.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value as "date-asc" | "date-desc")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none"
      >
        <option value="date-asc">Date ascending</option>
        <option value="date-desc">Date descending</option>
      </select>
    </div>
  );
}

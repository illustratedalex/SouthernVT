import { Input } from "@/components/ui";
import type { DealStatus, DealType } from "@/types/Deal";

interface DealFiltersProps {
  search: string;
  status: DealStatus | "All";
  dealType: DealType | "All";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: DealStatus | "All") => void;
  onDealTypeChange: (value: DealType | "All") => void;
}

const statuses: Array<DealStatus> = ["draft", "review", "scheduled", "published", "archived"];
const dealTypes: Array<DealType> = ["discount", "freebie", "package", "seasonal", "event", "member_only"];

export function DealFilters({ search, status, dealType, onSearchChange, onStatusChange, onDealTypeChange }: DealFiltersProps) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search deals" className="h-12 rounded-full" />

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as DealStatus | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none"
      >
        <option value="All">All statuses</option>
        {statuses.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select
        value={dealType}
        onChange={(event) => onDealTypeChange(event.target.value as DealType | "All")}
        className="h-12 rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none"
      >
        <option value="All">All deal types</option>
        {dealTypes.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

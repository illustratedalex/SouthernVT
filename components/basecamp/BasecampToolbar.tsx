import type { ReactNode } from "react";
import { Input } from "@/components/ui";

interface BasecampToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  sortLabel?: string;
  viewLabel?: string;
  bulkLabel?: string;
  className?: string;
}

export function BasecampToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search",
  filters,
  sortLabel = "Sort",
  viewLabel = "View",
  bulkLabel = "Bulk actions",
  className = "",
}: BasecampToolbarProps) {
  return (
    <section className={`rounded-[28px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm backdrop-blur ${className}`.trim()}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_auto_auto_auto] lg:items-center">
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="h-12 rounded-full"
        />

        <button type="button" aria-label={`${sortLabel} placeholder`} className="h-12 rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm font-semibold text-slate-700 transition hover:bg-[#f4ebd5]">
          {sortLabel}
        </button>
        <button type="button" aria-label={`${viewLabel} placeholder`} className="h-12 rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm font-semibold text-slate-700 transition hover:bg-[#f4ebd5]">
          {viewLabel}
        </button>
        <button type="button" aria-label={`${bulkLabel} placeholder`} className="h-12 rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm font-semibold text-slate-700 transition hover:bg-[#f4ebd5]">
          {bulkLabel}
        </button>
      </div>

      {filters ? <div className="mt-4">{filters}</div> : null}
    </section>
  );
}
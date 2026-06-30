import type { PlaceType } from "@/types/Place";
import { cn } from "@/components/ui/cn";

const typeStyles: Record<PlaceType, string> = {
  Restaurant: "bg-rose-100 text-rose-800 border-rose-200",
  Waterfall: "bg-sky-100 text-sky-800 border-sky-200",
  Brewery: "bg-amber-100 text-amber-800 border-amber-200",
  Hotel: "bg-violet-100 text-violet-800 border-violet-200",
  Trail: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Covered Bridge": "bg-stone-100 text-stone-800 border-stone-200",
  "Maker Studio": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  "Farm Stand": "bg-lime-100 text-lime-800 border-lime-200",
  "Scenic Overlook": "bg-cyan-100 text-cyan-800 border-cyan-200",
  Shop: "bg-orange-100 text-orange-800 border-orange-200",
};

export function PlaceTypeBadge({ placeType }: { placeType: PlaceType }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]", typeStyles[placeType])}>
      {placeType}
    </span>
  );
}

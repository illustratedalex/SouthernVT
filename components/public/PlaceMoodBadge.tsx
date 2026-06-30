import type { PlaceMood } from "@/types/PlaceDNA";

type PlaceMoodBadgeProps = {
  mood: PlaceMood;
};

function formatMood(value: PlaceMood): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function PlaceMoodBadge({ mood }: PlaceMoodBadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-[#cdbb96] bg-[#f8f2e4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1f3b2f]">
      {formatMood(mood)}
    </span>
  );
}

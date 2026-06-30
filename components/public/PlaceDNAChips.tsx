import { PlaceMoodBadge } from "@/components/public/PlaceMoodBadge";
import type { PlaceMood } from "@/types/PlaceDNA";

type PlaceDNAChipsProps = {
  moods: PlaceMood[];
};

export function PlaceDNAChips({ moods }: PlaceDNAChipsProps) {
  if (!moods.length) {
    return <p className="text-sm text-slate-600">No moods tagged yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <PlaceMoodBadge key={mood} mood={mood} />
      ))}
    </div>
  );
}

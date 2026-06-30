import { PlaceDNAChips } from "@/components/public/PlaceDNAChips";
import type { PlaceDNA } from "@/types/PlaceDNA";

type PlaceDNACardProps = {
  dna: PlaceDNA | null;
};

function formatEnum(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function List({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm text-slate-600">Not specified yet.</p>;
  }

  return (
    <ul className="space-y-2 text-sm leading-7 text-slate-700">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1f3b2f]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlaceDNACard({ dna }: PlaceDNACardProps) {
  if (!dna) {
    return (
      <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Place DNA</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Personality Profile</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This destination has not been profiled yet. Editorial DNA will appear here as Compass tuning expands.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Place DNA</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Personality Profile</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Difficulty</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{formatEnum(dna.difficulty)}</p>
        </article>
        <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Visit Length</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{formatEnum(dna.recommendedVisitLength)}</p>
        </article>
        <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Energy</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{formatEnum(dna.energyLevel)}</p>
        </article>
        <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Crowd Level</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{formatEnum(dna.crowdLevel)}</p>
        </article>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Moods</p>
          <div className="mt-2">
            <PlaceDNAChips moods={dna.moods} />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Best Seasons</p>
            <div className="mt-2">
              <List items={dna.bestSeasons} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Best For</p>
            <div className="mt-2">
              <List items={dna.bestFor} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Avoid When</p>
            <div className="mt-2">
              <List items={dna.avoidWhen} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Weather Preference</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{formatEnum(dna.weatherPreference)}</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{dna.notes}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

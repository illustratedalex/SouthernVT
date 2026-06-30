import type { PassportStats } from "@/types/Passport";

interface PassportStatsProps {
  stats: PassportStats;
}

export function PassportStats({ stats }: PassportStatsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total members</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalMembers}</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total stamps</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalStamps}</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Active rewards</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.activeRewards}</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Top check-in place</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">{stats.topCheckInPlaces[0]?.placeName ?? "N/A"}</p>
      </article>
    </section>
  );
}

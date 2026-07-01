import type { PartnerDashboardStats } from "@/types/PartnerPortal";

interface PartnerStatsProps {
  stats: PartnerDashboardStats;
}

export function PartnerStats({ stats }: PartnerStatsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Place views</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.placeViews}</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Deal redemptions</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.dealRedemptions}</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Passport check-ins</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.passportCheckIns}</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Upcoming events</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.upcomingEvents}</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Profile completeness</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.profileCompleteness}%</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Deal views</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.dealViews ?? stats.dealRedemptions}</p>
      </article>
    </section>
  );
}

import type { AnalyticsSummary } from "@/types/Analytics";

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary;
}

export function AnalyticsSummaryCards({ summary }: AnalyticsSummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Total page views</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.totalPageViews.toLocaleString()}</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Unique visitors</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.totalUniqueVisitors.toLocaleString()}</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Avg time on page</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.avgTimeOnPage}s</p>
      </article>
      <article className="rounded-3xl border border-[#e8dfc8] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Avg bounce rate</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.avgBounceRate}%</p>
      </article>
    </section>
  );
}

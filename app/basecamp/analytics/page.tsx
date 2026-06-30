import {
  AnalyticsInsightCard,
  AnalyticsSummaryCards,
  EngagementTable,
  SearchMetricsTable,
  TopPagesTable,
  BasecampPageHeader,
  BasecampSection,
} from "@/components/basecamp";
import { isFeatureEnabled } from "@/lib/featureFlags";
import {
  getAnalyticsSummary,
  getEngagementMetrics,
  getSearchMetrics,
  getTopPages,
} from "@/repositories/AnalyticsRepository";

export default async function BasecampAnalyticsPage() {
  const [analyticsEnabled, summary, topPages, searchMetrics, engagementMetrics] = await Promise.all([
    isFeatureEnabled("analytics"),
    getAnalyticsSummary("30d"),
    getTopPages(6, "30d"),
    getSearchMetrics("30d"),
    getEngagementMetrics("30d"),
  ]);

  const safeSummary = summary ?? {
    period: "30d",
    totalPageViews: 0,
    totalUniqueVisitors: 0,
    avgTimeOnPage: 0,
    avgBounceRate: 0,
    totalPassportCheckIns: 0,
    totalDealRedemptions: 0,
  };
  const safeTopPages = Array.isArray(topPages) ? topPages : [];
  const safeSearchMetrics = Array.isArray(searchMetrics) ? searchMetrics : [];
  const safeEngagementMetrics = Array.isArray(engagementMetrics) ? engagementMetrics : [];

  const lowPerformingContent = safeTopPages
    .filter((page) => page.views < 3500 || page.bounceRate > 50)
    .slice(0, 4)
    .map((page) => `${page.title}: ${page.views.toLocaleString()} views, ${page.bounceRate}% bounce rate`);

  const engagementOverview = safeEngagementMetrics
    .slice(0, 4)
    .map((metric) => `${metric.title}: ${metric.saves + metric.shares + metric.reviews} key actions`);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <BasecampPageHeader
          eyebrow="Basecamp"
          title="Analytics dashboard"
          description="Monitor content performance, search behavior, and engagement signals across SouthernVT."
          statusPill={analyticsEnabled ? "Live" : "Preview"}
        />

        {!analyticsEnabled ? <BasecampSection title="Preview mode" eyebrow="Analytics" description="Analytics are in preview mode using sample data.">
          <p className="text-sm text-slate-700">Use the sample metrics below to validate dashboard layout and content hierarchy before live instrumentation lands.</p>
        </BasecampSection> : null}

        <AnalyticsSummaryCards summary={safeSummary} />

        <section className="grid gap-6 xl:grid-cols-2">
          <BasecampSection title="Top content" eyebrow="Analytics" className="p-5">
            <h2 className="text-xl font-semibold text-slate-900">Top content</h2>
            <TopPagesTable pages={safeTopPages} />
          </BasecampSection>

          <BasecampSection title="Top searches" eyebrow="Analytics" className="p-5">
            <h2 className="text-xl font-semibold text-slate-900">Top searches</h2>
            <SearchMetricsTable searches={safeSearchMetrics.slice(0, 6)} />
          </BasecampSection>
        </section>

        <BasecampSection title="Engagement overview" eyebrow="Analytics" className="p-5">
          <h2 className="text-xl font-semibold text-slate-900">Engagement overview</h2>
          <EngagementTable metrics={safeEngagementMetrics} />
        </BasecampSection>

        <section className="grid gap-6 xl:grid-cols-3">
          <AnalyticsInsightCard
            title="Passport check-ins"
            description="How often users are checking in through passport-enabled experiences."
            items={[`Total check-ins (30d): ${safeSummary.totalPassportCheckIns.toLocaleString()}`]}
          />
          <AnalyticsInsightCard
            title="Deal redemptions"
            description="Mock redemption indicators for offer performance by associated content."
            items={[`Total deal redemptions (30d): ${safeSummary.totalDealRedemptions.toLocaleString()}`]}
          />
          <AnalyticsInsightCard
            title="Low-performing content"
            description="Entries with lower traffic or higher bounce rates that may need content improvements."
            items={lowPerformingContent.length ? lowPerformingContent : ["No low-performing content detected in sample data."]}
          />
        </section>

        <BasecampSection title="Top engagement snapshot" eyebrow="Analytics" className="p-5">
          <AnalyticsInsightCard
            title="Top engagement snapshot"
            description="Fast view of pages and content that are driving saves, shares, and reviews."
            items={engagementOverview}
          />
        </BasecampSection>
      </div>
    </div>
  );
}

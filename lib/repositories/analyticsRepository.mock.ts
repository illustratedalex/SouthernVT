import { mockEngagementMetrics, mockPageViewMetrics, mockSearchMetrics } from "@/data/analytics";
import type { AnalyticsPeriod, AnalyticsSummary, EngagementMetric, PageViewMetric, SearchMetric } from "@/types/Analytics";

function byPeriod<T extends { period: AnalyticsPeriod }>(items: T[], period?: AnalyticsPeriod): T[] {
  if (!period) {
    return [...items];
  }
  return items.filter((item) => item.period === period);
}

function clonePageView(metric: PageViewMetric): PageViewMetric {
  return { ...metric };
}

function cloneSearch(metric: SearchMetric): SearchMetric {
  return { ...metric };
}

function cloneEngagement(metric: EngagementMetric): EngagementMetric {
  return { ...metric };
}

export async function getPageViews(period?: AnalyticsPeriod): Promise<PageViewMetric[]> {
  return byPeriod(mockPageViewMetrics, period)
    .sort((a, b) => b.views - a.views)
    .map(clonePageView);
}

export async function getTopPages(limit = 5, period?: AnalyticsPeriod): Promise<PageViewMetric[]> {
  const metrics = await getPageViews(period);
  return metrics.slice(0, limit).map(clonePageView);
}

export async function getSearchMetrics(period?: AnalyticsPeriod): Promise<SearchMetric[]> {
  return byPeriod(mockSearchMetrics, period)
    .sort((a, b) => b.clicks - a.clicks)
    .map(cloneSearch);
}

export async function getEngagementMetrics(period?: AnalyticsPeriod): Promise<EngagementMetric[]> {
  return byPeriod(mockEngagementMetrics, period)
    .sort((a, b) => (b.saves + b.shares + b.reviews + b.passportCheckIns + b.dealRedemptions) - (a.saves + a.shares + a.reviews + a.passportCheckIns + a.dealRedemptions))
    .map(cloneEngagement);
}

export async function getAnalyticsSummary(period: AnalyticsPeriod = "30d"): Promise<AnalyticsSummary> {
  const [pageViews, engagement] = await Promise.all([
    getPageViews(period),
    getEngagementMetrics(period),
  ]);

  const totalPageViews = pageViews.reduce((sum, metric) => sum + metric.views, 0);
  const totalUniqueVisitors = pageViews.reduce((sum, metric) => sum + metric.uniqueVisitors, 0);
  const avgTimeOnPage = pageViews.length ? Math.round(pageViews.reduce((sum, metric) => sum + metric.avgTimeOnPage, 0) / pageViews.length) : 0;
  const avgBounceRate = pageViews.length ? Number((pageViews.reduce((sum, metric) => sum + metric.bounceRate, 0) / pageViews.length).toFixed(1)) : 0;
  const totalPassportCheckIns = engagement.reduce((sum, metric) => sum + metric.passportCheckIns, 0);
  const totalDealRedemptions = engagement.reduce((sum, metric) => sum + metric.dealRedemptions, 0);

  return {
    period,
    totalPageViews,
    totalUniqueVisitors,
    avgTimeOnPage,
    avgBounceRate,
    totalPassportCheckIns,
    totalDealRedemptions,
  };
}

export const mockAnalyticsRepository = {
  getPageViews,
  getTopPages,
  getSearchMetrics,
  getEngagementMetrics,
  getAnalyticsSummary,
};

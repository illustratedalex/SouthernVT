import type { AnalyticsPeriod, AnalyticsSummary, EngagementMetric, PageViewMetric, SearchMetric } from "@/types/Analytics";

function notReady(functionName: string): never {
  throw new Error(`${functionName} is not implemented for Supabase yet.`);
}

export async function getPageViews(_period?: AnalyticsPeriod): Promise<PageViewMetric[]> {
  return notReady("getPageViews");
}

export async function getTopPages(_limit = 5, _period?: AnalyticsPeriod): Promise<PageViewMetric[]> {
  return notReady("getTopPages");
}

export async function getSearchMetrics(_period?: AnalyticsPeriod): Promise<SearchMetric[]> {
  return notReady("getSearchMetrics");
}

export async function getEngagementMetrics(_period?: AnalyticsPeriod): Promise<EngagementMetric[]> {
  return notReady("getEngagementMetrics");
}

export async function getAnalyticsSummary(_period?: AnalyticsPeriod): Promise<AnalyticsSummary> {
  return notReady("getAnalyticsSummary");
}

export const supabaseAnalyticsRepository = {
  getPageViews,
  getTopPages,
  getSearchMetrics,
  getEngagementMetrics,
  getAnalyticsSummary,
};

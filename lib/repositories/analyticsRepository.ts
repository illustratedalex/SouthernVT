import { isFeatureEnabled } from "@/lib/featureFlags";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { AnalyticsPeriod, AnalyticsSummary, EngagementMetric, PageViewMetric, SearchMetric } from "@/types/Analytics";
import * as mockRepository from "@/lib/repositories/analyticsRepository.mock";
import * as supabaseRepository from "@/lib/repositories/analyticsRepository.supabase";

type AnalyticsRepositoryModule = {
  getPageViews: (period?: AnalyticsPeriod) => Promise<PageViewMetric[]>;
  getTopPages: (limit?: number, period?: AnalyticsPeriod) => Promise<PageViewMetric[]>;
  getSearchMetrics: (period?: AnalyticsPeriod) => Promise<SearchMetric[]>;
  getEngagementMetrics: (period?: AnalyticsPeriod) => Promise<EngagementMetric[]>;
  getAnalyticsSummary: (period?: AnalyticsPeriod) => Promise<AnalyticsSummary>;
};

async function getActiveAnalyticsRepository(): Promise<AnalyticsRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  if (supabaseEnabled && hasSupabaseEnv()) {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getPageViews(period?: AnalyticsPeriod): Promise<PageViewMetric[]> {
  const repository = await getActiveAnalyticsRepository();
  try {
    return await repository.getPageViews(period);
  } catch {
    return mockRepository.getPageViews(period);
  }
}

export async function getTopPages(limit = 5, period?: AnalyticsPeriod): Promise<PageViewMetric[]> {
  const repository = await getActiveAnalyticsRepository();
  try {
    return await repository.getTopPages(limit, period);
  } catch {
    return mockRepository.getTopPages(limit, period);
  }
}

export async function getSearchMetrics(period?: AnalyticsPeriod): Promise<SearchMetric[]> {
  const repository = await getActiveAnalyticsRepository();
  try {
    return await repository.getSearchMetrics(period);
  } catch {
    return mockRepository.getSearchMetrics(period);
  }
}

export async function getEngagementMetrics(period?: AnalyticsPeriod): Promise<EngagementMetric[]> {
  const repository = await getActiveAnalyticsRepository();
  try {
    return await repository.getEngagementMetrics(period);
  } catch {
    return mockRepository.getEngagementMetrics(period);
  }
}

export async function getAnalyticsSummary(period?: AnalyticsPeriod): Promise<AnalyticsSummary> {
  const repository = await getActiveAnalyticsRepository();
  try {
    return await repository.getAnalyticsSummary(period);
  } catch {
    return mockRepository.getAnalyticsSummary(period);
  }
}

export const analyticsRepository = {
  getPageViews,
  getTopPages,
  getSearchMetrics,
  getEngagementMetrics,
  getAnalyticsSummary,
};

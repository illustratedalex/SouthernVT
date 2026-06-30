export type AnalyticsPeriod = "7d" | "30d" | "90d";

export interface PageViewMetric {
  id: string;
  path: string;
  title: string;
  contentType: "place" | "collection" | "deal" | "passport" | "directory" | "page";
  contentId?: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  period: AnalyticsPeriod;
}

export interface SearchMetric {
  id: string;
  query: string;
  resultCount: number;
  clicks: number;
  period: AnalyticsPeriod;
}

export interface EngagementMetric {
  id: string;
  contentType: "place" | "collection" | "deal" | "passport" | "page";
  contentId: string;
  title: string;
  saves: number;
  shares: number;
  reviews: number;
  passportCheckIns: number;
  dealRedemptions: number;
  period: AnalyticsPeriod;
}

export interface AnalyticsSummary {
  period: AnalyticsPeriod;
  totalPageViews: number;
  totalUniqueVisitors: number;
  avgTimeOnPage: number;
  avgBounceRate: number;
  totalPassportCheckIns: number;
  totalDealRedemptions: number;
}

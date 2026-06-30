export type ContentHealthType = "place" | "collection" | "article" | "event" | "deal";

export type ContentHealthPriority = "low" | "medium" | "high" | "critical";

export interface ContentHealth {
  contentId: string;
  contentType: ContentHealthType;
  healthScore: number;
  qualityScore: number;
  completenessScore: number;
  seoScore: number;
  storyScore: number;
  discoveryScore: number;
  lastReviewed: string;
  nextReview: string;
  priority: ContentHealthPriority;
}

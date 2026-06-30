import type { RecommendationReason } from "@/types/RecommendationReason";

export type RecommendationContentType = "place" | "collection" | "article" | "deal" | "event";

export interface Recommendation<T> {
  contentType: RecommendationContentType;
  item: T;
  score: number;
  reasons: RecommendationReason[];
}

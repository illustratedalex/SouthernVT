export type RecommendationReasonCode =
  | "distance"
  | "tags"
  | "categories"
  | "relationships"
  | "collections"
  | "featured"
  | "discovery_score"
  | "story_score"
  | "completeness"
  | "season"
  | "popularity"
  | "audience"
  | "weather"
  | "weekend"
  | "family"
  | "food"
  | "adventure"
  | "photography"
  | "hidden_gem";

export interface RecommendationReason {
  code: RecommendationReasonCode;
  message: string;
  weight: number;
}

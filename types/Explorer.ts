export type ExplorerMood =
  | "relaxation"
  | "adventure"
  | "food"
  | "family"
  | "photography"
  | "dogs"
  | "swimming"
  | "scenic"
  | "quiet"
  | "shopping"
  | "history"
  | "rainy_day"
  | "romantic"
  | "accessibility";

export interface ExplorerResult {
  id: string;
  mood: ExplorerMood;
  title: string;
  summary: string;
  primaryPlaceId: string;
  foodPlaceId?: string;
  collectionId?: string;
  articleId?: string;
  dealId?: string;
  eventId?: string;
  estimatedDuration: string;
  bestSeason: string;
  tags: string[];
}

export type ExplorerMood =
  | "relaxed"
  | "outdoorsy"
  | "foodie"
  | "family"
  | "rainy_day"
  | "romantic"
  | "spontaneous";

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

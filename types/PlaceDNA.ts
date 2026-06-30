export type PlaceMood =
  | "adventure"
  | "relaxation"
  | "photography"
  | "history"
  | "family"
  | "dogs"
  | "swimming"
  | "accessibility"
  | "shopping"
  | "food"
  | "scenic"
  | "quiet"
  | "rainy_day"
  | "romantic";

export type PlaceDifficulty = "easy" | "moderate" | "challenging";

export type VisitLength = "under_1_hour" | "1_2_hours" | "2_3_hours" | "half_day" | "full_day";

export type EnergyLevel = "low" | "medium" | "high";

export type CrowdLevel = "quiet" | "moderate" | "busy" | "seasonal";

export type WeatherPreference = "sunny" | "cloudy" | "rainy" | "snowy" | "any";

export interface PlaceDNA {
  placeId: string;
  moods: PlaceMood[];
  difficulty: PlaceDifficulty;
  recommendedVisitLength: VisitLength;
  energyLevel: EnergyLevel;
  crowdLevel: CrowdLevel;
  bestSeasons: string[];
  weatherPreference: WeatherPreference;
  bestFor: string[];
  avoidWhen: string[];
  notes: string;
}

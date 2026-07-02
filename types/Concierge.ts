import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { PlaceDNA } from "@/types/PlaceDNA";

export type ConciergeMood =
  | "adventure"
  | "relax"
  | "photography"
  | "food"
  | "family"
  | "romantic"
  | "rainy-day"
  | "history"
  | "shopping";

export type ConciergeTimeAvailable = "1-hour" | "2-hours" | "half-day" | "full-day" | "weekend";

export type ConciergeTravelStyle = "solo" | "couple" | "family" | "friends" | "dog";

export type ConciergeRadius = "15-min" | "30-min" | "1-hour" | "anywhere";

export interface ConciergePreferences {
  mood: ConciergeMood;
  timeAvailable: ConciergeTimeAvailable;
  travelStyle: ConciergeTravelStyle;
  radius: ConciergeRadius;
}

export interface ConciergeRecommendation {
  featuredPlace: Place;
  collection: Collection | null;
  guide: Article | null;
  foodStop: Place | null;
  optionalEvent: Event | null;
  optionalDeal: Deal | null;
  storySummary: string;
  placeDNA: PlaceDNA | null;
  nearbyPlaces: Place[];
}

export interface ConciergeTimelineItem {
  time: string;
  title: string;
  detail: string;
}

export interface ConciergeTrip {
  preferences: ConciergePreferences;
  recommendations: ConciergeRecommendation;
  timeline: ConciergeTimelineItem[];
  reasoning: string[];
}

export interface ConciergeAINarrative {
  summary: string;
  whyThisTrip: string;
  localTips: string[];
  fallbackUsed: boolean;
}

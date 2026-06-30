export type TripBudget = "low" | "medium" | "high";

export type TripStatus = "draft" | "saved" | "archived";

export type TripPace = "relaxed" | "balanced" | "packed";

export type TripTimeOfDay = "morning" | "lunch" | "afternoon" | "dinner" | "evening";

export type TripContentType = "place" | "collection" | "event" | "article";

export interface TripItem {
  id: string;
  timeOfDay: TripTimeOfDay;
  contentType: TripContentType;
  contentId: string;
  title: string;
  notes: string;
  estimatedDuration: string;
  driveTimePlaceholder: string;
}

export interface TripDay {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  items: TripItem[];
}

export interface Trip {
  id: string;
  title: string;
  status: TripStatus;
  startDate: string;
  endDate: string;
  homeBase: string;
  days: TripDay[];
  notes: string;
  travelers: number;
  interests: string[];
  budget: TripBudget;
  pace: TripPace;
  selectedPlaces: string[];
  selectedCollections: string[];
  selectedEvents: string[];
  selectedArticles: string[];
  createdAt: string;
  updatedAt: string;
}

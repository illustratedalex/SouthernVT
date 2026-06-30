export type EventStatus = "draft" | "review" | "scheduled" | "published" | "archived";

export type EventType = "market" | "festival" | "music" | "walk" | "craft" | "community";

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  eventType: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venuePlaceId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  featuredImage: string;
  gallery: string[];
  organizerName: string;
  organizerEmail: string;
  organizerWebsite: string;
  cost: string;
  ticketUrl: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

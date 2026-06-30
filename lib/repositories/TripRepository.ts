import { mockArticles } from "@/data/articles";
import { mockCollections } from "@/data/collections";
import { mockEvents } from "@/data/events";
import { mockPlaces } from "@/data/places";
import { mockTrips } from "@/data/trips";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { Trip, TripBudget, TripDay, TripItem, TripPace, TripTimeOfDay } from "@/types/Trip";

export type TripInput = Omit<Trip, "id" | "createdAt" | "updatedAt">;

export type TripUpdateInput = Partial<Omit<Trip, "id" | "createdAt" | "updatedAt">>;

export interface GenerateMockTripInput {
  homeBase: string;
  numberOfDays: number;
  travelers: number;
  interests: string[];
  budget: TripBudget;
  pace: TripPace;
  startDate?: string;
  notes?: string;
}

let tripStore: Trip[] = mockTrips.map(cloneTrip);

function cloneTrip(trip: Trip): Trip {
  return {
    ...trip,
    interests: [...trip.interests],
    selectedPlaces: [...trip.selectedPlaces],
    selectedCollections: [...trip.selectedCollections],
    selectedEvents: [...trip.selectedEvents],
    selectedArticles: [...trip.selectedArticles],
    days: trip.days.map((day) => ({
      ...day,
      items: day.items.map((item) => ({ ...item })),
    })),
  };
}

function createTripId() {
  return `trip-${Date.now().toString(36)}`;
}

function normalizeDays(value: number) {
  return Math.max(1, Math.min(7, Math.floor(value || 1)));
}

function scoreByInterests(haystackFields: string[], interests: string[]) {
  if (!interests.length) {
    return 0;
  }

  const haystack = haystackFields.join(" ").toLowerCase();
  return interests.reduce((score, interest) => (haystack.includes(interest.toLowerCase()) ? score + 2 : score), 0);
}

function scorePlace(place: Place, input: GenerateMockTripInput) {
  const interestScore = scoreByInterests([place.name, place.description, place.placeType, ...place.categories, ...place.tags], input.interests);
  const homeBaseScore = input.homeBase && place.city.toLowerCase().includes(input.homeBase.toLowerCase()) ? 2 : 0;

  const budgetScore =
    input.budget === "low"
      ? place.featured
        ? 0
        : 1
      : input.budget === "medium"
      ? place.tags.includes("family-friendly")
        ? 1
        : 0
      : place.placeType === "Hotel" || place.placeType === "Scenic Overlook"
      ? 1
      : 0;

  return interestScore + homeBaseScore + budgetScore + (place.featured ? 1 : 0);
}

function scoreCollection(collection: Collection, input: GenerateMockTripInput) {
  return scoreByInterests([collection.title, collection.subtitle, collection.description, ...collection.tags, collection.audience], input.interests) +
    (collection.featured ? 1 : 0);
}

function scoreEvent(event: Event, input: GenerateMockTripInput) {
  const interestScore = scoreByInterests([event.title, event.description, event.eventType, ...event.categories, ...event.tags], input.interests);
  const homeBaseScore = input.homeBase && event.city.toLowerCase().includes(input.homeBase.toLowerCase()) ? 1 : 0;
  return interestScore + homeBaseScore + (event.featured ? 1 : 0);
}

function scoreArticle(article: Article, input: GenerateMockTripInput) {
  return scoreByInterests([article.title, article.subtitle, article.excerpt, ...article.categories, ...article.tags], input.interests) +
    (article.featured ? 1 : 0);
}

function addDays(isoDate: string, amount: number) {
  const date = new Date(isoDate);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function dayTitle(dayNumber: number, homeBase: string) {
  if (dayNumber === 1) {
    return `Arrival and orientation in ${homeBase}`;
  }
  return `Day ${dayNumber} exploration loop`;
}

function getTimeSlotsForPace(pace: TripPace): TripTimeOfDay[] {
  if (pace === "relaxed") {
    return ["morning", "afternoon", "evening"];
  }
  if (pace === "packed") {
    return ["morning", "lunch", "afternoon", "dinner", "evening"];
  }
  return ["morning", "lunch", "afternoon", "evening"];
}

function pickByRotation<T>(items: T[], index: number): T | null {
  if (!items.length) {
    return null;
  }
  return items[index % items.length] ?? null;
}

function buildTripItems(days: number, pace: TripPace, places: Place[], collections: Collection[], events: Event[], articles: Article[]): TripDay[] {
  const timeSlots = getTimeSlotsForPace(pace);
  let runningIndex = 0;

  return Array.from({ length: days }).map((_, dayOffset) => {
    const dayNumber = dayOffset + 1;
    const items: TripItem[] = [];

    timeSlots.forEach((timeOfDay, slotIndex) => {
      const typeCycle = ["place", "collection", "event", "article"] as const;
      const contentType = typeCycle[(runningIndex + slotIndex) % typeCycle.length];

      const place = pickByRotation(places, runningIndex + slotIndex);
      const collection = pickByRotation(collections, runningIndex + slotIndex);
      const event = pickByRotation(events, runningIndex + slotIndex);
      const article = pickByRotation(articles, runningIndex + slotIndex);

      if (contentType === "place" && place) {
        items.push({
          id: `trip-item-${dayNumber}-${timeOfDay}-place-${place.id}`,
          timeOfDay,
          contentType,
          contentId: place.id,
          title: `Visit ${place.name}`,
          notes: `Focus on ${place.categories.slice(0, 2).join(" and ") || place.placeType.toLowerCase()} while in ${place.city}.`,
          estimatedDuration: pace === "packed" ? "1h" : "1.5h",
          driveTimePlaceholder: "20-35 min between stops",
        });
        return;
      }

      if (contentType === "collection" && collection) {
        items.push({
          id: `trip-item-${dayNumber}-${timeOfDay}-collection-${collection.id}`,
          timeOfDay,
          contentType,
          contentId: collection.id,
          title: `Use ${collection.title}`,
          notes: "Use this collection to choose a coordinated sequence of nearby stops.",
          estimatedDuration: "45m planning + optional stops",
          driveTimePlaceholder: "Varies by chosen stops",
        });
        return;
      }

      if (contentType === "event" && event) {
        items.push({
          id: `trip-item-${dayNumber}-${timeOfDay}-event-${event.id}`,
          timeOfDay,
          contentType,
          contentId: event.id,
          title: `Attend ${event.title}`,
          notes: `Event window ${event.startTime}-${event.endTime}. Confirm date alignment before booking.`,
          estimatedDuration: "1.5h",
          driveTimePlaceholder: "15-30 min",
        });
        return;
      }

      if (article) {
        items.push({
          id: `trip-item-${dayNumber}-${timeOfDay}-article-${article.id}`,
          timeOfDay,
          contentType: "article",
          contentId: article.id,
          title: `Reference ${article.title}`,
          notes: "Use article notes for practical pacing, weather pivots, and local tips.",
          estimatedDuration: "30m",
          driveTimePlaceholder: "N/A",
        });
      }
    });

    runningIndex += 1;

    return {
      id: `trip-day-${dayNumber}`,
      dayNumber,
      date: "",
      title: "",
      items,
    };
  });
}

export function generateMockTrip(input: GenerateMockTripInput): Trip {
  const numberOfDays = normalizeDays(input.numberOfDays);
  const nowIso = new Date().toISOString();
  const startDate = input.startDate ?? nowIso.slice(0, 10);
  const endDate = addDays(startDate, numberOfDays - 1);

  const publishedPlaces = mockPlaces.filter((place) => place.status === "published");
  const publishedCollections = mockCollections.filter((collection) => collection.status === "published");
  const activeEvents = mockEvents.filter((event) => event.status === "published" || event.status === "scheduled");
  const publishedArticles = mockArticles.filter((article) => article.status === "published");

  const rankedPlaces = [...publishedPlaces].sort((a, b) => scorePlace(b, input) - scorePlace(a, input));
  const rankedCollections = [...publishedCollections].sort((a, b) => scoreCollection(b, input) - scoreCollection(a, input));
  const rankedEvents = [...activeEvents].sort((a, b) => scoreEvent(b, input) - scoreEvent(a, input));
  const rankedArticles = [...publishedArticles].sort((a, b) => scoreArticle(b, input) - scoreArticle(a, input));

  const featuredPlaces = rankedPlaces.slice(0, Math.max(numberOfDays * 2, 4));
  const featuredCollections = rankedCollections.slice(0, Math.max(numberOfDays, 2));
  const featuredEvents = rankedEvents.slice(0, Math.max(numberOfDays, 2));
  const featuredArticles = rankedArticles.slice(0, Math.max(numberOfDays, 2));

  const days = buildTripItems(numberOfDays, input.pace, featuredPlaces, featuredCollections, featuredEvents, featuredArticles).map((day, dayOffset) => ({
    ...day,
    date: addDays(startDate, dayOffset),
    title: dayTitle(day.dayNumber, input.homeBase || "Southern Vermont"),
  }));

  const normalizedHomeBase = input.homeBase.trim() || "Southern Vermont";

  return {
    id: createTripId(),
    title: `${numberOfDays}-Day ${normalizedHomeBase} Itinerary`,
    status: "draft",
    startDate,
    endDate,
    homeBase: normalizedHomeBase,
    days,
    notes: input.notes ?? `Generated with ${input.pace} pacing for ${input.travelers} traveler${input.travelers === 1 ? "" : "s"}.`,
    travelers: Math.max(1, input.travelers),
    interests: input.interests,
    budget: input.budget,
    pace: input.pace,
    selectedPlaces: featuredPlaces.map((place) => place.id),
    selectedCollections: featuredCollections.map((collection) => collection.id),
    selectedEvents: featuredEvents.map((event) => event.id),
    selectedArticles: featuredArticles.map((article) => article.id),
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export async function getTrips(): Promise<Trip[]> {
  return tripStore.map(cloneTrip);
}

export async function getTripById(id: string): Promise<Trip | null> {
  const trip = tripStore.find((item) => item.id === id);
  return trip ? cloneTrip(trip) : null;
}

export async function createTrip(input: TripInput): Promise<Trip> {
  const now = new Date().toISOString();
  const created: Trip = {
    ...input,
    id: createTripId(),
    createdAt: now,
    updatedAt: now,
  };

  tripStore = [created, ...tripStore];
  return cloneTrip(created);
}

export async function updateTrip(id: string, updates: TripUpdateInput): Promise<Trip | null> {
  const index = tripStore.findIndex((trip) => trip.id === id);
  if (index < 0) {
    return null;
  }

  const current = tripStore[index];
  const updated: Trip = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  tripStore[index] = updated;
  return cloneTrip(updated);
}

export async function archiveTrip(id: string): Promise<Trip | null> {
  return updateTrip(id, { status: "archived" });
}

export const tripRepository = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  archiveTrip,
  generateMockTrip,
};

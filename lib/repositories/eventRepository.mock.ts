import { mockEvents } from "@/data/events";
import type { Event } from "@/types/Event";

export type EventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;

let eventStore: Event[] = mockEvents.map((event) => ({ ...event }));

function createId(slug: string) {
  return `event-${slug}-${Date.now().toString(36)}`;
}

function clone(event: Event) {
  return { ...event };
}

function sortByStartDate(events: Event[]) {
  return [...events].sort((a, b) => `${a.startDate}T${a.startTime}`.localeCompare(`${b.startDate}T${b.startTime}`));
}

export async function getEvents(): Promise<Event[]> {
  return sortByStartDate(eventStore).map(clone);
}

export async function getPublishedEvents(): Promise<Event[]> {
  const events = await getEvents();
  return events.filter((event) => event.status === "published");
}

export async function getEventById(id: string): Promise<Event | null> {
  const event = eventStore.find((item) => item.id === id);
  return event ? clone(event) : null;
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const event = eventStore.find((item) => item.slug === slug);
  return event ? clone(event) : null;
}

export async function createEvent(input: EventInput): Promise<Event> {
  const now = new Date().toISOString();
  const created: Event = {
    ...input,
    id: createId(input.slug),
    createdAt: now,
    updatedAt: now,
  };

  eventStore = [created, ...eventStore];
  return clone(created);
}

export async function updateEvent(id: string, updates: Partial<EventInput>): Promise<Event | null> {
  const index = eventStore.findIndex((event) => event.id === id);
  if (index < 0) {
    return null;
  }

  const current = eventStore[index];
  const updated: Event = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  eventStore[index] = updated;
  return clone(updated);
}

export async function archiveEvent(id: string): Promise<Event | null> {
  return updateEvent(id, { status: "archived" });
}

export const mockEventRepository = {
  getEvents,
  getPublishedEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  archiveEvent,
};

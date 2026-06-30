import type { Event } from "@/types/Event";
import type { EventInput } from "@/lib/repositories/eventRepository.mock";

function notReady(functionName: string): never {
  throw new Error(`${functionName} is not implemented for Supabase yet.`);
}

export async function getEvents(): Promise<Event[]> {
  return notReady("getEvents");
}

export async function getPublishedEvents(): Promise<Event[]> {
  return notReady("getPublishedEvents");
}

export async function getEventById(_id: string): Promise<Event | null> {
  return notReady("getEventById");
}

export async function getEventBySlug(_slug: string): Promise<Event | null> {
  return notReady("getEventBySlug");
}

export async function createEvent(_input: EventInput): Promise<Event> {
  return notReady("createEvent");
}

export async function updateEvent(_id: string, _updates: Partial<EventInput>): Promise<Event | null> {
  return notReady("updateEvent");
}

export async function archiveEvent(_id: string): Promise<Event | null> {
  return notReady("archiveEvent");
}

export const supabaseEventRepository = {
  getEvents,
  getPublishedEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  archiveEvent,
};

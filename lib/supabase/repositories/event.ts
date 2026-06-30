import type { EventItem } from "../types";

export async function getEvents(): Promise<EventItem[]> {
  return [];
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  return null;
}

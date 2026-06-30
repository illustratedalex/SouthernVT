import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Event } from "@/types/Event";
import type { EventInput } from "@/lib/repositories/eventRepository.mock";
import * as mockRepository from "@/lib/repositories/eventRepository.mock";
import * as supabaseRepository from "@/lib/repositories/eventRepository.supabase";

type EventRepositoryModule = {
  getEvents: () => Promise<Event[]>;
  getPublishedEvents: () => Promise<Event[]>;
  getEventById: (id: string) => Promise<Event | null>;
  getEventBySlug: (slug: string) => Promise<Event | null>;
  createEvent: (input: EventInput) => Promise<Event>;
  updateEvent: (id: string, updates: Partial<EventInput>) => Promise<Event | null>;
  archiveEvent: (id: string) => Promise<Event | null>;
};

async function getActiveEventRepository(): Promise<EventRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getEvents(): Promise<Event[]> {
  const repository = await getActiveEventRepository();
  try {
    return await repository.getEvents();
  } catch {
    return mockRepository.getEvents();
  }
}

export async function getPublishedEvents(): Promise<Event[]> {
  const repository = await getActiveEventRepository();
  try {
    return await repository.getPublishedEvents();
  } catch {
    return mockRepository.getPublishedEvents();
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  const repository = await getActiveEventRepository();
  try {
    return await repository.getEventById(id);
  } catch {
    return mockRepository.getEventById(id);
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const repository = await getActiveEventRepository();
  try {
    return await repository.getEventBySlug(slug);
  } catch {
    return mockRepository.getEventBySlug(slug);
  }
}

export async function createEvent(input: EventInput): Promise<Event> {
  const repository = await getActiveEventRepository();
  try {
    return await repository.createEvent(input);
  } catch {
    return mockRepository.createEvent(input);
  }
}

export async function updateEvent(id: string, updates: Partial<EventInput>): Promise<Event | null> {
  const repository = await getActiveEventRepository();
  try {
    return await repository.updateEvent(id, updates);
  } catch {
    return mockRepository.updateEvent(id, updates);
  }
}

export async function archiveEvent(id: string): Promise<Event | null> {
  const repository = await getActiveEventRepository();
  try {
    return await repository.archiveEvent(id);
  } catch {
    return mockRepository.archiveEvent(id);
  }
}

export const eventRepository = {
  getAll: getEvents,
  getPublished: getPublishedEvents,
  getById: getEventById,
  getBySlug: getEventBySlug,
  create: createEvent,
  update: updateEvent,
  archive: archiveEvent,
  getEvents,
  getPublishedEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  archiveEvent,
};

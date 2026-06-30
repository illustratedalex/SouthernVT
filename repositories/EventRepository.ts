export {
  archiveEvent,
  createEvent,
  eventRepository,
  getEventById,
  getEventBySlug,
  getEvents,
  getPublishedEvents,
  updateEvent,
} from "@/lib/repositories/eventRepository";

export type { EventInput } from "@/lib/repositories/eventRepository.mock";

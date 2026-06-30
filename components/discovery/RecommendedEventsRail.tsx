import { RelatedContentRail } from "@/components/public/RelatedContentRail";
import type { Event } from "@/types/Event";

type RecommendedEventsRailProps = {
  events: Event[];
  title?: string;
};

export function RecommendedEventsRail({ events, title = "Recommended Events" }: RecommendedEventsRailProps) {
  return (
    <RelatedContentRail
      title={title}
      items={events.map((event) => ({
        id: event.id,
        title: event.title,
        subtitle: `${event.startDate} · ${event.city}`,
        href: `/events/${event.slug}`,
        badge: event.eventType,
      }))}
      emptyTitle="No event recommendations yet"
      emptyDescription="Event recommendations will appear as calendar and place links evolve."
    />
  );
}

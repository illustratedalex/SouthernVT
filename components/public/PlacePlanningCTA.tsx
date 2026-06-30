import type { Place } from "@/types/Place";
import { PublicCTA } from "./PublicCTA";

interface PlacePlanningCTAProps {
  place: Place;
}

export function PlacePlanningCTA({ place }: PlacePlanningCTAProps) {
  return (
    <PublicCTA
      eyebrow="Plan a trip"
      title={`Build an itinerary around ${place.name}`}
      description="Add this stop to a weekend plan with nearby places, collections, events, and deals."
      href="/planner/new"
      label="Plan this trip"
      secondaryHref="/collections"
      secondaryLabel="Browse collections"
    />
  );
}

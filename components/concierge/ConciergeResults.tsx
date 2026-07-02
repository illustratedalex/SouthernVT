import { EditorialSection } from "@/components/ui";
import type { ConciergeTrip } from "@/types/Concierge";
import { AITripNarrative } from "./AITripNarrative";
import { RecommendationTimeline } from "./RecommendationTimeline";
import { TripSummaryCard } from "./TripSummaryCard";

type ConciergeResultsProps = {
  trip: ConciergeTrip;
  aiConciergeEnabled: boolean;
};

export function ConciergeResults({ trip, aiConciergeEnabled }: ConciergeResultsProps) {
  return (
    <section className="space-y-6">
      <TripSummaryCard
        featuredPlace={trip.recommendations.featuredPlace}
        collection={trip.recommendations.collection}
        guide={trip.recommendations.guide}
        foodStop={trip.recommendations.foodStop}
        event={trip.recommendations.optionalEvent}
        deal={trip.recommendations.optionalDeal}
        storySummary={trip.recommendations.storySummary}
        placeDNA={trip.recommendations.placeDNA}
      />

      <RecommendationTimeline entries={trip.timeline} />

      <EditorialSection
        eyebrow="Why these picks"
        title="Concierge reasoning"
        description="How your preferences shaped this itinerary."
      >
        <ul className="space-y-2 text-sm leading-7 text-slate-700">
          {trip.reasoning.map((reason) => (
            <li key={reason} className="rounded-xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3">
              {reason}
            </li>
          ))}
        </ul>
      </EditorialSection>

      <AITripNarrative preferences={trip.preferences} compassTrip={trip} aiConciergeEnabled={aiConciergeEnabled} />
    </section>
  );
}

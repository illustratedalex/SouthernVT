import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { Trip } from "@/types/Trip";
import { TripDayCard } from "@/components/planner/TripDayCard";
import { TripSummary } from "@/components/planner/TripSummary";

type GeneratedTripPreviewProps = {
  trip: Trip;
  placesById: Map<string, Place>;
  collectionsById: Map<string, Collection>;
  eventsById: Map<string, Event>;
  articlesById: Map<string, Article>;
  plannerEnabled: boolean;
};

export function GeneratedTripPreview({ trip, placesById, collectionsById, eventsById, articlesById, plannerEnabled }: GeneratedTripPreviewProps) {
  return (
    <section className="space-y-5">
      {!plannerEnabled ? (
        <div className="rounded-2xl border border-[#d7cbb3] bg-[#fff7e4] p-4 text-sm font-medium text-[#6b5a30]">
          AI-powered planning coming soon. This preview uses curated SouthernVT data.
        </div>
      ) : null}

      <TripSummary trip={trip} />

      <section className="rounded-[28px] border border-dashed border-[#d7cbb3] bg-[#fcfaf6] p-5 text-sm text-slate-600">
        Save/export actions are placeholders in this mock phase. You can still open a full detail-style view after generating.
      </section>

      <div className="space-y-4">
        {trip.days.map((day) => (
          <TripDayCard
            key={day.id}
            day={day}
            placesById={placesById}
            collectionsById={collectionsById}
            eventsById={eventsById}
            articlesById={articlesById}
          />
        ))}
      </div>
    </section>
  );
}

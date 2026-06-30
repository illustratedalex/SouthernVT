import type { Collection } from "@/types/Collection";
import type { Place } from "@/types/Place";
import type { Trip } from "@/types/Trip";

export type DayPlan = {
  day: string;
  stops: string[];
};

type ItineraryPreviewProps = {
  trip: Trip;
  dayPlans: DayPlan[];
  placesById: Map<string, Place>;
  collectionsById: Map<string, Collection>;
};

export function ItineraryPreview({ trip, dayPlans, placesById, collectionsById }: ItineraryPreviewProps) {
  return (
    <section className="space-y-5 rounded-[28px] border border-[#e8dfc8] bg-white/85 p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Suggested itinerary</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{trip.title || "Your Southern Vermont weekend"}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {trip.days.length} day trip from {trip.homeBase || "Southern Vermont"} for {trip.travelers} traveler{trip.travelers === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Collections</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {trip.selectedCollections.length ? (
              trip.selectedCollections.map((id) => <li key={id}>{collectionsById.get(id)?.title ?? id}</li>)
            ) : (
              <li>No matching collections selected yet.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Interests</p>
          <p className="mt-2 text-sm text-slate-700">{trip.interests.length ? trip.interests.join(", ") : "No interests selected yet."}</p>
        </div>
      </div>

      <div className="space-y-3">
        {dayPlans.map((plan) => (
          <article key={plan.day} className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{plan.day}</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {plan.stops.length ? (
                plan.stops.map((stopId) => {
                  const stop = placesById.get(stopId);
                  return stop ? <li key={stop.id}>• {stop.name} ({stop.placeType})</li> : <li key={stopId}>• {stopId}</li>;
                })
              ) : (
                <li>• Free-form day for relaxing and exploring nearby towns.</li>
              )}
            </ul>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 text-sm text-slate-600">
        This itinerary is generated from current mock places and collections. Real trip persistence and optimization will connect through Supabase later.
      </div>
    </section>
  );
}

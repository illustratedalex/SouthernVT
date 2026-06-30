import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { TripDay } from "@/types/Trip";
import { TripItemCard } from "@/components/planner/TripItemCard";

type TripDayCardProps = {
  day: TripDay;
  placesById: Map<string, Place>;
  collectionsById: Map<string, Collection>;
  eventsById: Map<string, Event>;
  articlesById: Map<string, Article>;
};

export function TripDayCard({ day, placesById, collectionsById, eventsById, articlesById }: TripDayCardProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">Day {day.dayNumber}: {day.title}</h3>
        <p className="text-sm font-medium text-slate-600">{day.date}</p>
      </div>

      <div className="mt-4 space-y-3">
        {day.items.length ? (
          day.items.map((item) => (
            <TripItemCard
              key={item.id}
              item={item}
              placesById={placesById}
              collectionsById={collectionsById}
              eventsById={eventsById}
              articlesById={articlesById}
            />
          ))
        ) : (
          <article className="rounded-2xl border border-dashed border-[#d7cbb3] bg-[#fcfaf6] p-4 text-sm text-slate-600">
            No items generated for this day yet. Adjust pace or interests to refresh this plan.
          </article>
        )}
      </div>
    </section>
  );
}

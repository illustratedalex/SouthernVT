import Link from "next/link";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { TripItem } from "@/types/Trip";

type TripItemCardProps = {
  item: TripItem;
  placesById: Map<string, Place>;
  collectionsById: Map<string, Collection>;
  eventsById: Map<string, Event>;
  articlesById: Map<string, Article>;
};

function contentHref(item: TripItem, placesById: Map<string, Place>, collectionsById: Map<string, Collection>, eventsById: Map<string, Event>, articlesById: Map<string, Article>) {
  if (item.contentType === "place") {
    const place = placesById.get(item.contentId);
    return place ? `/places/${place.slug}` : null;
  }

  if (item.contentType === "collection") {
    const collection = collectionsById.get(item.contentId);
    return collection ? `/collections/${collection.slug}` : null;
  }

  if (item.contentType === "event") {
    const event = eventsById.get(item.contentId);
    return event ? `/events/${event.slug}` : null;
  }

  const article = articlesById.get(item.contentId);
  return article ? `/guides/${article.slug}` : null;
}

export function TripItemCard({ item, placesById, collectionsById, eventsById, articlesById }: TripItemCardProps) {
  const href = contentHref(item, placesById, collectionsById, eventsById, articlesById);

  return (
    <article className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#eef5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f3b2f]">{item.timeOfDay}</span>
        <span className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">{item.contentType}</span>
      </div>

      <h4 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h4>
      <p className="mt-2 text-sm leading-7 text-slate-600">{item.notes}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full border border-[#d7cbb3] px-3 py-1">Duration: {item.estimatedDuration}</span>
        <span className="rounded-full border border-[#d7cbb3] px-3 py-1">Drive: {item.driveTimePlaceholder}</span>
      </div>

      {href ? (
        <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-[#1f3b2f]">
          Open source content
        </Link>
      ) : null}
    </article>
  );
}

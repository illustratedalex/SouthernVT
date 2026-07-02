import Link from "next/link";
import { Badge, Card, MetaText, Prose } from "@/components/ui";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { PlaceDNA } from "@/types/PlaceDNA";

type TripSummaryCardProps = {
  featuredPlace: Place;
  collection: Collection | null;
  guide: Article | null;
  foodStop: Place | null;
  event: Event | null;
  deal: Deal | null;
  storySummary: string;
  placeDNA: PlaceDNA | null;
};

export function TripSummaryCard({
  featuredPlace,
  collection,
  guide,
  foodStop,
  event,
  deal,
  storySummary,
  placeDNA,
}: TripSummaryCardProps) {
  return (
    <Card variant="hero" className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <MetaText as="p" variant="eyebrow">
            Step 6
          </MetaText>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Compass Concierge Plan</h2>
        </div>
        <Badge variant="forest">Generated Route</Badge>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-forest-green)">Featured Place</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{featuredPlace.name}</h3>
          <Prose size="sm" className="mt-2">
            <p>{storySummary}</p>
          </Prose>
          <Link href={`/places/${featuredPlace.slug}`} className="mt-3 inline-flex text-sm font-semibold text-(--color-forest-green) underline underline-offset-4">
            Open place
          </Link>
        </article>

        <article className="space-y-3 rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-forest-green)">Recommended Pairings</p>
          <p className="text-sm text-slate-700"><strong>Collection:</strong> {collection ? collection.title : "No matching collection right now."}</p>
          <p className="text-sm text-slate-700"><strong>Guide:</strong> {guide ? guide.title : "No matching guide right now."}</p>
          <p className="text-sm text-slate-700"><strong>Food Stop:</strong> {foodStop ? foodStop.name : "No matching food stop in current radius."}</p>
          <p className="text-sm text-slate-700"><strong>Optional Event:</strong> {event ? event.title : "No event suggestion for this plan."}</p>
          <p className="text-sm text-slate-700"><strong>Optional Deal:</strong> {deal ? deal.title : "No deal suggestion for this plan."}</p>
        </article>
      </div>

      {placeDNA ? (
        <div className="mt-5 rounded-2xl border border-[#e8dfc8] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-forest-green)">Place DNA</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Best for {placeDNA.bestFor.slice(0, 3).join(", ")}. Recommended visit length: {placeDNA.recommendedVisitLength.replaceAll("_", " ")}.
          </p>
        </div>
      ) : null}
    </Card>
  );
}


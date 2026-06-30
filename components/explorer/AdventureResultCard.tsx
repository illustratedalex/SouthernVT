import Link from "next/link";
import type { ExplorerResultDetails } from "@/lib/discovery/ExplorerService";

type AdventureResultCardProps = {
  details: ExplorerResultDetails | null;
};

export function AdventureResultCard({ details }: AdventureResultCardProps) {
  if (!details || !details.primaryPlace) {
    return (
      <section className="rounded-[26px] border border-[#e8dfc8] bg-white p-6 shadow-[0_16px_52px_rgba(31,59,47,0.08)]">
        <p className="text-sm text-slate-600">Tap the adventure button to generate a curated Southern Vermont surprise.</p>
      </section>
    );
  }

  const { result, primaryPlace, foodPlace, collection, article, deal, event } = details;

  return (
    <section className="rounded-[26px] border border-[#e8dfc8] bg-white p-6 shadow-[0_16px_52px_rgba(31,59,47,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Adventure generated</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-900">{result.title}</h2>
      <p className="mt-3 text-sm leading-8 text-slate-700">{result.summary}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href={`/places/${primaryPlace.slug}`} className="rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800">
          Featured Place: {primaryPlace.name}
        </Link>
        {foodPlace ? (
          <Link href={`/places/${foodPlace.slug}`} className="rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800">
            Food & Drink: {foodPlace.name}
          </Link>
        ) : null}
        {collection ? (
          <Link href={`/collections/${collection.slug}`} className="rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800">
            Collection: {collection.title}
          </Link>
        ) : null}
        {article ? (
          <Link href={`/guides/${article.slug}`} className="rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800">
            Guide: {article.title}
          </Link>
        ) : null}
        {deal ? (
          <Link href={`/deals/${deal.slug}`} className="rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800">
            Deal: {deal.title}
          </Link>
        ) : null}
        {event ? (
          <Link href={`/events/${event.slug}`} className="rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800">
            Event: {event.title}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

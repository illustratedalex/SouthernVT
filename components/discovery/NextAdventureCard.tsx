import Link from "next/link";
import type { NextAdventure } from "@/lib/discovery/DiscoveryService";

type NextAdventureCardProps = {
  adventure: NextAdventure;
  title?: string;
};

export function NextAdventureCard({ adventure, title = "Today's Story" }: NextAdventureCardProps) {
  if (!adventure.place) {
    return (
      <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--color-forest-green)">{title}</p>
        <p className="mt-3 text-sm text-slate-600">Discovery recommendations are warming up. Check back shortly.</p>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--color-forest-green)">{title}</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-900">{adventure.place.name}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{adventure.place.description}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link href={`/places/${adventure.place.slug}`} className="rounded-2xl border border-[#e7dcc3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white">
          Featured place
        </Link>
        {adventure.collection ? (
          <Link href={`/collections/${adventure.collection.slug}`} className="rounded-2xl border border-[#e7dcc3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white">
            Featured collection
          </Link>
        ) : null}
        {adventure.article ? (
          <Link href={`/guides/${adventure.article.slug}`} className="rounded-2xl border border-[#e7dcc3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white">
            Featured guide
          </Link>
        ) : null}
        {adventure.deal ? (
          <Link href={`/deals/${adventure.deal.slug}`} className="rounded-2xl border border-[#e7dcc3] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white">
            Featured deal
          </Link>
        ) : null}
      </div>

      {adventure.event ? (
        <div className="mt-4 rounded-2xl border border-[#efe7d3] bg-[#f7efe1] px-4 py-3 text-sm text-slate-700">
          Next event: <span className="font-semibold text-slate-900">{adventure.event.title}</span> in {adventure.event.city}
        </div>
      ) : null}
    </section>
  );
}

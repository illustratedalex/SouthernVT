import Link from "next/link";
import type { Collection } from "@/types/Collection";
import type { Place } from "@/types/Place";
import { PlaceCard } from "./PlaceCard";

interface RelatedPlacesProps {
  relatedPlaces: Place[];
  nearbyCollections: Collection[];
}

export function RelatedPlaces({ relatedPlaces, nearbyCollections }: RelatedPlacesProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Related places</h2>
        {relatedPlaces.length ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {relatedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">More related places are coming soon for this area.</p>
        )}
      </section>

      <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Nearby collection suggestions</h2>
        {nearbyCollections.length ? (
          <div className="mt-4 space-y-3">
            {nearbyCollections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.slug}`} className="block rounded-2xl border border-[#efe7d3] bg-[#fcfaf6] p-4 transition hover:border-(--color-maple-gold)/55">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-pine)">{collection.season}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{collection.title}</p>
                <p className="mt-1 text-sm text-slate-600">{collection.subtitle}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">Collection suggestions are being prepared for this place.</p>
        )}
      </section>
    </div>
  );
}

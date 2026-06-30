import Link from "next/link";
import type { Collection } from "@/types/Collection";

interface RelatedCollectionsProps {
  collections: Collection[];
}

export function RelatedCollections({ collections }: RelatedCollectionsProps) {
  return (
    <section className="rounded-[28px] border border-(--color-pine)/20 bg-white p-6 shadow-[0_20px_70px_rgba(31,59,47,0.08)]">
      <h2 className="text-xl font-semibold text-(--color-forest-green)">Related collections</h2>
      {collections.length ? (
        <div className="mt-4 space-y-4">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group block rounded-2xl border border-(--color-pine)/15 p-4 transition hover:border-(--color-maple-gold)/45 hover:bg-(--color-cream)"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-pine)">{collection.season}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-(--color-forest-green)">{collection.title}</p>
              <p className="mt-1 text-sm text-slate-600">{collection.subtitle}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">More related guides are on the way.</p>
      )}
    </section>
  );
}

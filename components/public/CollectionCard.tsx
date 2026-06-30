import Link from "next/link";
import type { Collection } from "@/types/Collection";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <article className="overflow-hidden rounded-[26px] border border-[#e8dfc8] bg-white shadow-[0_14px_48px_rgba(31,59,47,0.1)] transition hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(31,59,47,0.14)]">
      <div className="relative h-48 overflow-hidden">
        <img src={collection.featuredImage} alt={collection.title} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-full bg-(--color-cream)/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-(--color-forest-green)">
          {collection.season}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-xl font-semibold text-slate-900">{collection.title}</h3>
        <p className="text-sm font-medium text-slate-600">{collection.subtitle}</p>
        <p className="line-clamp-3 text-sm leading-7 text-slate-700">{collection.description}</p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f7efe1] px-3 py-1 text-xs font-semibold text-[#1f3b2f]">{collection.audience}</span>
          {collection.featured ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Featured</span> : null}
        </div>
        <Link href={`/collections/${collection.slug}`} className="inline-flex rounded-full bg-(--color-forest-green) px-4 py-2 text-sm font-semibold text-(--color-cream) transition hover:bg-(--color-pine)">
          View guide
        </Link>
      </div>
    </article>
  );
}

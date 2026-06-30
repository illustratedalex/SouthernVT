import type { Collection } from "@/types/Collection";
import { CollectionStatusBadge } from "./CollectionStatusBadge";

interface CollectionPreviewProps {
  collection: Collection;
  placeNames: string[];
}

export function CollectionPreview({ collection, placeNames }: CollectionPreviewProps) {
  return (
    <article className="space-y-4 rounded-[28px] border border-[#e8dfc8] bg-white/90 p-5 shadow-[0_16px_50px_rgba(31,59,47,0.08)]">
      <div className="overflow-hidden rounded-[24px] border border-[#e8dfc8]">
        <img src={collection.featuredImage} alt={collection.subtitle || collection.title} className="h-60 w-full object-cover" />
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-maple-gold)]">{collection.season}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">{collection.title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-600">{collection.subtitle}</p>
        </div>
        <CollectionStatusBadge status={collection.status} />
      </div>
      <p className="text-sm leading-7 text-slate-600">{collection.description}</p>
      <div className="flex flex-wrap gap-2">
        {collection.featured ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Featured</span> : null}
        {collection.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Places included</p>
        <p className="mt-2 text-sm text-slate-700">
          {placeNames.length ? placeNames.join(", ") : "No places selected yet."}
        </p>
      </div>
    </article>
  );
}

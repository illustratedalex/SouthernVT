import type { Collection } from "@/types/Collection";

interface CollectionHeroProps {
  collection: Collection;
}

export function CollectionHero({ collection }: CollectionHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-(--color-pine)/15 bg-(--color-forest-green)">
      <div className="absolute inset-0">
        <img src={collection.featuredImage} alt={collection.title} className="h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-(--color-forest-green)/45 to-(--color-forest-green)" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">Collection Guide</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold text-(--color-cream) md:text-6xl">{collection.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{collection.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
          <span className="rounded-full border border-(--color-maple-gold)/50 bg-(--color-maple-gold)/20 px-3 py-2 text-(--color-maple-gold)">{collection.season}</span>
          <span className="rounded-full border border-white/35 bg-white/15 px-3 py-2 text-(--color-cream)">{collection.audience}</span>
        </div>
      </div>
    </section>
  );
}

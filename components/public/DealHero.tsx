import type { Deal } from "@/types/Deal";

interface DealHeroProps {
  deal: Deal;
  placeName?: string;
}

export function DealHero({ deal, placeName }: DealHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-linear-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">Partner offer</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">{deal.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">{deal.shortDescription}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
            <span className="rounded-full border border-white/25 px-3 py-1">{deal.dealType}</span>
            <span className="rounded-full border border-white/25 px-3 py-1">{deal.startDate} to {deal.endDate}</span>
            {placeName ? <span className="rounded-full border border-white/25 px-3 py-1">{placeName}</span> : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
          <img src={deal.featuredImage} alt={deal.title} className="h-full max-h-88 w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

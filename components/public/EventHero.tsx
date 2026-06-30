import type { Event } from "@/types/Event";

interface EventHeroProps {
  event: Event;
}

export function EventHero({ event }: EventHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-gradient-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">SouthernVT Event</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{event.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{event.description}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
          <span className="rounded-full bg-white/15 px-3 py-1">{event.eventType}</span>
          <span className="rounded-full bg-white/15 px-3 py-1">{event.city}</span>
          <span className="rounded-full bg-white/15 px-3 py-1">{event.startDate}</span>
        </div>
      </div>
    </section>
  );
}

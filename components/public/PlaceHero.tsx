import type { Place } from "@/types/Place";

interface PlaceHeroProps {
  place: Place;
}

export function PlaceHero({ place }: PlaceHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-slate-950 text-(--color-cream)">
      <div className="absolute inset-0">
        <img src={place.featuredImage} alt={place.name} className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-(--color-forest-green)/45 to-(--color-forest-green)" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-18 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--color-maple-gold)">{place.placeType}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-(--color-cream) md:text-6xl">{place.name}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{place.description}</p>
      </div>
    </section>
  );
}

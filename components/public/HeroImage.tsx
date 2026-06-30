import type { ReactNode } from "react";
import { BadgeRow } from "./BadgeRow";

interface HeroImageProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  alt: string;
  badges?: string[];
  children?: ReactNode;
}

export function HeroImage({ eyebrow, title, subtitle, image, alt, badges = [], children }: HeroImageProps) {
  return (
    <section className="relative overflow-hidden border-b border-(--color-pine)/15 bg-(--color-forest-green) text-(--color-cream)">
      <div className="absolute inset-0">
        <img src={image} alt={alt} className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-(--color-forest-green)/45 to-(--color-forest-green)" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:px-10 lg:py-16">
        <div className="space-y-4">
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">{eyebrow}</p> : null}
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{title}</h1>
          {subtitle ? <p className="max-w-3xl text-lg leading-8 text-slate-200">{subtitle}</p> : null}
          <BadgeRow badges={badges} />
        </div>

        <div className="flex items-end lg:justify-end">
          {children ? (
            <div className="w-full max-w-md rounded-[28px] border border-white/12 bg-black/20 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";
import type { ReactNode } from "react";

interface PublicCTAProps {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  label: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
}

export function PublicCTA({ eyebrow, title, description, href, label, secondaryHref, secondaryLabel, children }: PublicCTAProps) {
  return (
    <section className="rounded-[30px] border border-(--color-pine)/15 bg-(--color-forest-green) p-6 text-(--color-cream) shadow-[0_20px_60px_rgba(31,59,47,0.18)]">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-maple-gold)">{eyebrow}</p> : null}
      <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-200">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={href} className="inline-flex rounded-full bg-(--color-maple-gold) px-5 py-3 text-sm font-semibold text-(--color-forest-green) transition hover:opacity-90">
          {label}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link href={secondaryHref} className="inline-flex rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-(--color-cream) transition hover:bg-white/10">
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
import Link from "next/link";

interface ComingSoonProps {
  title: string;
  description: string;
  eyebrow?: string;
}

export function ComingSoon({ title, description, eyebrow = "Coming Soon" }: ComingSoonProps) {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-gradient-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
        <div className="mx-auto max-w-6xl px-6 py-18 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">{description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-(--color-maple-gold) px-5 py-3 text-sm font-semibold text-(--color-forest-green) transition hover:opacity-90"
            >
              Explore SouthernVT
            </Link>
            <Link
              href="/collections"
              className="rounded-full border border-[#d7cbb3] bg-white/10 px-5 py-3 text-sm font-semibold text-[#f8f2e4] transition hover:bg-white/20"
            >
              Browse current guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

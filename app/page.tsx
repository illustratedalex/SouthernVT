import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import { ExperienceService } from "@/lib/experience/ExperienceService";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Southern Vermont | Travel & Adventure",
  description: "Discover Southern Vermont with curated guides, local events, scenic adventures, and partner offers.",
  path: "/",
});

export default async function Home() {
  const feed = await ExperienceService.getHomeFeed(6);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <header className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Home Feed</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Living Southern Vermont Discovery</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Dynamic rails powered by Seasonal Engine, Discover Mode, and Compass + Discovery signals. No AI, no auth, just living mock-data exploration.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/explorer"
            className="inline-flex rounded-full bg-[#1f3b2f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#f8f2e4] shadow-sm transition hover:bg-[#29493a]"
          >
            I&apos;m Feeling Adventurous
          </Link>
          <span className="inline-flex rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f3b2f]">
            Seasonal Engine: {feed.season}
          </span>
        </div>

        <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Beta Launch Featured Places</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {[
              { title: "Hamilton Falls", href: "/places/hamilton-falls" },
              { title: "Jamaica State Park", href: "/places/jamaica-state-park" },
              { title: "Grafton Inn", href: "/places/grafton-inn" },
              { title: "Brattleboro Farmers Market", href: "/places/brattleboro-farmers-market" },
              { title: "Mount Equinox", href: "/places/mount-equinox-skyline-drive" },
            ].map((place) => (
              <Link key={place.title} href={place.href} className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-white">
                {place.title}
              </Link>
            ))}
          </div>
        </section>

        {feed.rails.map((rail) => (
          <RecommendationRail
            key={rail.key}
            title={rail.title}
            recommendations={rail.recommendations}
            emptyMessage="This rail is warming up as data is refreshed."
            mapItem={(recommendation) => ({
              id: recommendation.item.id,
              title: recommendation.item.name,
              subtitle: recommendation.item.description,
              href: `/places/${recommendation.item.slug}`,
              score: recommendation.score,
              badge: recommendation.item.placeType,
              reasons: recommendation.reasons,
            })}
          />
        ))}
      </section>

      <Footer />
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { TripSummary } from "@/components/planner/TripSummary";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import { CompassEngine } from "@/lib/compass/CompassEngine";
import { ExperienceService } from "@/lib/experience/ExperienceService";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { getTrips } from "@/repositories/TripRepository";

export const metadata: Metadata = {
  title: "Southern Vermont Trip Planner",
  description: "Build and preview Southern Vermont itinerary plans using curated mock places, collections, events, and guides.",
};

export default async function PlannerLandingPage() {
  const [plannerEnabled, loadedTrips, experienceFeed, dnaFamilyIdeas, dnaRainyIdeas, dnaScenicIdeas, dnaWeekendIdeas] = await Promise.all([
    isFeatureEnabled("aiPlanner"),
    getTrips(),
    ExperienceService.getHomeFeed(4),
    CompassEngine.recommendFamily(4),
    CompassEngine.recommendRainyDay(4),
    CompassEngine.recommendScenic(4),
    CompassEngine.recommendByVisitLength("half_day", 4),
  ]);
  const trips = (Array.isArray(loadedTrips) ? loadedTrips : []).filter((trip) => trip.status !== "archived");
  const plannerRails = experienceFeed.rails.filter((rail) =>
    ["continue_exploring", "family_friendly", "dog_friendly", "under_30_minutes"].includes(rail.key),
  );

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-gradient-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-18 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">Trip Planner</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Plan a Southern Vermont weekend.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            Build itinerary previews from curated Places, Collections, Events, and Guides.
          </p>
          <Link
            href="/planner/new"
            className="mt-8 inline-flex rounded-full bg-(--color-maple-gold) px-6 py-3 text-sm font-semibold text-(--color-forest-green) transition hover:opacity-90"
          >
            Build New Itinerary
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-6 py-10 sm:px-8 lg:px-10">
        {!plannerEnabled ? (
          <section className="rounded-[24px] border border-[#d7cbb3] bg-[#fff7e4] px-5 py-4 text-sm font-semibold text-[#6b5a30]">
            AI-powered planning coming soon. This preview uses curated SouthernVT data.
          </section>
        ) : null}

        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Saved itinerary templates</p>
          {trips.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {trips.map((trip) => (
                <TripSummary key={trip.id} trip={trip} tripLink={`/planner/${trip.id}`} />
              ))}
            </div>
          ) : (
            <article className="rounded-[24px] border border-dashed border-[#d7cbb3] bg-white p-5 text-sm text-slate-600">
              No trips available yet. Start a new itinerary and generate a preview.
            </article>
          )}
        </section>

        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Experience rails for planning</p>
          {plannerRails.map((rail) => (
            <RecommendationRail
              key={rail.key}
              title={rail.title}
              recommendations={rail.recommendations}
              emptyMessage="Planner rail is warming up with mock feed data."
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

          <RecommendationRail
            title="DNA Family-Friendly Ideas"
            recommendations={dnaFamilyIdeas}
            emptyMessage="Family-focused DNA ideas will appear here."
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

          <RecommendationRail
            title="DNA Rainy Day Backups"
            recommendations={dnaRainyIdeas}
            emptyMessage="Rainy-day DNA ideas will appear here."
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

          <RecommendationRail
            title="DNA Scenic Stops"
            recommendations={dnaScenicIdeas}
            emptyMessage="Scenic DNA ideas will appear here."
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

          <RecommendationRail
            title="DNA Weekend Inspiration"
            recommendations={dnaWeekendIdeas}
            emptyMessage="Weekend DNA ideas will appear here."
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
        </section>
      </section>

      <Footer />
    </main>
  );
}

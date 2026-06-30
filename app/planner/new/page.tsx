import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { TripWizard } from "@/components/planner/TripWizard";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import { mockArticles } from "@/data/articles";
import { mockCollections } from "@/data/collections";
import { mockEvents } from "@/data/events";
import { mockPlaces } from "@/data/places";
import { CompassEngine } from "@/lib/compass/CompassEngine";
import { isFeatureEnabled } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "New Trip Itinerary",
  description: "Generate a day-by-day Southern Vermont itinerary preview from curated places, collections, events, and guides.",
};

export default async function NewTripPlanPage() {
  const [plannerEnabled, compassRecommendations, popularStartingPoints, weekendInspiration, familyFriendlyIdeas, rainyDayBackups, scenicStops] = await Promise.all([
    isFeatureEnabled("aiPlanner"),
    CompassEngine.recommendWeekend(6),
    CompassEngine.recommendByTags(["local", "easy", "weekend"], 6),
    CompassEngine.recommendWeekend(6),
    CompassEngine.recommendFamily(6),
    CompassEngine.recommendByWeather("rain", 6),
    CompassEngine.recommendPhotography(6),
  ]);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <TripWizard
          plannerEnabled={plannerEnabled}
          places={mockPlaces}
          collections={mockCollections}
          events={mockEvents}
          articles={mockArticles}
          compassRecommendations={compassRecommendations}
        />
      </section>

      <section className="mx-auto max-w-7xl space-y-5 px-6 pb-10 sm:px-8 lg:px-10">
        <div className="rounded-3xl border border-[#e8dfc8] bg-white/70 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Continue planning</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Experience Layer</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">Optional rails to refine your itinerary without interrupting the wizard flow.</p>
        </div>

        <RecommendationRail
          title="Popular starting points"
          recommendations={popularStartingPoints}
          emptyMessage="Popular starting points will appear here."
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
          title="Weekend inspiration"
          recommendations={weekendInspiration}
          emptyMessage="Weekend inspiration will appear here."
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
          title="Family-friendly ideas"
          recommendations={familyFriendlyIdeas}
          emptyMessage="Family-friendly ideas will appear here."
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
          title="Rainy day backup plans"
          recommendations={rainyDayBackups}
          emptyMessage="Rainy day backup plans will appear here."
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
          title="Scenic stops to add"
          recommendations={scenicStops}
          emptyMessage="Scenic stops will appear here."
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

      <Footer />
    </main>
  );
}

import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { TripWizard } from "@/components/planner/TripWizard";
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
  const [plannerEnabled, compassRecommendations] = await Promise.all([
    isFeatureEnabled("aiPlanner"),
    CompassEngine.recommendWeekend(6),
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

      <Footer />
    </main>
  );
}

import { ExplorerExperience } from "@/components/explorer/ExplorerExperience";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import { CompassEngine } from "@/lib/compass/CompassEngine";
import { ExplorerService } from "@/lib/discovery/ExplorerService";
import { ExperienceService } from "@/lib/experience/ExperienceService";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Explorer Mode | SouthernVT",
  description: "Tap into a curated Southern Vermont surprise adventure with places, food, guides, deals, and optional events.",
  path: "/explorer",
});

export default async function ExplorerPage() {
  const results = ExplorerService.getExplorerResults();
  const [detailedResults, compassRecommendations, moodOptions, experienceFeed] = await Promise.all([
    Promise.all(results.map((result) => ExplorerService.buildExplorerResultDetails(result))),
    CompassEngine.recommendAdventure(6),
    CompassEngine.getMoodOptions(),
    ExperienceService.getHomeFeed(6),
  ]);

  const explorerRails = experienceFeed.rails.filter((rail) =>
    ["discover_mode", "continue_exploring", "most_photographed", "under_30_minutes"].includes(rail.key),
  );

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <ExplorerExperience detailedResults={detailedResults} compassRecommendations={compassRecommendations} moodOptions={moodOptions} />

      <section className="mx-auto max-w-7xl space-y-6 px-6 pb-10 sm:px-8 lg:px-10">
        {explorerRails.map((rail) => (
          <RecommendationRail
            key={rail.key}
            title={rail.title}
            recommendations={rail.recommendations}
            emptyMessage="Explorer recommendations are updating. Check back in a moment."
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

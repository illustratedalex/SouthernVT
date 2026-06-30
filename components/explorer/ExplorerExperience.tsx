"use client";

import { useMemo, useState } from "react";
import { AdventureResultCard } from "@/components/explorer/AdventureResultCard";
import { AdventureTimeline } from "@/components/explorer/AdventureTimeline";
import { ExplorerCTA } from "@/components/explorer/ExplorerCTA";
import { ExplorerHero } from "@/components/explorer/ExplorerHero";
import { MoodPicker } from "@/components/explorer/MoodPicker";
import { NearbyPlacesRail } from "@/components/discovery/NearbyPlacesRail";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import type { ExplorerResultDetails } from "@/lib/discovery/ExplorerService";
import type { ExplorerMood } from "@/types/Explorer";
import type { Recommendation } from "@/types/Recommendation";
import type { Place } from "@/types/Place";
import { CompassEngine } from "@/lib/compass/CompassEngine";
import type { PlaceMood } from "@/types/PlaceDNA";

type ExplorerExperienceProps = {
  detailedResults: ExplorerResultDetails[];
  compassRecommendations: Recommendation<Place>[];
  moodOptions: PlaceMood[];
};

export function ExplorerExperience({ detailedResults, compassRecommendations, moodOptions }: ExplorerExperienceProps) {
  const [selectedMood, setSelectedMood] = useState<ExplorerMood | "any">("any");
  const [activeResultId, setActiveResultId] = useState<string | null>(detailedResults[0]?.result.id ?? null);
  const [spinCount, setSpinCount] = useState(0);
  const [dnaRecommendations, setDnaRecommendations] = useState<Recommendation<Place>[]>(compassRecommendations);

  const moods = useMemo(() => {
    const fromResults = Array.from(new Set(detailedResults.map((result) => result.result.mood)));
    const fromDNA = moodOptions.filter((mood): mood is ExplorerMood => [
      "adventure",
      "relaxation",
      "food",
      "family",
      "photography",
      "dogs",
      "swimming",
      "scenic",
      "quiet",
      "shopping",
      "history",
      "rainy_day",
      "romantic",
      "accessibility",
    ].includes(mood));
    return Array.from(new Set([...fromResults, ...fromDNA]));
  }, [detailedResults, moodOptions]);
  const activeDetails = useMemo(
    () => detailedResults.find((result) => result.result.id === activeResultId) ?? null,
    [activeResultId, detailedResults],
  );

  const relatedPlaces = useMemo(() => {
    if (!activeDetails) {
      return [];
    }

    return [activeDetails.primaryPlace, activeDetails.foodPlace].filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [activeDetails]);

  const generateAdventure = () => {
    const pool = selectedMood === "any"
      ? detailedResults
      : detailedResults.filter((result) => result.result.mood === selectedMood);

    if (!pool.length) {
      return;
    }

    const pick = pool[spinCount % pool.length];
    setActiveResultId(pick.result.id);
    setSpinCount((current) => current + 1);

    if (selectedMood !== "any") {
      CompassEngine.recommendByMood(selectedMood, 6)
        .then((next) => setDnaRecommendations(next))
        .catch(() => setDnaRecommendations(compassRecommendations));
    } else {
      setDnaRecommendations(compassRecommendations);
    }
  };

  const plannerHref = activeDetails?.primaryPlace ? `/planner/new?place=${activeDetails.primaryPlace.id}` : "/planner/new";

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
      <ExplorerHero
        title="I'm Feeling Adventurous"
        subtitle="Skip the filters and let Compass spin up a polished surprise route through Southern Vermont."
      />

      <MoodPicker moods={moods} selectedMood={selectedMood} onSelectMood={setSelectedMood} />

      <div>
        <button
          type="button"
          onClick={generateAdventure}
          className="rounded-full bg-[#1f3b2f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#f8f2e4] shadow-sm transition hover:bg-[#29493a]"
        >
          I&apos;m Feeling Adventurous
        </button>
      </div>

      <AdventureResultCard details={activeDetails} />
      <AdventureTimeline details={activeDetails} />
      <NearbyPlacesRail places={relatedPlaces} title="Related places" />
      <RecommendationRail
        title="Compass Adventure Picks"
        recommendations={dnaRecommendations}
        emptyMessage="Compass adventure recommendations are loading."
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
      <ExplorerCTA plannerHref={plannerHref} />
    </section>
  );
}

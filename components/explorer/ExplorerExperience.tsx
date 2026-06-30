"use client";

import { useMemo, useState } from "react";
import { AdventureResultCard } from "@/components/explorer/AdventureResultCard";
import { AdventureTimeline } from "@/components/explorer/AdventureTimeline";
import { ExplorerCTA } from "@/components/explorer/ExplorerCTA";
import { ExplorerHero } from "@/components/explorer/ExplorerHero";
import { MoodPicker } from "@/components/explorer/MoodPicker";
import { NearbyPlacesRail } from "@/components/discovery/NearbyPlacesRail";
import type { ExplorerResultDetails } from "@/lib/discovery/ExplorerService";
import type { ExplorerMood } from "@/types/Explorer";

type ExplorerExperienceProps = {
  detailedResults: ExplorerResultDetails[];
};

export function ExplorerExperience({ detailedResults }: ExplorerExperienceProps) {
  const [selectedMood, setSelectedMood] = useState<ExplorerMood | "any">("any");
  const [activeResultId, setActiveResultId] = useState<string | null>(detailedResults[0]?.result.id ?? null);

  const moods = useMemo(() => Array.from(new Set(detailedResults.map((result) => result.result.mood))), [detailedResults]);
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

    const pick = pool[Math.floor(Math.random() * pool.length)];
    setActiveResultId(pick.result.id);
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
          I'm Feeling Adventurous
        </button>
      </div>

      <AdventureResultCard details={activeDetails} />
      <AdventureTimeline details={activeDetails} />
      <NearbyPlacesRail places={relatedPlaces} title="Related places" />
      <ExplorerCTA plannerHref={plannerHref} />
    </section>
  );
}

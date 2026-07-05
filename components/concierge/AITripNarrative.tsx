"use client";

import { useState } from "react";
import { trackAIConcierge } from "@/lib/analytics/events";
import type { ConciergeAINarrative, ConciergePreferences, ConciergeTrip } from "@/types/Concierge";

type AITripNarrativeProps = {
  preferences: ConciergePreferences;
  compassTrip: ConciergeTrip;
  aiConciergeEnabled: boolean;
};

export function AITripNarrative({ preferences, compassTrip, aiConciergeEnabled }: AITripNarrativeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [narrative, setNarrative] = useState<ConciergeAINarrative | null>(null);

  const enhanceWithAI = async () => {
    trackAIConcierge({
      mood: preferences.mood,
      time_available: preferences.timeAvailable,
      travel_style: preferences.travelStyle,
      radius: preferences.radius,
      featured_place_id: compassTrip.recommendations.featuredPlace.id,
    });

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/concierge/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences, compassTrip }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to generate AI trip narrative.");
      }

      const payload = (await response.json()) as ConciergeAINarrative;
      setNarrative(payload);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to generate AI trip narrative.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!aiConciergeEnabled) {
    return (
      <section className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">AI concierge</p>
        <p className="mt-2 text-sm text-slate-600">AI narration is coming soon. Current results are powered by Compass.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">AI concierge narration</p>
          <p className="mt-1 text-sm text-slate-600">Compass selects the itinerary. AI only refines the explanation.</p>
        </div>
        <button
          type="button"
          onClick={enhanceWithAI}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#1f3b2f] px-5 text-sm font-semibold text-[#f8f2e4] transition hover:bg-[#29493a] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Enhancing..." : "Enhance with AI"}
        </button>
      </div>

      {error ? <p className="mt-3 rounded-xl border border-[#e7b7b7] bg-[#fff5f5] px-3 py-2 text-sm text-[#8a3636]">{error}</p> : null}

      {narrative ? (
        <div className="mt-4 space-y-4">
          {narrative.fallbackUsed ? (
            <p className="rounded-xl border border-[#d7cbb3] bg-white px-3 py-2 text-sm text-slate-600">
              Live AI was unavailable, so this explanation was generated from Compass data.
            </p>
          ) : null}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Summary</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{narrative.summary}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Why this trip</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{narrative.whyThisTrip}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Local tips</p>
            <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-700">
              {narrative.localTips.map((tip) => (
                <li key={tip} className="rounded-xl border border-[#e8dfc8] bg-white px-3 py-2">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}

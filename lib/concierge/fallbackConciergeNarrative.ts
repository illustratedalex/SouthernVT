import type { ConciergeAINarrative, ConciergePreferences, ConciergeTrip } from "@/types/Concierge";

function toLabel(value: string): string {
  return value.replaceAll("-", " ");
}

export function fallbackConciergeNarrative(
  preferences: ConciergePreferences,
  compassTrip: ConciergeTrip,
  reason?: "feature-disabled" | "missing-api-key" | "request-failed",
): ConciergeAINarrative {
  const featured = compassTrip.recommendations.featuredPlace.name;
  const summary = `Compass built a ${toLabel(preferences.timeAvailable)} ${toLabel(preferences.mood)} itinerary centered on ${featured}, with supporting picks that fit your ${toLabel(preferences.travelStyle)} travel style and ${toLabel(preferences.radius)} radius.`;

  const whyThisTrip = [
    `The featured stop is matched to your ${toLabel(preferences.mood)} mood.`,
    `Supporting options stay aligned with your ${toLabel(preferences.travelStyle)} travel style.`,
    `Nearby timing and add-ons are tuned for a ${toLabel(preferences.timeAvailable)} plan.`,
  ].join(" ");

  const localTips = [
    `Start with ${featured} at your first timeline window to keep the day on pace.`,
    compassTrip.recommendations.foodStop
      ? `Use ${compassTrip.recommendations.foodStop.name} as your flexible reset point between stops.`
      : "Use your midpoint timeline stop as a flexible reset window for food and rest.",
    "Check weather and road conditions the morning of your trip, then keep one backup stop from your timeline.",
  ];

  if (reason === "feature-disabled") {
    localTips[2] = "AI narration is currently disabled, so this explanation is generated directly from Compass signals.";
  } else if (reason === "missing-api-key") {
    localTips[2] = "AI narration is unavailable right now, so this explanation is generated from Compass data only.";
  }

  return {
    summary,
    whyThisTrip,
    localTips,
    fallbackUsed: true,
  };
}


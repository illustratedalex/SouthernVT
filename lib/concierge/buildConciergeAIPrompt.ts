import type { ConciergePreferences, ConciergeTrip } from "@/types/Concierge";

export type ConciergeAIPrompt = {
  systemPrompt: string;
  userPrompt: string;
};

type GroundedConciergeData = {
  preferences: ConciergePreferences;
  featuredPlace: { name: string; description: string };
  collection: { title: string; subtitle: string } | null;
  guide: { title: string; excerpt: string } | null;
  foodStop: { name: string; description: string } | null;
  optionalEvent: { title: string; description: string } | null;
  optionalDeal: { title: string; description: string } | null;
};

function toSafeText(value: string, maxLength = 220): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1)}…`;
}

function toGroundedData(preferences: ConciergePreferences, compassTrip: ConciergeTrip): GroundedConciergeData {
  return {
    preferences,
    featuredPlace: {
      name: compassTrip.recommendations.featuredPlace.name,
      description: toSafeText(compassTrip.recommendations.featuredPlace.description),
    },
    collection: compassTrip.recommendations.collection
      ? {
          title: compassTrip.recommendations.collection.title,
          subtitle: toSafeText(compassTrip.recommendations.collection.subtitle),
        }
      : null,
    guide: compassTrip.recommendations.guide
      ? {
          title: compassTrip.recommendations.guide.title,
          excerpt: toSafeText(compassTrip.recommendations.guide.excerpt),
        }
      : null,
    foodStop: compassTrip.recommendations.foodStop
      ? {
          name: compassTrip.recommendations.foodStop.name,
          description: toSafeText(compassTrip.recommendations.foodStop.description),
        }
      : null,
    optionalEvent: compassTrip.recommendations.optionalEvent
      ? {
          title: compassTrip.recommendations.optionalEvent.title,
          description: toSafeText(compassTrip.recommendations.optionalEvent.description),
        }
      : null,
    optionalDeal: compassTrip.recommendations.optionalDeal
      ? {
          title: compassTrip.recommendations.optionalDeal.title,
          description: toSafeText(compassTrip.recommendations.optionalDeal.description),
        }
      : null,
  };
}

export function buildConciergeAIPrompt(preferences: ConciergePreferences, compassTrip: ConciergeTrip): ConciergeAIPrompt {
  const groundedData = toGroundedData(preferences, compassTrip);

  const systemPrompt = [
    "You are SouthernVT's editorial trip assistant.",
    "Use only the provided SouthernVT data.",
    "Do not invent places.",
    "Do not invent hours.",
    "Do not invent restaurants.",
    "Do not invent events.",
    "Do not invent deals.",
    "If data is missing, say so briefly.",
    "Compass already chose recommendations. You must not replace or re-rank them.",
    "Return JSON only with keys: summary, whyThisTrip, localTips.",
    "localTips must be an array with exactly 3 practical tips.",
  ].join("\n");

  const userPrompt = [
    "Write a warm, concise narrative for this fixed Compass itinerary.",
    "Include:",
    "- summary: warm trip overview",
    "- whyThisTrip: why this itinerary fits the stated preferences",
    "- localTips: exactly 3 practical local tips",
    "- If rainy-day context is relevant, include a brief rainy-day adjustment in one tip.",
    "Grounded SouthernVT data (JSON):",
    JSON.stringify(groundedData, null, 2),
  ].join("\n");

  return { systemPrompt, userPrompt };
}

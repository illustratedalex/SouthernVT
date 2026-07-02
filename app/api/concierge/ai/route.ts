import { NextResponse } from "next/server";
import { buildConciergeAIPrompt } from "@/lib/concierge/buildConciergeAIPrompt";
import { fallbackConciergeNarrative } from "@/lib/concierge/fallbackConciergeNarrative";
import { isFeatureEnabled } from "@/lib/featureFlags";
import type { ConciergeAINarrative, ConciergePreferences, ConciergeTrip } from "@/types/Concierge";

type ConciergeAIRequestBody = {
  preferences?: unknown;
  compassTrip?: unknown;
};

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

const allowedMoods = new Set([
  "adventure",
  "relax",
  "photography",
  "food",
  "family",
  "romantic",
  "rainy-day",
  "history",
  "shopping",
]);
const allowedTimes = new Set(["1-hour", "2-hours", "half-day", "full-day", "weekend"]);
const allowedTravelStyles = new Set(["solo", "couple", "family", "friends", "dog"]);
const allowedRadii = new Set(["15-min", "30-min", "1-hour", "anywhere"]);

function hasStringProperty(value: unknown, key: string): boolean {
  return Boolean(value && typeof value === "object" && typeof (value as Record<string, unknown>)[key] === "string");
}

function isNullableObjectWithStringFields(value: unknown, fields: string[]): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return fields.every((field) => typeof candidate[field] === "string");
}

function isConciergePreferences(value: unknown): value is ConciergePreferences {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.mood === "string" &&
    typeof candidate.timeAvailable === "string" &&
    typeof candidate.travelStyle === "string" &&
    typeof candidate.radius === "string" &&
    allowedMoods.has(candidate.mood) &&
    allowedTimes.has(candidate.timeAvailable) &&
    allowedTravelStyles.has(candidate.travelStyle) &&
    allowedRadii.has(candidate.radius)
  );
}

function isConciergeTrip(value: unknown): value is ConciergeTrip {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const recommendations = candidate.recommendations as Record<string, unknown> | undefined;
  const featuredPlace = recommendations?.featuredPlace as Record<string, unknown> | undefined;
  const collection = recommendations?.collection;
  const guide = recommendations?.guide;
  const foodStop = recommendations?.foodStop;
  const optionalEvent = recommendations?.optionalEvent;
  const optionalDeal = recommendations?.optionalDeal;

  return Boolean(
    hasStringProperty(featuredPlace, "name") &&
      hasStringProperty(featuredPlace, "description") &&
      isNullableObjectWithStringFields(collection, ["title", "subtitle"]) &&
      isNullableObjectWithStringFields(guide, ["title", "excerpt"]) &&
      isNullableObjectWithStringFields(foodStop, ["name", "description"]) &&
      isNullableObjectWithStringFields(optionalEvent, ["title", "description"]) &&
      isNullableObjectWithStringFields(optionalDeal, ["title", "description"]),
  );
}

function extractJsonObject(text: string): string {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced && fenced[1]) {
    return fenced[1].trim();
  }
  return text.trim();
}

function parseNarrative(content: string): ConciergeAINarrative | null {
  try {
    const parsed = JSON.parse(extractJsonObject(content)) as Partial<ConciergeAINarrative>;
    if (
      typeof parsed.summary !== "string" ||
      typeof parsed.whyThisTrip !== "string" ||
      !Array.isArray(parsed.localTips) ||
      parsed.localTips.some((tip) => typeof tip !== "string")
    ) {
      return null;
    }

    const tips = parsed.localTips.slice(0, 3);
    if (tips.length < 3) {
      return null;
    }

    return {
      summary: parsed.summary.trim(),
      whyThisTrip: parsed.whyThisTrip.trim(),
      localTips: tips.map((tip) => tip.trim()),
      fallbackUsed: false,
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: ConciergeAIRequestBody;
  try {
    body = (await request.json()) as ConciergeAIRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (!isConciergePreferences(body.preferences) || !isConciergeTrip(body.compassTrip)) {
    return NextResponse.json({ error: "Invalid concierge input." }, { status: 400 });
  }

  const preferences = body.preferences;
  const compassTrip = body.compassTrip;
  const aiConciergeEnabled = await isFeatureEnabled("aiConcierge");
  if (!aiConciergeEnabled) {
    return NextResponse.json(fallbackConciergeNarrative(preferences, compassTrip, "feature-disabled"));
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallbackConciergeNarrative(preferences, compassTrip, "missing-api-key"));
  }

  const prompt = buildConciergeAIPrompt(preferences, compassTrip);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: prompt.systemPrompt },
          { role: "user", content: prompt.userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`Concierge AI request failed: ${response.status} ${response.statusText}`);
      return NextResponse.json(fallbackConciergeNarrative(preferences, compassTrip, "request-failed"));
    }

    const data = (await response.json()) as OpenAIChatResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("Concierge AI response missing message content.");
      return NextResponse.json(fallbackConciergeNarrative(preferences, compassTrip, "request-failed"));
    }

    const parsedNarrative = parseNarrative(content);
    if (!parsedNarrative) {
      console.error("Concierge AI response was not valid structured narrative JSON.");
      return NextResponse.json(fallbackConciergeNarrative(preferences, compassTrip, "request-failed"));
    }

    return NextResponse.json(parsedNarrative);
  } catch (error) {
    console.error("Concierge AI request errored.", error);
    return NextResponse.json(fallbackConciergeNarrative(preferences, compassTrip, "request-failed"));
  }
}

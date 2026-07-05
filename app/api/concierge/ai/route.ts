import OpenAI from "openai";
import { NextResponse } from "next/server";
import { buildConciergeAIPrompt } from "@/lib/concierge/buildConciergeAIPrompt";
import { fallbackConciergeNarrative } from "@/lib/concierge/fallbackConciergeNarrative";
import { parseConciergeAIResponse } from "@/lib/concierge/parseConciergeAIResponse";
import { isFeatureEnabled } from "@/lib/featureFlags";
import type { ConciergePreferences, ConciergeTrip } from "@/types/Concierge";

type ConciergeAIRequestBody = {
  preferences?: unknown;
  compassTrip?: unknown;
};

function createOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}

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
  const requestFallback = fallbackConciergeNarrative(preferences, compassTrip, "request-failed");

  try {
    const response = await createOpenAIClient(apiKey).responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content:
            "You are SouthernVT’s editorial trip assistant. Use only the provided SouthernVT data. Do not invent places, hours, restaurants, events, or facts. If data is missing, say so briefly.",
        },
        {
          role: "user",
          content: prompt.userPrompt,
        },
      ],
    });

    const outputText = response.output_text?.trim();
    if (!outputText) {
      console.error("Concierge AI response missing message content.");
      return NextResponse.json(requestFallback);
    }

    return NextResponse.json(
      parseConciergeAIResponse(outputText, {
        whyThisTrip: requestFallback.whyThisTrip,
        localTips: requestFallback.localTips,
      }),
    );
  } catch (error) {
    console.error("Concierge AI request errored.", error);
    return NextResponse.json(requestFallback);
  }
}

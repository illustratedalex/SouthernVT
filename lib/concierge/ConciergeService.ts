import { CompassEngine } from "@/lib/compass/CompassEngine";
import { DiscoveryService } from "@/lib/discovery/DiscoveryService";
import { getPlaceDNA } from "@/lib/repositories/PlaceDNARepository";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getPublishedArticles } from "@/repositories/ArticleRepository";
import { getPublishedDeals } from "@/repositories/DealRepository";
import { getPublishedEvents } from "@/repositories/EventRepository";
import { getStoryByPlace } from "@/repositories/StoryRepository";
import type { PlaceMood, VisitLength } from "@/types/PlaceDNA";
import type {
  ConciergeMood,
  ConciergePreferences,
  ConciergeRadius,
  ConciergeRecommendation,
  ConciergeTimeAvailable,
  ConciergeTimelineItem,
  ConciergeTravelStyle,
  ConciergeTrip,
} from "@/types/Concierge";
import type { Place } from "@/types/Place";

type MoodOption = {
  value: ConciergeMood;
  label: string;
  moodSignals: PlaceMood[];
  tagSignals: string[];
};

type TimeOption = {
  value: ConciergeTimeAvailable;
  label: string;
  visitLength: VisitLength;
};

type TravelStyleOption = {
  value: ConciergeTravelStyle;
  label: string;
  tagSignals: string[];
};

type RadiusOption = {
  value: ConciergeRadius;
  label: string;
  miles: number | null;
};

export const conciergeMoodOptions: MoodOption[] = [
  { value: "adventure", label: "Adventure", moodSignals: ["adventure"], tagSignals: ["adventure", "trail"] },
  { value: "relax", label: "Relax", moodSignals: ["relaxation", "quiet"], tagSignals: ["relax", "quiet"] },
  { value: "photography", label: "Photography", moodSignals: ["photography", "scenic"], tagSignals: ["photography", "scenic"] },
  { value: "food", label: "Food", moodSignals: ["food"], tagSignals: ["food", "local"] },
  { value: "family", label: "Family", moodSignals: ["family"], tagSignals: ["family", "kids"] },
  { value: "romantic", label: "Romantic", moodSignals: ["romantic", "scenic"], tagSignals: ["romantic", "sunset"] },
  { value: "rainy-day", label: "Rainy Day", moodSignals: ["rainy_day"], tagSignals: ["rainy day", "indoor"] },
  { value: "history", label: "History", moodSignals: ["history"], tagSignals: ["history", "village"] },
  { value: "shopping", label: "Shopping", moodSignals: ["shopping"], tagSignals: ["shopping", "village"] },
];

export const conciergeTimeOptions: TimeOption[] = [
  { value: "1-hour", label: "1 Hour", visitLength: "under_1_hour" },
  { value: "2-hours", label: "2 Hours", visitLength: "1_2_hours" },
  { value: "half-day", label: "Half Day", visitLength: "half_day" },
  { value: "full-day", label: "Full Day", visitLength: "full_day" },
  { value: "weekend", label: "Weekend", visitLength: "full_day" },
];

export const conciergeTravelStyleOptions: TravelStyleOption[] = [
  { value: "solo", label: "Solo", tagSignals: ["solo", "quiet"] },
  { value: "couple", label: "Couple", tagSignals: ["couples", "romantic"] },
  { value: "family", label: "Family", tagSignals: ["family", "kids"] },
  { value: "friends", label: "Friends", tagSignals: ["group", "weekend"] },
  { value: "dog", label: "Dog", tagSignals: ["dog", "dogs"] },
];

export const conciergeRadiusOptions: RadiusOption[] = [
  { value: "15-min", label: "15 minutes", miles: 12 },
  { value: "30-min", label: "30 minutes", miles: 25 },
  { value: "1-hour", label: "1 hour", miles: 50 },
  { value: "anywhere", label: "Anywhere", miles: null },
];

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceMiles(a: Place, b: Place): number {
  const radius = 3958.8;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const t =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * radius * Math.atan2(Math.sqrt(t), Math.sqrt(1 - t));
}

async function moodRecommendations(value: ConciergeMood) {
  switch (value) {
    case "adventure":
      return CompassEngine.recommendAdventure(6);
    case "relax":
      return CompassEngine.recommendByMood("relaxation", 6);
    case "photography":
      return CompassEngine.recommendPhotography(6);
    case "food":
      return CompassEngine.recommendFood(6);
    case "family":
      return CompassEngine.recommendFamily(6);
    case "romantic":
      return CompassEngine.recommendByMood("romantic", 6);
    case "rainy-day":
      return CompassEngine.recommendRainyDay(6);
    case "history":
      return CompassEngine.recommendByMood("history", 6);
    case "shopping":
      return CompassEngine.recommendByMood("shopping", 6);
    default:
      return CompassEngine.recommendWeekend(6);
  }
}

export function buildTimeline(
  recommendations: ConciergeRecommendation,
  timeAvailable: ConciergeTimeAvailable,
): ConciergeTimelineItem[] {
  const secondary = recommendations.nearbyPlaces[0];
  const village = recommendations.nearbyPlaces[1];
  const breakfast = recommendations.foodStop ? `Breakfast at ${recommendations.foodStop.name}` : "Breakfast stop";
  const lunch = recommendations.foodStop ? `Lunch at ${recommendations.foodStop.name}` : "Lunch stop";

  if (timeAvailable === "1-hour") {
    return [
      { time: "Now", title: recommendations.featuredPlace.name, detail: "Start with the highest-fit stop for your selected mood." },
      { time: "+45 min", title: "Quick wrap-up", detail: "Capture highlights, then transition to your next commitment." },
    ];
  }

  if (timeAvailable === "2-hours") {
    return [
      { time: "Now", title: recommendations.featuredPlace.name, detail: "Anchor your short route with one strong local pick." },
      { time: "+60 min", title: secondary ? secondary.name : "Nearby stop", detail: "Add one close follow-up to round out the experience." },
      { time: "+110 min", title: recommendations.foodStop ? recommendations.foodStop.name : "Food break", detail: "Finish with a simple food or coffee stop." },
    ];
  }

  if (timeAvailable === "half-day") {
    return [
      { time: "9:00", title: breakfast, detail: "Start with fuel before your main stop." },
      { time: "10:00", title: recommendations.featuredPlace.name, detail: "Primary destination window." },
      { time: "12:30", title: lunch, detail: "Relaxed midday break." },
      { time: "2:00", title: secondary ? secondary.name : "Nearby scenic stop", detail: "Close with one extra local highlight." },
    ];
  }

  if (timeAvailable === "weekend") {
    return [
      { time: "Day 1 · 9:00", title: breakfast, detail: "Ease into the route with a local breakfast stop." },
      { time: "Day 1 · 10:30", title: recommendations.featuredPlace.name, detail: "Main destination block." },
      { time: "Day 1 · 1:30", title: lunch, detail: "Midday meal and reset." },
      { time: "Day 1 · 3:00", title: secondary ? secondary.name : "Scenic extension", detail: "Optional add-on stop in your radius." },
      { time: "Day 2 · 10:00", title: village ? village.name : "Village walk", detail: "Slow local browsing and photos." },
      { time: "Day 2 · 6:00", title: "Dinner", detail: "Finish with a high-confidence dinner recommendation." },
    ];
  }

  return [
    { time: "9:00", title: breakfast, detail: "Breakfast and route setup." },
    { time: "10:00", title: recommendations.featuredPlace.name, detail: "Primary destination block." },
    { time: "1:00", title: lunch, detail: "Midday food stop." },
    { time: "2:30", title: secondary ? secondary.name : "Nearby scenic stop", detail: "Second destination within your selected radius." },
    { time: "4:00", title: village ? `${village.name} walk` : "Village walk", detail: "Flexible local exploration window." },
    { time: "6:00", title: "Dinner", detail: "Wrap the day with a relaxing dinner stop." },
  ];
}

export function getConciergeReasoning(
  preferences: ConciergePreferences,
  recommendations: ConciergeRecommendation,
): string[] {
  const reasons = [
    `Mood: ${preferences.mood.replace("-", " ")} matched to ${recommendations.featuredPlace.name}.`,
    `Travel style: ${preferences.travelStyle} adjusted supporting recommendations.`,
    `Radius: ${preferences.radius} constrained nearby add-ons and food stop selection.`,
  ];

  if (recommendations.collection) {
    reasons.push(`Collection fit: ${recommendations.collection.title}.`);
  }
  if (recommendations.guide) {
    reasons.push(`Guide fit: ${recommendations.guide.title}.`);
  }
  if (recommendations.optionalEvent) {
    reasons.push(`Optional event: ${recommendations.optionalEvent.title}.`);
  }
  if (recommendations.optionalDeal) {
    reasons.push(`Optional deal: ${recommendations.optionalDeal.title}.`);
  }

  return reasons;
}

export async function generateConciergeTrip(preferences: ConciergePreferences): Promise<ConciergeTrip | null> {
  const moodOption = conciergeMoodOptions.find((option) => option.value === preferences.mood);
  const timeOption = conciergeTimeOptions.find((option) => option.value === preferences.timeAvailable);
  const styleOption = conciergeTravelStyleOptions.find((option) => option.value === preferences.travelStyle);
  const radiusOption = conciergeRadiusOptions.find((option) => option.value === preferences.radius);

  if (!moodOption || !timeOption || !styleOption || !radiusOption) {
    return null;
  }

  const [moodRecs, visitLengthRecs, weekendRecs, allCollections, allGuides, allEvents, allDeals] = await Promise.all([
    moodRecommendations(moodOption.value),
    CompassEngine.recommendByVisitLength(timeOption.visitLength, 6),
    CompassEngine.recommendWeekend(6),
    getCollections(),
    getPublishedArticles(),
    getPublishedEvents(),
    getPublishedDeals(),
  ]);

  const candidatePlaceRecs = [...moodRecs, ...visitLengthRecs, ...weekendRecs].filter(
    (rec, index, arr) => arr.findIndex((other) => other.item.id === rec.item.id) === index,
  );
  const featuredPlace = candidatePlaceRecs[0]?.item ?? null;
  if (!featuredPlace) {
    return null;
  }

  const [nearby, story, placeDNA, collectionRecs, guideRecs, eventRecs, dealRecs, foodRecs] = await Promise.all([
    DiscoveryService.getNearbyPlaces(featuredPlace.id, 10),
    getStoryByPlace(featuredPlace.id),
    getPlaceDNA(featuredPlace.id),
    CompassEngine.recommendCollectionsByTags([...featuredPlace.tags, ...moodOption.tagSignals, ...styleOption.tagSignals], 4),
    CompassEngine.recommendArticlesByTags([...featuredPlace.tags, ...moodOption.tagSignals], 4),
    CompassEngine.recommendEventsByTags([...featuredPlace.tags, ...styleOption.tagSignals], 4),
    CompassEngine.recommendDealsByTags([...featuredPlace.tags, ...moodOption.tagSignals], 4),
    CompassEngine.recommendFood(6),
  ]);

  const inRadius =
    radiusOption.miles === null
      ? nearby
      : (() => {
          const radiusMiles = radiusOption.miles;
          return nearby.filter((candidate) => distanceMiles(featuredPlace, candidate) <= radiusMiles);
        })();

  const recommendations: ConciergeRecommendation = {
    featuredPlace,
    collection:
      collectionRecs[0]?.item ??
      allCollections.find((collection) => collection.status === "published" && collection.places.includes(featuredPlace.id)) ??
      null,
    guide:
      guideRecs[0]?.item ??
      allGuides.find((guide) => guide.relatedPlaces.includes(featuredPlace.id)) ??
      null,
    foodStop:
      inRadius.find((place) => ["Restaurant", "Brewery", "Farm Stand"].includes(place.placeType)) ??
      foodRecs.find((recommendation) => recommendation.item.id !== featuredPlace.id)?.item ??
      null,
    optionalEvent:
      eventRecs[0]?.item ??
      allEvents.find((event) => event.venuePlaceId === featuredPlace.id) ??
      null,
    optionalDeal:
      dealRecs[0]?.item ??
      allDeals.find((deal) => deal.placeId === featuredPlace.id) ??
      null,
    storySummary: story?.summary ?? featuredPlace.description,
    placeDNA,
    nearbyPlaces: inRadius,
  };

  const timeline = buildTimeline(recommendations, preferences.timeAvailable);
  const reasoning = getConciergeReasoning(preferences, recommendations);

  return {
    preferences,
    recommendations,
    timeline,
    reasoning,
  };
}

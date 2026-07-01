import { mockRelationships } from "@/data/relationships";
import { calculatePlaceCompleteness } from "@/lib/completeness/placeCompleteness";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { getEdges as getKnowledgeEdges } from "@/lib/repositories/KnowledgeGraphRepository";
import { getAllPlaceDNA, getPlaceDNA } from "@/lib/repositories/PlaceDNARepository";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getStoryByCollection, getStoryByPlace } from "@/repositories/StoryRepository";
import { getPublishedArticles } from "@/repositories/ArticleRepository";
import { getPublishedDeals } from "@/repositories/DealRepository";
import { getPublishedEvents } from "@/repositories/EventRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { Recommendation } from "@/types/Recommendation";
import type { RecommendationReason } from "@/types/RecommendationReason";
import type { EnergyLevel, PlaceMood, VisitLength } from "@/types/PlaceDNA";

export type CompassContext = {
  anchorPlace?: Place;
  season?: string;
  audience?: string;
  tags?: string[];
  weather?: "sunny" | "rain" | "snow" | "cloudy";
  month?: number;
  moods?: PlaceMood[];
  visitLength?: VisitLength;
  energyLevel?: EnergyLevel;
};

function overlap(a: string[], b: string[]): number {
  const set = new Set(b.map((value) => value.toLowerCase()));
  return a.reduce((count, value) => (set.has(value.toLowerCase()) ? count + 1 : count), 0);
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceMiles(a: Place, b: Place): number {
  const r = 3958.8;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const t =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * r * Math.atan2(Math.sqrt(t), Math.sqrt(1 - t));
}

function popularityPlaceholder(id: string): number {
  const score = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return score % 20;
}

function seasonFromMonth(month: number): string {
  if ([12, 1, 2].includes(month)) {
    return "Winter";
  }
  if ([3, 4, 5].includes(month)) {
    return "Spring";
  }
  if ([6, 7, 8].includes(month)) {
    return "Summer";
  }
  return "Fall";
}

function graphKey(fromNodeId: string, toNodeId: string): string {
  return `${fromNodeId}->${toNodeId}`;
}

let knowledgeWeightMapPromise: Promise<Map<string, number>> | null = null;

async function getKnowledgeWeightMap(): Promise<Map<string, number>> {
  if (knowledgeWeightMapPromise) {
    return knowledgeWeightMapPromise;
  }

  knowledgeWeightMapPromise = getKnowledgeEdges().then((edges) => {
    const map = new Map<string, number>();
    edges.forEach((edge) => {
      map.set(graphKey(edge.fromNodeId, edge.toNodeId), (map.get(graphKey(edge.fromNodeId, edge.toNodeId)) ?? 0) + edge.weight);
    });
    return map;
  });

  return knowledgeWeightMapPromise;
}

function relationshipWeightFromRelationships(fromId: string, toId: string): number {
  return mockRelationships.reduce((score, relation) => {
    const direct = relation.fromId === fromId && relation.toId === toId;
    const reverse = relation.toId === fromId && relation.fromId === toId;
    if (!direct && !reverse) {
      return score;
    }
    if (relation.relationshipType === "nearby") {
      return score + 12;
    }
    if (relation.relationshipType === "featured_in" || relation.relationshipType === "contains") {
      return score + 10;
    }
    return score + 8;
  }, 0);
}

async function relationshipWeight(fromId: string, toId: string): Promise<number> {
  const baseWeight = relationshipWeightFromRelationships(fromId, toId);
  const weightMap = await getKnowledgeWeightMap();
  const fromNodeId = `place:${fromId}`;
  const toNodeId = `place:${toId}`;
  const graphWeight = (weightMap.get(graphKey(fromNodeId, toNodeId)) ?? 0) + (weightMap.get(graphKey(toNodeId, fromNodeId)) ?? 0);
  return baseWeight + Math.round(graphWeight * 0.6);
}

function reason(message: string, code: RecommendationReason["code"], weight: number): RecommendationReason {
  return { message, code, weight };
}

let premiumProfilesEnabledPromise: Promise<boolean> | null = null;

async function premiumProfilesEnabled() {
  if (!premiumProfilesEnabledPromise) {
    premiumProfilesEnabledPromise = isFeatureEnabled("premiumProfiles");
  }

  return premiumProfilesEnabledPromise;
}

function sortRecommendations<T>(items: Recommendation<T>[], limit: number): Recommendation<T>[] {
  return [...items].sort((a, b) => b.score - a.score).slice(0, limit);
}

function inferSeason(context: CompassContext): string {
  if (context.season) {
    return context.season;
  }

  const month = context.month ?? new Date().getMonth() + 1;
  return seasonFromMonth(month);
}

function weatherTagBoost(place: Place, weather: CompassContext["weather"]): number {
  if (!weather) {
    return 0;
  }

  const normalized = place.tags.join(" ").toLowerCase();
  if (weather === "rain" && (normalized.includes("indoor") || place.placeType === "Shop" || place.placeType === "Restaurant")) {
    return 10;
  }
  if (weather === "sunny" && (normalized.includes("outdoor") || place.placeType === "Trail" || place.placeType === "Waterfall")) {
    return 10;
  }
  if (weather === "snow" && normalized.includes("winter")) {
    return 10;
  }
  if (weather === "cloudy" && normalized.includes("scenic")) {
    return 6;
  }
  return 0;
}

function normalizeWeather(weather: CompassContext["weather"]): "sunny" | "cloudy" | "rainy" | "snowy" | "any" {
  if (weather === "rain") {
    return "rainy";
  }
  if (weather === "snow") {
    return "snowy";
  }
  if (weather === "cloudy") {
    return "cloudy";
  }
  if (weather === "sunny") {
    return "sunny";
  }
  return "any";
}

function dnaWeatherBoost(preference: "sunny" | "cloudy" | "rainy" | "snowy" | "any", weather?: CompassContext["weather"]): number {
  if (!weather || preference === "any") {
    return 0;
  }
  return normalizeWeather(weather) === preference ? 8 : 0;
}

export const CompassEngine = {
  async scorePlace(place: Place, context: CompassContext = {}): Promise<Recommendation<Place>> {
    const reasons: RecommendationReason[] = [];
    let score = 0;
    const dna = await getPlaceDNA(place.id);

    if (context.anchorPlace && context.anchorPlace.id !== place.id) {
      const miles = distanceMiles(context.anchorPlace, place);
      const distanceScore = Math.max(0, 28 - Math.min(28, miles));
      score += distanceScore;
      if (distanceScore > 8) {
        reasons.push(reason("Great nearby match.", "distance", distanceScore));
      }

      const relationshipScore = await relationshipWeight(context.anchorPlace.id, place.id);
      score += relationshipScore;
      if (relationshipScore > 0) {
        reasons.push(reason("Connected through local relationship mapping.", "relationships", relationshipScore));
      }

      const tagScore = overlap(context.anchorPlace.tags, place.tags) * 6;
      const categoryScore = overlap(context.anchorPlace.categories, place.categories) * 5;
      score += tagScore + categoryScore;
      if (tagScore > 0) {
        reasons.push(reason("Recommended because you liked similar tags.", "tags", tagScore));
      }
      if (categoryScore > 0) {
        reasons.push(reason("Shared categories with your current stop.", "categories", categoryScore));
      }
    }

    const contextTagScore = overlap(context.tags ?? [], place.tags) * 5;
    score += contextTagScore;
    if (contextTagScore > 0) {
      reasons.push(reason("Recommended because you liked waterfalls.", "tags", contextTagScore));
    }

    if (dna) {
      const moodOverlap = overlap(context.moods ?? [], dna.moods);
      if (moodOverlap > 0) {
        const moodScore = moodOverlap * 8;
        score += moodScore;
        const leadMood = (context.moods ?? []).find((item) => dna.moods.includes(item));
        if (leadMood === "photography") {
          reasons.push(reason("Great for photography.", "dna_mood", moodScore));
        } else if (leadMood === "scenic" || leadMood === "quiet") {
          reasons.push(reason("Quiet scenic pick.", "dna_crowd", moodScore));
        } else {
          reasons.push(reason("Mood fit from Place DNA profile.", "dna_mood", moodScore));
        }
      }

      const seasonalTarget = inferSeason(context).toLowerCase();
      if (dna.bestSeasons.some((entry) => entry.toLowerCase().includes(seasonalTarget))) {
        score += 10;
        reasons.push(reason(`Best in ${inferSeason(context)}.`, "season", 10));
      }

      if (context.visitLength && dna.recommendedVisitLength === context.visitLength) {
        score += 8;
        reasons.push(reason(`Good for a ${context.visitLength.replaceAll("_", "-")} visit.`, "dna_visit_length", 8));
      }

      if (context.energyLevel && dna.energyLevel === context.energyLevel) {
        score += 8;
        reasons.push(reason(`${dna.energyLevel.charAt(0).toUpperCase() + dna.energyLevel.slice(1)} energy adventure.`, "dna_energy", 8));
      }

      const weatherScore = dnaWeatherBoost(dna.weatherPreference, context.weather);
      if (weatherScore > 0) {
        score += weatherScore;
        reasons.push(reason("Weather preference match from Place DNA.", "weather", weatherScore));
      }
    }

    if (place.featured) {
      score += 8;
      reasons.push(reason("Featured by SouthernVT editors.", "featured", 8));
    }

    if ((await premiumProfilesEnabled()) && place.isPremium) {
      score += 4;
      reasons.push(reason("Premium partner profile boost.", "featured", 4));
    }

    const completeness = calculatePlaceCompleteness(place).percentage;
    const completenessScore = Math.round(completeness / 10);
    score += completenessScore;
    reasons.push(reason(`High content completeness at ${completeness}%.`, "completeness", completenessScore));

    const discoveryScore = place.relatedPlaces.length * 2 + place.tags.length;
    score += discoveryScore;
    reasons.push(reason("Strong discovery graph signals.", "discovery_score", discoveryScore));

    const story = await getStoryByPlace(place.id);
    const seasonalTarget = inferSeason(context);
    if (story) {
      const storyScore = Math.min(12, Math.round((story.summary.length + story.visitorTips.length * 20) / 60));
      score += storyScore;
      reasons.push(reason("Rich story depth and visitor guidance.", "story_score", storyScore));

      if (story.season === seasonalTarget || story.season === "Year-Round") {
        score += 10;
        reasons.push(reason(`Popular in ${seasonalTarget}.`, "season", 10));
      }
    }

    const weatherScore = weatherTagBoost(place, context.weather);
    score += weatherScore;
    if (weatherScore > 0) {
      reasons.push(reason("Good weather fit for your day.", "weather", weatherScore));
    }

    const popularity = popularityPlaceholder(place.id);
    score += popularity;
    reasons.push(reason("Consistent visitor interest trend.", "popularity", popularity));

    return {
      contentType: "place",
      item: place,
      score,
      reasons: reasons.sort((a, b) => b.weight - a.weight),
    };
  },

  async scoreCollection(collection: Collection, context: CompassContext = {}): Promise<Recommendation<Collection>> {
    const reasons: RecommendationReason[] = [];
    let score = 0;

    const tagScore = overlap(context.tags ?? [], collection.tags) * 6;
    score += tagScore;
    if (tagScore > 0) {
      reasons.push(reason("Collection aligns with your current interests.", "tags", tagScore));
    }

    if (context.audience && collection.audience.toLowerCase().includes(context.audience.toLowerCase())) {
      score += 12;
      reasons.push(reason("Strong audience fit.", "audience", 12));
    }

    const seasonalTarget = inferSeason(context);
    if (collection.season === seasonalTarget || collection.season === "Year-Round") {
      score += 10;
      reasons.push(reason(`Popular in ${seasonalTarget}.`, "season", 10));
    }

    const story = await getStoryByCollection(collection.id);
    if (story) {
      const storyScore = Math.min(10, Math.round((story.localSecrets.length + story.visitorTips.length) * 1.5));
      score += storyScore;
      reasons.push(reason("Story-backed route with local insights.", "story_score", storyScore));
    }

    if (collection.featured) {
      score += 8;
      reasons.push(reason("Editor-featured collection.", "featured", 8));
    }

    const popularity = popularityPlaceholder(collection.id);
    score += popularity;
    reasons.push(reason("Reliable collection engagement trend.", "popularity", popularity));

    return {
      contentType: "collection",
      item: collection,
      score,
      reasons: reasons.sort((a, b) => b.weight - a.weight),
    };
  },

  async scoreArticle(article: Article, context: CompassContext = {}): Promise<Recommendation<Article>> {
    const reasons: RecommendationReason[] = [];
    let score = 0;

    const tagScore = overlap(context.tags ?? [], article.tags) * 6;
    score += tagScore;
    if (tagScore > 0) {
      reasons.push(reason("Guide tags match your interests.", "tags", tagScore));
    }

    const categoryScore = overlap(context.tags ?? [], article.categories) * 4;
    score += categoryScore;
    if (categoryScore > 0) {
      reasons.push(reason("Categories match your planning context.", "categories", categoryScore));
    }

    if (article.featured) {
      score += 8;
      reasons.push(reason("Featured by editorial team.", "featured", 8));
    }

    const seasonalTarget = inferSeason(context).toLowerCase();
    if (article.tags.some((tag) => tag.toLowerCase().includes(seasonalTarget))) {
      score += 9;
      reasons.push(reason(`Popular in ${inferSeason(context)}.`, "season", 9));
    }

    const popularity = popularityPlaceholder(article.id);
    score += popularity;
    reasons.push(reason("Strong guide readership trend.", "popularity", popularity));

    return {
      contentType: "article",
      item: article,
      score,
      reasons: reasons.sort((a, b) => b.weight - a.weight),
    };
  },

  async scoreDeal(deal: Deal, context: CompassContext = {}): Promise<Recommendation<Deal>> {
    const reasons: RecommendationReason[] = [];
    let score = 0;

    const tagScore = overlap(context.tags ?? [], deal.tags) * 6;
    score += tagScore;
    if (tagScore > 0) {
      reasons.push(reason("Deal tags align with your route.", "tags", tagScore));
    }

    const categoryScore = overlap(context.tags ?? [], deal.categories) * 4;
    score += categoryScore;
    if (categoryScore > 0) {
      reasons.push(reason("Matches your selected category interests.", "categories", categoryScore));
    }

    if (deal.featured) {
      score += 8;
      reasons.push(reason("Featured partner offer.", "featured", 8));
    }

    const seasonalTarget = inferSeason(context).toLowerCase();
    if (deal.tags.some((tag) => tag.toLowerCase().includes(seasonalTarget))) {
      score += 8;
      reasons.push(reason(`Popular in ${inferSeason(context)}.`, "season", 8));
    }

    const popularity = popularityPlaceholder(deal.id);
    score += popularity;
    reasons.push(reason("Frequently clicked partner offer.", "popularity", popularity));

    return {
      contentType: "deal",
      item: deal,
      score,
      reasons: reasons.sort((a, b) => b.weight - a.weight),
    };
  },

  async scoreEvent(event: Event, context: CompassContext = {}): Promise<Recommendation<Event>> {
    const reasons: RecommendationReason[] = [];
    let score = 0;

    const tagScore = overlap(context.tags ?? [], event.tags) * 6;
    score += tagScore;
    if (tagScore > 0) {
      reasons.push(reason("Event tags match your interests.", "tags", tagScore));
    }

    const categoryScore = overlap(context.tags ?? [], event.categories) * 4;
    score += categoryScore;
    if (categoryScore > 0) {
      reasons.push(reason("Event categories match your route.", "categories", categoryScore));
    }

    if (event.featured) {
      score += 8;
      reasons.push(reason("Featured community event.", "featured", 8));
    }

    const month = context.month ?? new Date().getMonth() + 1;
    const eventMonth = Number(event.startDate.split("-")[1] ?? month);
    if (Math.abs(eventMonth - month) <= 1) {
      score += 9;
      reasons.push(reason("Happening in the current season window.", "season", 9));
    }

    const popularity = popularityPlaceholder(event.id);
    score += popularity;
    reasons.push(reason("Consistent seasonal attendance trend.", "popularity", popularity));

    return {
      contentType: "event",
      item: event,
      score,
      reasons: reasons.sort((a, b) => b.weight - a.weight),
    };
  },

  async recommendNearby(placeId: string, limit = 4): Promise<Recommendation<Place>[]> {
    const places = (await getPlaces()).filter((place) => place.status === "published");
    const anchor = places.find((place) => place.id === placeId);
    if (!anchor) {
      return [];
    }

    const recs = await Promise.all(
      places
        .filter((place) => place.id !== placeId)
        .map((place) => this.scorePlace(place, { anchorPlace: anchor, tags: anchor.tags })),
    );
    return sortRecommendations(recs, limit);
  },

  async recommendForSeason(season: string, limit = 6): Promise<Recommendation<Place>[]> {
    const places = (await getPlaces()).filter((place) => place.status === "published");
    const recs = await Promise.all(places.map((place) => this.scorePlace(place, { season })));
    return sortRecommendations(recs, limit);
  },

  async recommendForAudience(audience: string, limit = 6): Promise<Recommendation<Collection>[]> {
    const collections = (await getCollections()).filter((collection) => collection.status === "published");
    const recs = await Promise.all(collections.map((collection) => this.scoreCollection(collection, { audience })));
    return sortRecommendations(recs, limit);
  },

  async recommendByTags(tags: string[], limit = 6): Promise<Recommendation<Place>[]> {
    const places = (await getPlaces()).filter((place) => place.status === "published");
    const recs = await Promise.all(places.map((place) => this.scorePlace(place, { tags })));
    return sortRecommendations(recs, limit);
  },

  async recommendByWeather(weather: CompassContext["weather"], limit = 6): Promise<Recommendation<Place>[]> {
    const places = (await getPlaces()).filter((place) => place.status === "published");
    const recs = await Promise.all(places.map((place) => this.scorePlace(place, { weather })));
    return sortRecommendations(recs, limit);
  },

  async recommendWeekend(limit = 6): Promise<Recommendation<Place>[]> {
    const recs = await this.recommendByTags(["weekend", "scenic", "local"], limit);
    return recs.map((rec) => ({
      ...rec,
      reasons: [reason("Built for weekend pacing.", "weekend", 10), ...rec.reasons],
      score: rec.score + 10,
    }));
  },

  async recommendFamily(limit = 6): Promise<Recommendation<Place>[]> {
    const recs = await this.recommendByMood("family", limit);
    return recs.map((rec) => ({
      ...rec,
      reasons: [reason("Family friendly.", "family", 10), ...rec.reasons],
      score: rec.score + 10,
    }));
  },

  async recommendFood(limit = 6): Promise<Recommendation<Place>[]> {
    const places = (await getPlaces()).filter((place) => ["Restaurant", "Brewery", "Farm Stand"].includes(place.placeType));
    const recs = await Promise.all(places.map((place) => this.scorePlace(place, { tags: ["food", "drink", "local"] })));
    return sortRecommendations(
      recs.map((rec) => ({
        ...rec,
        reasons: [reason("Food-forward recommendation.", "food", 10), ...rec.reasons],
        score: rec.score + 10,
      })),
      limit,
    );
  },

  async recommendAdventure(limit = 6): Promise<Recommendation<Place>[]> {
    const recs = await this.recommendByMood("adventure", limit);
    return recs.map((rec) => ({
      ...rec,
      reasons: [reason("Adventure-ready route match.", "adventure", 10), ...rec.reasons],
      score: rec.score + 10,
    }));
  },

  async recommendPhotography(limit = 6): Promise<Recommendation<Place>[]> {
    const recs = await this.recommendByMood("photography", limit);
    return recs.map((rec) => ({
      ...rec,
      reasons: [reason("Strong photography potential.", "photography", 10), ...rec.reasons],
      score: rec.score + 10,
    }));
  },

  async recommendHiddenGem(limit = 6): Promise<Recommendation<Place>[]> {
    const places = (await getPlaces()).filter((place) => !place.featured && place.tags.some((tag) => ["local", "hidden gems", "quiet"].includes(tag.toLowerCase())));
    const recs = await Promise.all(places.map((place) => this.scorePlace(place, { tags: ["hidden gems", "local"] })));
    return sortRecommendations(
      recs.map((rec) => ({
        ...rec,
        reasons: [reason("Hidden gem signal from local curation.", "hidden_gem", 10), ...rec.reasons],
        score: rec.score + 10,
      })),
      limit,
    );
  },

  async recommendArticlesByTags(tags: string[], limit = 4): Promise<Recommendation<Article>[]> {
    const articles = await getPublishedArticles();
    const recs = await Promise.all(articles.map((article) => this.scoreArticle(article, { tags })));
    return sortRecommendations(recs, limit);
  },

  async recommendCollectionsByTags(tags: string[], limit = 4): Promise<Recommendation<Collection>[]> {
    const collections = (await getCollections()).filter((collection) => collection.status === "published");
    const recs = await Promise.all(collections.map((collection) => this.scoreCollection(collection, { tags })));
    return sortRecommendations(recs, limit);
  },

  async recommendDealsByTags(tags: string[], limit = 4): Promise<Recommendation<Deal>[]> {
    const deals = await getPublishedDeals();
    const recs = await Promise.all(deals.map((deal) => this.scoreDeal(deal, { tags })));
    return sortRecommendations(recs, limit);
  },

  async recommendEventsByTags(tags: string[], limit = 4): Promise<Recommendation<Event>[]> {
    const events = await getPublishedEvents();
    const recs = await Promise.all(events.map((event) => this.scoreEvent(event, { tags })));
    return sortRecommendations(recs, limit);
  },

  async recommendByMood(mood: PlaceMood, limit = 6): Promise<Recommendation<Place>[]> {
    const places = (await getPlaces()).filter((place) => place.status === "published");
    const recs = await Promise.all(places.map((place) => this.scorePlace(place, { moods: [mood], tags: [mood] })));
    return sortRecommendations(recs, limit);
  },

  async recommendByVisitLength(visitLength: VisitLength, limit = 6): Promise<Recommendation<Place>[]> {
    const places = (await getPlaces()).filter((place) => place.status === "published");
    const recs = await Promise.all(places.map((place) => this.scorePlace(place, { visitLength })));
    return sortRecommendations(recs, limit);
  },

  async recommendByEnergy(energyLevel: EnergyLevel, limit = 6): Promise<Recommendation<Place>[]> {
    const places = (await getPlaces()).filter((place) => place.status === "published");
    const recs = await Promise.all(places.map((place) => this.scorePlace(place, { energyLevel })));
    return sortRecommendations(recs, limit);
  },

  async recommendRainyDay(limit = 6): Promise<Recommendation<Place>[]> {
    const recs = await this.recommendByMood("rainy_day", limit);
    return recs.map((rec) => ({
      ...rec,
      reasons: [reason("Reliable rainy day fallback.", "weather", 10), ...rec.reasons],
      score: rec.score + 10,
    }));
  },

  async recommendDogFriendly(limit = 6): Promise<Recommendation<Place>[]> {
    const recs = await this.recommendByMood("dogs", limit);
    return recs.map((rec) => ({
      ...rec,
      reasons: [reason("Dog-friendly profile from Place DNA.", "dna_mood", 10), ...rec.reasons],
      score: rec.score + 10,
    }));
  },

  async recommendScenic(limit = 6): Promise<Recommendation<Place>[]> {
    const recs = await this.recommendByMood("scenic", limit);
    return recs.map((rec) => ({
      ...rec,
      reasons: [reason("Scenic route profile from Place DNA.", "dna_mood", 10), ...rec.reasons],
      score: rec.score + 10,
    }));
  },

  async getMoodOptions(): Promise<PlaceMood[]> {
    const allDNA = await getAllPlaceDNA();
    const moods = new Set<PlaceMood>();
    allDNA.forEach((entry) => entry.moods.forEach((mood) => moods.add(mood)));
    return Array.from(moods.values());
  },
};

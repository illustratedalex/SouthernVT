import { mockExplorerResults } from "@/data/explorer";
import { DiscoveryService } from "@/lib/discovery/DiscoveryService";
import { recommendConnections } from "@/lib/repositories/KnowledgeGraphRepository";
import { getPlaceDNA } from "@/lib/repositories/PlaceDNARepository";
import { getCollectionById } from "@/lib/repositories/collectionRepository";
import { getArticleById } from "@/repositories/ArticleRepository";
import { getDealById } from "@/repositories/DealRepository";
import { getEventById } from "@/repositories/EventRepository";
import { getPlaceById } from "@/repositories/PlaceRepository";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { ExplorerMood, ExplorerResult } from "@/types/Explorer";
import type { Place } from "@/types/Place";

function graphIdByType(nodeIds: string[], type: string): string | null {
  const match = nodeIds.find((nodeId) => nodeId.startsWith(`${type}:`));
  if (!match) {
    return null;
  }
  return match.split(":")[1] ?? null;
}

export type ExplorerResultDetails = {
  result: ExplorerResult;
  primaryPlace: Place | null;
  foodPlace: Place | null;
  collection: Collection | null;
  article: Article | null;
  deal: Deal | null;
  event: Event | null;
};

export const ExplorerService = {
  getExplorerResults(): ExplorerResult[] {
    return [...mockExplorerResults];
  },

  getExplorerResultByMood(mood: ExplorerMood): ExplorerResult | null {
    const matches = mockExplorerResults.filter((result) => result.mood === mood);
    if (!matches.length) {
      return null;
    }

    return matches[Math.floor(Math.random() * matches.length)] ?? null;
  },

  getRandomExplorerResult(): ExplorerResult | null {
    if (!mockExplorerResults.length) {
      return null;
    }

    return mockExplorerResults[Math.floor(Math.random() * mockExplorerResults.length)] ?? null;
  },

  async buildExplorerResultDetails(result: ExplorerResult): Promise<ExplorerResultDetails> {
    const [primaryPlace, foodPlace, collection, article, deal, event] = await Promise.all([
      getPlaceById(result.primaryPlaceId),
      result.foodPlaceId ? getPlaceById(result.foodPlaceId) : Promise.resolve(null),
      result.collectionId ? getCollectionById(result.collectionId) : Promise.resolve(null),
      result.articleId ? getArticleById(result.articleId) : Promise.resolve(null),
      result.dealId ? getDealById(result.dealId) : Promise.resolve(null),
      result.eventId ? getEventById(result.eventId) : Promise.resolve(null),
    ]);

    const primaryDNA = primaryPlace ? await getPlaceDNA(primaryPlace.id) : null;
    const graphRecommendations = primaryPlace ? await recommendConnections(`place:${primaryPlace.id}`, 8) : [];
    const graphRecommendationIds = graphRecommendations.map((node) => node.id);

    const [graphFoodPlace, graphCollection, graphArticle, graphDeal, graphEvent] = await Promise.all([
      graphIdByType(graphRecommendationIds, "place") ? getPlaceById(graphIdByType(graphRecommendationIds, "place") as string) : Promise.resolve(null),
      graphIdByType(graphRecommendationIds, "collection") ? getCollectionById(graphIdByType(graphRecommendationIds, "collection") as string) : Promise.resolve(null),
      graphIdByType(graphRecommendationIds, "article") ? getArticleById(graphIdByType(graphRecommendationIds, "article") as string) : Promise.resolve(null),
      graphIdByType(graphRecommendationIds, "deal") ? getDealById(graphIdByType(graphRecommendationIds, "deal") as string) : Promise.resolve(null),
      graphIdByType(graphRecommendationIds, "event") ? getEventById(graphIdByType(graphRecommendationIds, "event") as string) : Promise.resolve(null),
    ]);

    const [fallbackCollections, fallbackArticles, fallbackDeals, fallbackEvents] = primaryPlace
      ? await Promise.all([
          DiscoveryService.getRecommendedCollections({ placeId: primaryPlace.id, limit: 1 }),
          DiscoveryService.getRecommendedArticles({ placeId: primaryPlace.id, limit: 1 }),
          DiscoveryService.getRecommendedDeals({ placeId: primaryPlace.id, limit: 1 }),
          DiscoveryService.getRecommendedEvents({ placeId: primaryPlace.id, limit: 1 }),
        ])
      : [[], [], [], []];

    return {
      result: primaryDNA && !primaryDNA.moods.includes(result.mood)
        ? { ...result, mood: primaryDNA.moods[0] as ExplorerMood }
        : result,
      primaryPlace,
      foodPlace: foodPlace ?? graphFoodPlace,
      collection: collection ?? graphCollection ?? fallbackCollections[0] ?? null,
      article: article ?? graphArticle ?? fallbackArticles[0] ?? null,
      deal: deal ?? graphDeal ?? fallbackDeals[0] ?? null,
      event: event ?? graphEvent ?? fallbackEvents[0] ?? null,
    };
  },
};

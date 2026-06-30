import { mockRelationships } from "@/data/relationships";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getPublishedArticles } from "@/repositories/ArticleRepository";
import { getPublishedDeals } from "@/repositories/DealRepository";
import { getPublishedEvents } from "@/repositories/EventRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";

type PlaceScopedOptions = {
  placeId?: string;
  collectionId?: string;
  articleId?: string;
  limit?: number;
};

export type NextAdventure = {
  place: Place | null;
  collection: Collection | null;
  article: Article | null;
  deal: Deal | null;
  event: Event | null;
};

type GraphType = "place" | "collection" | "article" | "event" | "deal";

type Scored<T> = {
  item: T;
  score: number;
};

function overlapCount(a: string[], b: string[]): number {
  const bSet = new Set(b.map((value) => value.toLowerCase()));
  return a.reduce((count, value) => (bSet.has(value.toLowerCase()) ? count + 1 : count), 0);
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

function graphBoost(fromType: GraphType, fromId: string, toType: GraphType, toId: string): number {
  return mockRelationships.reduce((score, relationship) => {
    const directMatch =
      relationship.fromType === fromType &&
      relationship.fromId === fromId &&
      relationship.toType === toType &&
      relationship.toId === toId;

    const reverseMatch =
      relationship.toType === fromType &&
      relationship.toId === fromId &&
      relationship.fromType === toType &&
      relationship.fromId === toId;

    if (!directMatch && !reverseMatch) {
      return score;
    }

    switch (relationship.relationshipType) {
      case "nearby":
        return score + 24;
      case "contains":
      case "featured_in":
        return score + 20;
      case "related":
      case "hosts_event":
      case "has_deal":
        return score + 16;
      default:
        return score + 10;
    }
  }, 0);
}

function sortScored<T>(entries: Array<Scored<T>>, limit: number): T[] {
  return entries
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

async function loadPublishedCollections(): Promise<Collection[]> {
  const collections = await getCollections();
  return collections.filter((collection) => collection.status === "published");
}

async function resolveAnchorPlace(options: PlaceScopedOptions): Promise<Place | null> {
  const places = await getPlaces();

  if (options.placeId) {
    return places.find((place) => place.id === options.placeId) ?? null;
  }

  if (options.collectionId) {
    const collections = await loadPublishedCollections();
    const collection = collections.find((item) => item.id === options.collectionId);
    if (!collection) {
      return null;
    }

    return places.find((place) => collection.places.includes(place.id)) ?? null;
  }

  if (options.articleId) {
    const articles = await getPublishedArticles();
    const article = articles.find((item) => item.id === options.articleId);
    if (!article) {
      return null;
    }

    return places.find((place) => article.relatedPlaces.includes(place.id)) ?? null;
  }

  return null;
}

export const DiscoveryService = {
  async getNearbyPlaces(placeId: string, limit = 4): Promise<Place[]> {
    const places = (await getPlaces()).filter((place) => place.status === "published");
    const collections = await loadPublishedCollections();
    const anchor = places.find((place) => place.id === placeId);

    if (!anchor) {
      return places.filter((place) => place.id !== placeId).slice(0, limit);
    }

    const anchorCollections = collections.filter((collection) => collection.places.includes(anchor.id));

    const scored = places
      .filter((candidate) => candidate.id !== anchor.id)
      .map((candidate) => {
        const miles = distanceMiles(anchor.latitude, anchor.longitude, candidate.latitude, candidate.longitude);
        const distanceScore = Math.max(0, 40 - Math.min(40, miles));
        const tagScore = overlapCount(anchor.tags, candidate.tags) * 7;
        const categoryScore = overlapCount(anchor.categories, candidate.categories) * 5;
        const relationshipScore = graphBoost("place", anchor.id, "place", candidate.id);
        const featuredScore = candidate.featured ? 6 : 0;
        const collectionScore = anchorCollections.filter((collection) => collection.places.includes(candidate.id)).length * 10;

        return {
          item: candidate,
          score: distanceScore + tagScore + categoryScore + relationshipScore + featuredScore + collectionScore,
        };
      });

    return sortScored(scored, limit);
  },

  async getRelatedPlaces(options: PlaceScopedOptions): Promise<Place[]> {
    const limit = options.limit ?? 4;
    const [places, collections, articles] = await Promise.all([getPlaces(), loadPublishedCollections(), getPublishedArticles()]);

    const anchor = await resolveAnchorPlace(options);

    if (!anchor) {
      return places.filter((place) => place.status === "published").slice(0, limit);
    }

    const anchorCollections = collections.filter((collection) => collection.places.includes(anchor.id));
    const anchorArticles = articles.filter((article) => article.relatedPlaces.includes(anchor.id));

    const scored = places
      .filter((candidate) => candidate.status === "published" && candidate.id !== anchor.id)
      .map((candidate) => {
        const tagScore = overlapCount(anchor.tags, candidate.tags) * 9;
        const categoryScore = overlapCount(anchor.categories, candidate.categories) * 6;
        const relationshipScore = graphBoost("place", anchor.id, "place", candidate.id);
        const sharedCollectionScore = anchorCollections.filter((collection) => collection.places.includes(candidate.id)).length * 12;
        const sharedArticleScore = anchorArticles.filter((article) => article.relatedPlaces.includes(candidate.id)).length * 8;
        const featuredScore = candidate.featured ? 5 : 0;

        return {
          item: candidate,
          score: tagScore + categoryScore + relationshipScore + sharedCollectionScore + sharedArticleScore + featuredScore,
        };
      });

    return sortScored(scored, limit);
  },

  async getRecommendedCollections(options: PlaceScopedOptions): Promise<Collection[]> {
    const limit = options.limit ?? 4;
    const [collections, articles] = await Promise.all([loadPublishedCollections(), getPublishedArticles()]);
    const anchor = await resolveAnchorPlace(options);

    const anchorCollection = options.collectionId ? collections.find((collection) => collection.id === options.collectionId) ?? null : null;
    const anchorArticle = options.articleId ? articles.find((article) => article.id === options.articleId) ?? null : null;

    const scored = collections
      .filter((collection) => collection.id !== options.collectionId)
      .map((collection) => {
        let score = 0;

        if (anchor) {
          score += collection.places.includes(anchor.id) ? 24 : 0;
          score += overlapCount(anchor.tags, collection.tags) * 8;
          score += graphBoost("place", anchor.id, "collection", collection.id);
        }

        if (anchorCollection) {
          score += overlapCount(anchorCollection.tags, collection.tags) * 8;
          score += collection.season === anchorCollection.season ? 8 : 0;
          score += collection.audience === anchorCollection.audience ? 6 : 0;
          score += graphBoost("collection", anchorCollection.id, "collection", collection.id);
        }

        if (anchorArticle) {
          score += anchorArticle.relatedCollections.includes(collection.id) ? 20 : 0;
          score += overlapCount(anchorArticle.tags, collection.tags) * 6;
          score += graphBoost("article", anchorArticle.id, "collection", collection.id);
        }

        score += collection.featured ? 6 : 0;

        return { item: collection, score };
      });

    return sortScored(scored, limit);
  },

  async getRecommendedArticles(options: PlaceScopedOptions): Promise<Article[]> {
    const limit = options.limit ?? 4;
    const articles = await getPublishedArticles();
    const anchor = await resolveAnchorPlace(options);

    const anchorArticle = options.articleId ? articles.find((article) => article.id === options.articleId) ?? null : null;

    const scored = articles
      .filter((article) => article.id !== options.articleId)
      .map((article) => {
        let score = 0;

        if (anchor) {
          score += article.relatedPlaces.includes(anchor.id) ? 25 : 0;
          score += overlapCount(anchor.tags, article.tags) * 8;
          score += graphBoost("place", anchor.id, "article", article.id);
        }

        if (options.collectionId) {
          score += article.relatedCollections.includes(options.collectionId) ? 20 : 0;
        }

        if (anchorArticle) {
          score += overlapCount(anchorArticle.tags, article.tags) * 6;
          score += overlapCount(anchorArticle.categories, article.categories) * 4;
          score += graphBoost("article", anchorArticle.id, "article", article.id);
        }

        score += article.featured ? 7 : 0;

        return { item: article, score };
      });

    return sortScored(scored, limit);
  },

  async getRecommendedDeals(options: PlaceScopedOptions): Promise<Deal[]> {
    const limit = options.limit ?? 4;
    const [deals, collections] = await Promise.all([getPublishedDeals(), loadPublishedCollections()]);
    const anchor = await resolveAnchorPlace(options);

    const anchorCollection = options.collectionId ? collections.find((collection) => collection.id === options.collectionId) ?? null : null;

    const scored = deals.map((deal) => {
      let score = 0;

      if (anchor) {
        score += deal.placeId === anchor.id ? 28 : 0;
        score += overlapCount(anchor.tags, deal.tags) * 8;
        score += overlapCount(anchor.categories, deal.categories) * 5;
        score += graphBoost("place", anchor.id, "deal", deal.id);
      }

      if (anchorCollection) {
        score += deal.collectionId === anchorCollection.id ? 22 : 0;
        score += overlapCount(anchorCollection.tags, deal.tags) * 5;
        score += graphBoost("collection", anchorCollection.id, "deal", deal.id);
      }

      if (options.articleId) {
        score += graphBoost("article", options.articleId, "deal", deal.id);
      }

      score += deal.featured ? 7 : 0;

      return { item: deal, score };
    });

    return sortScored(scored, limit);
  },

  async getRecommendedEvents(options: PlaceScopedOptions): Promise<Event[]> {
    const limit = options.limit ?? 4;
    const events = await getPublishedEvents();
    const anchor = await resolveAnchorPlace(options);

    const scored = events.map((event) => {
      let score = 0;

      if (anchor) {
        const miles = distanceMiles(anchor.latitude, anchor.longitude, event.latitude, event.longitude);
        score += Math.max(0, 34 - Math.min(34, miles));
        score += event.venuePlaceId === anchor.id ? 20 : 0;
        score += event.city === anchor.city ? 8 : 0;
        score += overlapCount(anchor.tags, event.tags) * 6;
        score += graphBoost("place", anchor.id, "event", event.id);
      }

      if (options.articleId) {
        score += graphBoost("article", options.articleId, "event", event.id);
      }

      score += event.featured ? 6 : 0;

      return { item: event, score };
    });

    return sortScored(scored, limit);
  },

  async getNextAdventure(seedPlaceId?: string): Promise<NextAdventure> {
    const places = (await getPlaces()).filter((place) => place.status === "published");
    const seed = seedPlaceId ? places.find((place) => place.id === seedPlaceId) ?? null : places.find((place) => place.featured) ?? places[0] ?? null;

    if (!seed) {
      return {
        place: null,
        collection: null,
        article: null,
        deal: null,
        event: null,
      };
    }

    const [collections, articles, deals, events] = await Promise.all([
      this.getRecommendedCollections({ placeId: seed.id, limit: 1 }),
      this.getRecommendedArticles({ placeId: seed.id, limit: 1 }),
      this.getRecommendedDeals({ placeId: seed.id, limit: 1 }),
      this.getRecommendedEvents({ placeId: seed.id, limit: 1 }),
    ]);

    return {
      place: seed,
      collection: collections[0] ?? null,
      article: articles[0] ?? null,
      deal: deals[0] ?? null,
      event: events[0] ?? null,
    };
  },
};

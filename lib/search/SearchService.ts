import { getCollections } from "@/lib/repositories/collectionRepository";
import { basicBusinessListings } from "@/data/basicBusinessListings";
import { getArticles } from "@/repositories/ArticleRepository";
import { getEvents } from "@/repositories/EventRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import type { GroupedSearchResults, SearchResult } from "@/types/Search";

let cachedIndexPromise: Promise<SearchResult[]> | null = null;

const stayCategories = new Set(["Lodging", "Campground", "Inn", "Motel", "Bed & Breakfast", "Cabin", "Vacation Rental", "Unique Stay", "Stays"]);

export async function getSearchIndex(): Promise<SearchResult[]> {
  if (!cachedIndexPromise) {
    cachedIndexPromise = buildSearchIndex();
  }

  return cachedIndexPromise;
}

export async function searchAll(query: string): Promise<GroupedSearchResults> {
  const index = await getSearchIndex();
  return filterAndGroupResults(query, index);
}

async function buildSearchIndex(): Promise<SearchResult[]> {
  const [places, collections, articles, events] = await Promise.all([
    getPlaces(),
    getCollections(),
    getArticles(),
    getEvents(),
  ]);

  const placeResults: SearchResult[] = places
    .filter((place) => place.status === "published")
    .map((place) => ({
      id: place.id,
      title: place.name,
      subtitle: `${place.placeType} · ${place.city}, ${place.state}`,
      type: "place",
      url: `/places/${place.slug}`,
      premium: Boolean(place.isPremium),
      keywords: [
        place.name,
        place.description,
        place.placeType,
        ...place.tags,
        ...place.categories,
      ],
    }));

  const collectionResults: SearchResult[] = collections
    .filter((collection) => collection.status === "published")
    .map((collection) => ({
      id: collection.id,
      title: collection.title,
      subtitle: `${collection.season} · ${collection.audience}`,
      type: "collection",
      url: `/collections/${collection.slug}`,
      keywords: [
        collection.title,
        collection.description,
        collection.subtitle,
        collection.season,
        collection.audience,
        ...collection.tags,
      ],
    }));

  const businessResults: SearchResult[] = basicBusinessListings.map((business) => ({
    id: business.id,
    title: business.name,
    subtitle: `${business.category} · ${business.town}, ${business.county}`,
    type: stayCategories.has(business.category) ? "stay" : "business",
    url: `/businesses/${business.slug}`,
    keywords: [
      business.name,
      business.category,
      business.town,
      business.county,
      business.description,
      "restaurant",
      "attraction",
      "stay",
      "lodging",
    ],
  }));

  const guideResults: SearchResult[] = articles
    .filter((article) => article.status === "published")
    .map((article) => ({
      id: article.id,
      title: article.title,
      subtitle: `${article.articleType} guide · ${article.author}`,
      type: "guide",
      url: `/guides/${article.slug}`,
      keywords: [
        article.title,
        article.subtitle,
        article.excerpt,
        article.articleType,
        ...article.tags,
        ...article.categories,
      ],
    }));

  const eventResults: SearchResult[] = events
    .filter((event) => event.status === "published" || event.status === "scheduled")
    .map((event) => ({
      id: event.id,
      title: event.title,
      subtitle: `${event.city}, ${event.state} · ${event.eventType}`,
      type: "event",
      url: `/events/${event.slug}`,
      keywords: [
        event.title,
        event.description,
        event.eventType,
        event.city,
        ...event.tags,
        ...event.categories,
      ],
    }));

  return [...placeResults, ...businessResults, ...guideResults, ...collectionResults, ...eventResults];
}

function filterAndGroupResults(query: string, index: SearchResult[]): GroupedSearchResults {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return {
      places: [],
      businesses: [],
      stays: [],
      guides: [],
      collections: [],
      events: [],
    };
  }

  const ranked = index
    .map((item) => ({ item, score: getScore(trimmed, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  return {
    places: ranked.filter((item) => item.type === "place").slice(0, 6),
    businesses: ranked.filter((item) => item.type === "business").slice(0, 6),
    stays: ranked.filter((item) => item.type === "stay").slice(0, 6),
    guides: ranked.filter((item) => item.type === "guide").slice(0, 6),
    collections: ranked.filter((item) => item.type === "collection").slice(0, 6),
    events: ranked.filter((item) => item.type === "event").slice(0, 6),
  };
}

function getScore(query: string, item: SearchResult) {
  const title = item.title.toLowerCase();
  const subtitle = item.subtitle.toLowerCase();
  const keywordText = item.keywords.join(" ").toLowerCase();

  let score = 0;
  if (title === query) score += 20;
  if (title.startsWith(query)) score += 12;
  if (title.includes(query)) score += 8;
  if (subtitle.includes(query)) score += 4;
  if (keywordText.includes(query)) score += 3;

  for (const token of query.split(/\s+/).filter(Boolean)) {
    if (title.includes(token)) score += 2;
    if (keywordText.includes(token)) score += 1;
  }

  // Premium gets a small weighted boost, but does not dominate relevance.
  if (item.premium && score > 0) score += 2;

  return score;
}

import { mockCollections } from "@/data/collections";
import { mockEvents } from "@/data/events";
import { mockArticles } from "@/data/articles";
import businesses from "@/data/businesses.json";
import { mockPlaces } from "@/data/places";

export type GlobalSearchType = "place" | "collection" | "article" | "event" | "deal";

export interface GlobalSearchItem {
  id: string;
  type: GlobalSearchType;
  title: string;
  description: string;
  href: string;
  keywords: string[];
}

export function buildGlobalSearchIndex(): GlobalSearchItem[] {
  const placeItems: GlobalSearchItem[] = mockPlaces
    .filter((place) => place.status === "published")
    .map((place) => ({
      id: place.id,
      type: "place",
      title: place.name,
      description: `${place.placeType} · ${place.city}, ${place.state}`,
      href: `/places/${place.slug}`,
      keywords: [place.placeType, place.city, ...place.categories, ...place.tags],
    }));

  const collectionItems: GlobalSearchItem[] = mockCollections
    .filter((collection) => collection.status === "published")
    .map((collection) => ({
      id: collection.id,
      type: "collection",
      title: collection.title,
      description: `${collection.season} · ${collection.audience}`,
      href: `/collections/${collection.slug}`,
      keywords: [collection.season, collection.audience, ...collection.tags],
    }));

  const articleItems: GlobalSearchItem[] = mockArticles
    .filter((article) => article.status === "published")
    .map((article) => ({
    id: article.id,
    type: "article",
    title: article.title,
    description: `${article.articleType} · ${article.author}`,
    href: `/guides/${article.slug}`,
    keywords: [article.articleType, ...article.categories, ...article.tags],
  }));

  const eventItems: GlobalSearchItem[] = mockEvents.map((event) => ({
    id: event.id,
    type: "event",
    title: event.title,
    description: `${event.city}, ${event.state} · ${event.address}`,
    href: `/events/${event.slug}`,
    keywords: [event.eventType, event.city, ...event.tags],
  }));

  const dealItems: GlobalSearchItem[] = businesses.map((business) => ({
    id: `deal-${business.id}`,
    type: "deal",
    title: business.name,
    description: `Partner deal · ${business.city}, ${business.state}`,
    href: "/#deals",
    keywords: [...business.tags, business.category, business.city],
  }));

  return [...placeItems, ...collectionItems, ...articleItems, ...eventItems, ...dealItems];
}

export function runGlobalSearch(query: string, index: GlobalSearchItem[]) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return [];
  }

  return index
    .map((item) => {
      const haystack = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase();
      let score = 0;

      if (item.title.toLowerCase().startsWith(trimmed)) {
        score += 6;
      }
      if (item.title.toLowerCase().includes(trimmed)) {
        score += 4;
      }
      if (haystack.includes(trimmed)) {
        score += 2;
      }

      const tokens = trimmed.split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        if (haystack.includes(token)) {
          score += 1;
        }
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 24)
    .map((entry) => entry.item);
}

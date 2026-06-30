import { getCollections } from "@/lib/repositories/collectionRepository";
import { getMediaAssets } from "@/lib/repositories/mediaRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import type { GroupedSearchResults, SearchResult } from "@/types/Search";

let cachedIndexPromise: Promise<SearchResult[]> | null = null;

const basecampActions: SearchResult[] = [
  {
    id: "basecamp-dashboard",
    title: "Open Basecamp Dashboard",
    subtitle: "Jump to content operations home",
    type: "basecamp",
    url: "/basecamp",
    keywords: ["dashboard", "basecamp", "overview"],
  },
  {
    id: "basecamp-new-place",
    title: "Create New Place",
    subtitle: "Add a new place entry",
    type: "basecamp",
    url: "/basecamp/places/new",
    keywords: ["new", "place", "create", "basecamp"],
  },
  {
    id: "basecamp-new-collection",
    title: "Create New Collection",
    subtitle: "Build a curated guide",
    type: "basecamp",
    url: "/basecamp/collections/new",
    keywords: ["new", "collection", "guide", "basecamp"],
  },
  {
    id: "basecamp-media-library",
    title: "Open Media Library",
    subtitle: "Manage uploaded media assets",
    type: "basecamp",
    url: "/basecamp/media",
    keywords: ["media", "assets", "library", "basecamp"],
  },
];

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
  const [places, collections, media] = await Promise.all([getPlaces(), getCollections(), getMediaAssets()]);

  const placeResults: SearchResult[] = places
    .filter((place) => place.status === "published")
    .map((place) => ({
      id: place.id,
      title: place.name,
      subtitle: `${place.placeType} · ${place.city}, ${place.state}`,
      type: "place",
      url: `/places/${place.slug}`,
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

  const mediaResults: SearchResult[] = media.map((asset) => ({
    id: asset.id,
    title: asset.title,
    subtitle: `Media · ${asset.type}`,
    type: "media",
    url: "/basecamp/media",
    keywords: [asset.title, asset.altText, asset.type, ...asset.tags],
  }));

  return [...placeResults, ...collectionResults, ...mediaResults, ...basecampActions];
}

function filterAndGroupResults(query: string, index: SearchResult[]): GroupedSearchResults {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return {
      places: [],
      collections: [],
      media: [],
      basecamp: basecampActions,
    };
  }

  const ranked = index
    .map((item) => ({ item, score: getScore(trimmed, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  return {
    places: ranked.filter((item) => item.type === "place").slice(0, 6),
    collections: ranked.filter((item) => item.type === "collection").slice(0, 6),
    media: ranked.filter((item) => item.type === "media").slice(0, 6),
    basecamp: ranked.filter((item) => item.type === "basecamp").slice(0, 6),
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

  return score;
}

import type { MetadataRoute } from "next";
import { getBusinessListings } from "@/lib/businessListings";
import { getPublishedArticles } from "@/repositories/ArticleRepository";
import { getPublishedDeals } from "@/repositories/DealRepository";
import { getPublishedEvents } from "@/repositories/EventRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businessListings = getBusinessListings();
  const [places, collections, events, articles, deals] = await Promise.all([
    getPlaces(),
    getCollections(),
    getPublishedEvents(),
    getPublishedArticles(),
    getPublishedDeals(),
  ]);

  const publishedPlaces = places.filter((place) => place.status === "published");
  const publishedCollections = collections.filter((collection) => collection.status === "published");

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/places"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/businesses"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/collections"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/events"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/deals"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/passport"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/partner-portal"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const placeEntries: MetadataRoute.Sitemap = publishedPlaces.map((place) => ({
    url: absoluteUrl(`/places/${place.slug}`),
    lastModified: new Date(place.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const businessEntries: MetadataRoute.Sitemap = businessListings.map((listing) => ({
    url: absoluteUrl(`/businesses/${listing.slug}`),
    lastModified: new Date(listing.updatedAt),
    changeFrequency: "weekly",
    priority: 0.72,
  }));

  const collectionEntries: MetadataRoute.Sitemap = publishedCollections.map((collection) => ({
    url: absoluteUrl(`/collections/${collection.slug}`),
    lastModified: new Date(collection.updatedAt),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: absoluteUrl(`/events/${event.slug}`),
    lastModified: new Date(event.updatedAt),
    changeFrequency: "daily",
    priority: 0.75,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/guides/${article.slug}`),
    lastModified: new Date(article.updatedAt),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const dealEntries: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: absoluteUrl(`/deals/${deal.slug}`),
    lastModified: new Date(deal.updatedAt),
    changeFrequency: "daily",
    priority: 0.75,
  }));

  return [...staticEntries, ...placeEntries, ...businessEntries, ...collectionEntries, ...eventEntries, ...articleEntries, ...dealEntries];
}

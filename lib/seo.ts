import type { Metadata } from "next";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";

const DEFAULT_SITE_URL = "https://southernvt.com";
const SITE_NAME = "SouthernVT";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSiteUrl() {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL);
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

type BaseMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
};

export function createPageMetadata({ title, description, path, image, type = "website" }: BaseMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const images = image ? [image] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export function createPlaceMetadata(place: Place): Metadata {
  return createPageMetadata({
    title: place.seoTitle || `${place.name} | SouthernVT`,
    description: place.seoDescription || place.description,
    path: `/places/${place.slug}`,
    image: place.featuredImage,
    type: "article",
  });
}

export function createCollectionMetadata(collection: Collection): Metadata {
  return createPageMetadata({
    title: collection.seoTitle || `${collection.title} | SouthernVT`,
    description: collection.seoDescription || collection.description,
    path: `/collections/${collection.slug}`,
    image: collection.featuredImage,
    type: "article",
  });
}

export function createEventMetadata(event: Event): Metadata {
  return createPageMetadata({
    title: event.seoTitle || `${event.title} | SouthernVT`,
    description: event.seoDescription || event.description,
    path: `/events/${event.slug}`,
    image: event.featuredImage,
    type: "article",
  });
}

export function createArticleMetadata(article: Article): Metadata {
  return createPageMetadata({
    title: article.seoTitle || `${article.title} | SouthernVT`,
    description: article.seoDescription || article.excerpt,
    path: `/guides/${article.slug}`,
    image: article.featuredImage,
    type: "article",
  });
}

export function createDealMetadata(deal: Deal): Metadata {
  return createPageMetadata({
    title: deal.seoTitle || `${deal.title} | SouthernVT Deals`,
    description: deal.seoDescription || deal.shortDescription,
    path: `/deals/${deal.slug}`,
    image: deal.featuredImage,
    type: "article",
  });
}

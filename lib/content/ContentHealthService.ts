import { calculatePlaceCompleteness } from "@/lib/completeness/placeCompleteness";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { ContentHealth, ContentHealthPriority, ContentHealthType } from "@/types/ContentHealth";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { Story } from "@/types/Story";

type ContentEntity = Place | Collection | Article | Event | Deal;

type HealthContext = {
  story?: Story | null;
  inCollectionCount?: number;
  relatedArticleCount?: number;
  relatedEventCount?: number;
  relatedDealCount?: number;
};

export type HealthSnapshot = ContentHealth & {
  launchReadiness: number;
  photographyScore: number;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasText(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0);
}

function scoreFromChecks(checks: boolean[]): number {
  if (!checks.length) {
    return 0;
  }
  const complete = checks.filter(Boolean).length;
  return clampScore((complete / checks.length) * 100);
}

function parseDateSafe(dateValue: string | undefined): Date {
  if (!dateValue) {
    return new Date();
  }
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function addDays(value: Date, days: number): Date {
  const result = new Date(value);
  result.setDate(result.getDate() + days);
  return result;
}

function getReviewIntervalDays(priority: ContentHealthPriority): number {
  if (priority === "critical") {
    return 3;
  }
  if (priority === "high") {
    return 7;
  }
  if (priority === "medium") {
    return 14;
  }
  return 30;
}

function getPriority(score: number): ContentHealthPriority {
  if (score < 45) {
    return "critical";
  }
  if (score < 60) {
    return "high";
  }
  if (score < 80) {
    return "medium";
  }
  return "low";
}

function calculateCollectionCompleteness(collection: Collection): number {
  return scoreFromChecks([
    hasText(collection.title),
    hasText(collection.subtitle),
    hasText(collection.description),
    hasText(collection.featuredImage),
    collection.gallery.length >= 1,
    collection.places.length >= 3,
    collection.tags.length >= 2,
    hasText(collection.seoTitle),
    hasText(collection.seoDescription),
  ]);
}

function calculateArticleCompleteness(article: Article): number {
  return scoreFromChecks([
    hasText(article.title),
    hasText(article.subtitle),
    hasText(article.excerpt),
    hasText(article.body),
    hasText(article.featuredImage),
    article.relatedPlaces.length > 0,
    article.categories.length > 0,
    article.tags.length > 0,
    hasText(article.seoTitle),
    hasText(article.seoDescription),
  ]);
}

function calculateEventCompleteness(event: Event): number {
  return scoreFromChecks([
    hasText(event.title),
    hasText(event.description),
    hasText(event.startDate),
    hasText(event.endDate),
    hasText(event.startTime),
    hasText(event.endTime),
    hasText(event.venuePlaceId),
    hasText(event.featuredImage),
    hasText(event.organizerName),
    hasText(event.organizerEmail),
    event.categories.length > 0,
    event.tags.length > 0,
    hasText(event.seoTitle),
    hasText(event.seoDescription),
  ]);
}

function calculateDealCompleteness(deal: Deal): number {
  return scoreFromChecks([
    hasText(deal.title),
    hasText(deal.description),
    hasText(deal.shortDescription),
    hasText(deal.placeId),
    hasText(deal.terms),
    hasText(deal.startDate),
    hasText(deal.endDate),
    hasText(deal.featuredImage),
    deal.categories.length > 0,
    deal.tags.length > 0,
    hasText(deal.seoTitle),
    hasText(deal.seoDescription),
  ]);
}

function calculateCompleteness(contentType: ContentHealthType, content: ContentEntity): number {
  if (contentType === "place") {
    return calculatePlaceCompleteness(content as Place).percentage;
  }
  if (contentType === "collection") {
    return calculateCollectionCompleteness(content as Collection);
  }
  if (contentType === "article") {
    return calculateArticleCompleteness(content as Article);
  }
  if (contentType === "event") {
    return calculateEventCompleteness(content as Event);
  }
  return calculateDealCompleteness(content as Deal);
}

export function calculateStoryScore(contentType: ContentHealthType, content: ContentEntity, story?: Story | null): number {
  if (contentType === "place" || contentType === "collection") {
    return scoreFromChecks([
      Boolean(story),
      hasText(story?.title),
      hasText(story?.summary),
      hasText(story?.body),
      (story?.visitorTips?.length ?? 0) >= 2,
      (story?.photographyTips?.length ?? 0) >= 1,
    ]);
  }

  if (contentType === "article") {
    const article = content as Article;
    return scoreFromChecks([
      hasText(article.excerpt),
      hasText(article.subtitle),
      article.body.trim().length >= 400,
      article.categories.length > 0,
      article.tags.length > 0,
    ]);
  }

  if (contentType === "event") {
    const event = content as Event;
    return scoreFromChecks([
      event.description.trim().length >= 120,
      hasText(event.organizerName),
      hasText(event.cost),
      event.tags.length > 0,
    ]);
  }

  const deal = content as Deal;
  return scoreFromChecks([
    deal.description.trim().length >= 120,
    deal.shortDescription.trim().length >= 40,
    hasText(deal.terms),
    deal.tags.length > 0,
  ]);
}

export function calculateSEOScore(contentType: ContentHealthType, content: ContentEntity): number {
  if (contentType === "place") {
    const place = content as Place;
    return scoreFromChecks([
      hasText(place.slug),
      hasText(place.seoTitle),
      place.seoTitle.trim().length >= 35,
      hasText(place.seoDescription),
      place.seoDescription.trim().length >= 110,
      place.tags.length >= 3,
      place.categories.length >= 1,
    ]);
  }

  if (contentType === "collection") {
    const collection = content as Collection;
    return scoreFromChecks([
      hasText(collection.slug),
      hasText(collection.seoTitle),
      collection.seoTitle.trim().length >= 35,
      hasText(collection.seoDescription),
      collection.seoDescription.trim().length >= 110,
      collection.tags.length >= 2,
    ]);
  }

  if (contentType === "article") {
    const article = content as Article;
    return scoreFromChecks([
      hasText(article.slug),
      hasText(article.seoTitle),
      article.seoTitle.trim().length >= 35,
      hasText(article.seoDescription),
      article.seoDescription.trim().length >= 110,
      article.tags.length >= 3,
      article.categories.length >= 1,
    ]);
  }

  if (contentType === "event") {
    const event = content as Event;
    return scoreFromChecks([
      hasText(event.slug),
      hasText(event.seoTitle),
      event.seoTitle.trim().length >= 35,
      hasText(event.seoDescription),
      event.seoDescription.trim().length >= 110,
      event.tags.length >= 2,
      event.categories.length >= 1,
    ]);
  }

  const deal = content as Deal;
  return scoreFromChecks([
    hasText(deal.slug),
    hasText(deal.seoTitle),
    deal.seoTitle.trim().length >= 35,
    hasText(deal.seoDescription),
    deal.seoDescription.trim().length >= 110,
    deal.tags.length >= 2,
    deal.categories.length >= 1,
  ]);
}

export function calculateDiscoveryScore(contentType: ContentHealthType, content: ContentEntity, context: HealthContext = {}): number {
  if (contentType === "place") {
    const place = content as Place;
    return scoreFromChecks([
      place.relatedPlaces.length >= 2,
      (context.inCollectionCount ?? 0) >= 1,
      (context.relatedArticleCount ?? 0) >= 1,
      (context.relatedEventCount ?? 0) >= 1,
      (context.relatedDealCount ?? 0) >= 1,
      place.tags.length >= 3,
    ]);
  }

  if (contentType === "collection") {
    const collection = content as Collection;
    return scoreFromChecks([
      collection.places.length >= 4,
      collection.tags.length >= 2,
      hasText(collection.season),
      hasText(collection.audience),
      Boolean(context.story),
    ]);
  }

  if (contentType === "article") {
    const article = content as Article;
    return scoreFromChecks([
      article.relatedPlaces.length >= 1,
      article.relatedCollections.length >= 1,
      article.relatedEvents.length >= 1,
      article.tags.length >= 3,
      article.categories.length >= 1,
    ]);
  }

  if (contentType === "event") {
    const event = content as Event;
    return scoreFromChecks([
      hasText(event.venuePlaceId),
      event.tags.length >= 2,
      event.categories.length >= 1,
      hasText(event.ticketUrl) || hasText(event.organizerWebsite),
    ]);
  }

  const deal = content as Deal;
  return scoreFromChecks([
    hasText(deal.placeId),
    hasText(deal.collectionId),
    deal.tags.length >= 2,
    deal.categories.length >= 1,
  ]);
}

export function calculatePhotographyScore(contentType: ContentHealthType, content: ContentEntity): number {
  if (contentType === "place") {
    const place = content as Place;
    return scoreFromChecks([
      hasText(place.featuredImage),
      place.gallery.length >= 4,
      place.gallery.length >= 8,
      place.amenities.some((item) => item.toLowerCase().includes("gps")),
    ]);
  }

  if (contentType === "collection") {
    const collection = content as Collection;
    return scoreFromChecks([
      hasText(collection.featuredImage),
      collection.gallery.length >= 3,
      collection.gallery.length >= 6,
    ]);
  }

  if (contentType === "article") {
    const article = content as Article;
    return scoreFromChecks([
      hasText(article.featuredImage),
      article.gallery.length >= 2,
      article.gallery.length >= 5,
    ]);
  }

  if (contentType === "event") {
    const event = content as Event;
    return scoreFromChecks([
      hasText(event.featuredImage),
      event.gallery.length >= 1,
      event.gallery.length >= 3,
    ]);
  }

  const mediaCarrier = content as Deal;
  return scoreFromChecks([
    hasText(mediaCarrier.featuredImage),
    mediaCarrier.tags.length >= 2,
    mediaCarrier.categories.length >= 1,
  ]);
}

export function calculateLaunchReadiness(health: {
  qualityScore: number;
  completenessScore: number;
  seoScore: number;
  storyScore: number;
  discoveryScore: number;
  photographyScore: number;
}): number {
  const score =
    health.completenessScore * 0.3 +
    health.qualityScore * 0.2 +
    health.seoScore * 0.15 +
    health.storyScore * 0.15 +
    health.discoveryScore * 0.1 +
    health.photographyScore * 0.1;

  return clampScore(score);
}

export function calculateHealth(contentType: ContentHealthType, content: ContentEntity, context: HealthContext = {}): HealthSnapshot {
  const completenessScore = calculateCompleteness(contentType, content);
  const storyScore = calculateStoryScore(contentType, content, context.story);
  const seoScore = calculateSEOScore(contentType, content);
  const discoveryScore = calculateDiscoveryScore(contentType, content, context);
  const photographyScore = calculatePhotographyScore(contentType, content);
  const qualityScore = clampScore(storyScore * 0.45 + seoScore * 0.3 + photographyScore * 0.25);
  const launchReadiness = calculateLaunchReadiness({
    qualityScore,
    completenessScore,
    seoScore,
    storyScore,
    discoveryScore,
    photographyScore,
  });
  const healthScore = clampScore((qualityScore + completenessScore + discoveryScore + launchReadiness) / 4);

  const priority = getPriority(healthScore);
  const updatedAt = "updatedAt" in content ? content.updatedAt : undefined;
  const lastReviewedDate = parseDateSafe(updatedAt);
  const nextReviewDate = addDays(lastReviewedDate, getReviewIntervalDays(priority));

  return {
    contentId: content.id,
    contentType,
    healthScore,
    qualityScore,
    completenessScore,
    seoScore,
    storyScore,
    discoveryScore,
    lastReviewed: lastReviewedDate.toISOString(),
    nextReview: nextReviewDate.toISOString(),
    priority,
    launchReadiness,
    photographyScore,
  };
}

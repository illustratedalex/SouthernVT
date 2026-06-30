import { mockArticles } from "@/data/articles";
import { mockCollections } from "@/data/collections";
import { mockDeals } from "@/data/deals";
import { mockEvents } from "@/data/events";
import { mediaAssets } from "@/data/media";
import { mockPlaces } from "@/data/places";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Relationship, RelationshipContentType, RelationshipType } from "@/types/Relationship";
import type { RelationshipInput } from "@/lib/repositories/relationshipRepository.mock";
import * as mockRepository from "@/lib/repositories/relationshipRepository.mock";
import * as supabaseRepository from "@/lib/repositories/relationshipRepository.supabase";

export interface ResolvedRelationshipItem {
  relationship: Relationship;
  item: {
    id: string;
    type: RelationshipContentType;
    title: string;
    subtitle: string;
    url: string;
  };
}

type RelationshipRepositoryModule = {
  getRelationshipsForContent: (contentType: RelationshipContentType, contentId: string) => Promise<Relationship[]>;
  getRelationshipsByType: (
    contentType: RelationshipContentType,
    contentId: string,
    relationshipType: RelationshipType,
  ) => Promise<Relationship[]>;
  createRelationship: (input: RelationshipInput) => Promise<Relationship>;
  updateRelationship: (id: string, updates: Partial<RelationshipInput>) => Promise<Relationship | null>;
  deleteRelationship: (id: string) => Promise<boolean>;
  getAllRelationships: () => Promise<Relationship[]>;
  getRelationshipById: (id: string) => Promise<Relationship | null>;
  archiveRelationship: (id: string) => Promise<Relationship | null>;
};

async function getActiveRelationshipRepository(): Promise<RelationshipRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

function resolveItem(type: RelationshipContentType, id: string) {
  if (type === "place") {
    const match = mockPlaces.find((place) => place.id === id);
    return match
      ? {
          id: match.id,
          type,
          title: match.name,
          subtitle: `${match.placeType} · ${match.city}`,
          url: `/places/${match.slug}`,
        }
      : null;
  }

  if (type === "collection") {
    const match = mockCollections.find((collection) => collection.id === id);
    return match
      ? {
          id: match.id,
          type,
          title: match.title,
          subtitle: `${match.season} · ${match.audience}`,
          url: `/collections/${match.slug}`,
        }
      : null;
  }

  if (type === "media") {
    const match = mediaAssets.find((asset) => asset.id === id);
    return match
      ? {
          id: match.id,
          type,
          title: match.title,
          subtitle: `Media · ${match.type}`,
          url: "/basecamp/media",
        }
      : null;
  }

  if (type === "article") {
    const match = mockArticles.find((article) => article.id === id);
    return match
      ? {
          id: match.id,
          type,
          title: match.title,
          subtitle: `${match.articleType} · ${match.author}`,
          url: `/guides/${match.slug}`,
        }
      : null;
  }

  if (type === "event") {
    const match = mockEvents.find((event) => event.id === id);
    return match
      ? {
          id: match.id,
          type,
          title: match.title,
          subtitle: `${match.city} · ${match.eventType}`,
          url: `/events/${match.slug}`,
        }
      : null;
  }

  if (type === "deal") {
    const match = mockDeals.find((deal) => deal.id === id);
    return match
      ? {
          id: match.id,
          type,
        title: match.title,
        subtitle: `${match.dealType} · Offer`,
        url: `/deals/${match.slug}`,
        }
      : null;
  }

  return null;
}

export async function getRelationshipsForContent(contentType: RelationshipContentType, contentId: string): Promise<Relationship[]> {
  const repository = await getActiveRelationshipRepository();
  return repository.getRelationshipsForContent(contentType, contentId);
}

export async function getRelationshipsByType(
  contentType: RelationshipContentType,
  contentId: string,
  relationshipType: RelationshipType,
): Promise<Relationship[]> {
  const repository = await getActiveRelationshipRepository();
  return repository.getRelationshipsByType(contentType, contentId, relationshipType);
}

export async function getRelatedItems(contentType: RelationshipContentType, contentId: string): Promise<ResolvedRelationshipItem[]> {
  const relationships = await getRelationshipsForContent(contentType, contentId);

  return relationships
    .map((relationship) => {
      const isSource = relationship.fromType === contentType && relationship.fromId === contentId;
      const targetType = isSource ? relationship.toType : relationship.fromType;
      const targetId = isSource ? relationship.toId : relationship.fromId;
      const item = resolveItem(targetType, targetId);

      if (!item) {
        return null;
      }

      return {
        relationship,
        item,
      };
    })
    .filter((entry): entry is ResolvedRelationshipItem => Boolean(entry));
}

export async function createRelationship(input: RelationshipInput): Promise<Relationship> {
  const repository = await getActiveRelationshipRepository();
  return repository.createRelationship(input);
}

export async function deleteRelationship(id: string): Promise<boolean> {
  const repository = await getActiveRelationshipRepository();
  return repository.deleteRelationship(id);
}

export async function getAllRelationships(): Promise<Relationship[]> {
  const repository = await getActiveRelationshipRepository();
  return repository.getAllRelationships();
}

export async function getRelationshipById(id: string): Promise<Relationship | null> {
  const repository = await getActiveRelationshipRepository();
  return repository.getRelationshipById(id);
}

export async function updateRelationship(id: string, updates: Partial<RelationshipInput>): Promise<Relationship | null> {
  const repository = await getActiveRelationshipRepository();
  return repository.updateRelationship(id, updates);
}

export async function archiveRelationship(id: string): Promise<Relationship | null> {
  const repository = await getActiveRelationshipRepository();
  return repository.archiveRelationship(id);
}

export const relationshipRepository = {
  getAll: getAllRelationships,
  getById: getRelationshipById,
  create: createRelationship,
  update: updateRelationship,
  archive: archiveRelationship,
  getRelationshipsForContent,
  getRelatedItems,
  getRelationshipsByType,
  createRelationship,
  deleteRelationship,
};

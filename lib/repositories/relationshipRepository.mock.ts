import { mockCollections } from "@/data/collections";
import { mockDeals } from "@/data/deals";
import { mediaAssets } from "@/data/media";
import { mockPlaces } from "@/data/places";
import { mockRelationships } from "@/data/relationships";
import type { Relationship, RelationshipContentType, RelationshipType } from "@/types/Relationship";

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

export type RelationshipInput = Omit<Relationship, "id" | "createdAt">;

let relationshipStore: Relationship[] = [...mockRelationships];

function createId() {
  return `rel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function resolveItem(type: RelationshipContentType, id: string) {
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

  return {
    id,
    type,
    title: "Related Content",
    subtitle: "Linked reference",
    url: "/collections",
  };
}

function sortRelationships(relationships: Relationship[]) {
  return [...relationships].sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));
}

export async function getRelationshipsForContent(contentType: RelationshipContentType, contentId: string): Promise<Relationship[]> {
  return sortRelationships(
    relationshipStore.filter(
      (relationship) =>
        (relationship.fromType === contentType && relationship.fromId === contentId) ||
        (relationship.toType === contentType && relationship.toId === contentId),
    ),
  );
}

export async function getRelationshipsByType(
  contentType: RelationshipContentType,
  contentId: string,
  relationshipType: RelationshipType,
): Promise<Relationship[]> {
  const all = await getRelationshipsForContent(contentType, contentId);
  return all.filter((relationship) => relationship.relationshipType === relationshipType);
}

export async function createRelationship(input: RelationshipInput): Promise<Relationship> {
  const created: Relationship = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString(),
  };

  relationshipStore = [...relationshipStore, created];
  return created;
}

export async function updateRelationship(id: string, updates: Partial<RelationshipInput>): Promise<Relationship | null> {
  const index = relationshipStore.findIndex((relationship) => relationship.id === id);
  if (index < 0) {
    return null;
  }

  const updated: Relationship = {
    ...relationshipStore[index],
    ...updates,
  };

  relationshipStore[index] = updated;
  return updated;
}

export async function deleteRelationship(id: string): Promise<boolean> {
  const existing = relationshipStore.find((relationship) => relationship.id === id) ?? null;
  relationshipStore = relationshipStore.filter((relationship) => relationship.id !== id);
  return Boolean(existing);
}

export async function getAllRelationships(): Promise<Relationship[]> {
  return sortRelationships(relationshipStore);
}

export async function getRelationshipById(id: string): Promise<Relationship | null> {
  return relationshipStore.find((relationship) => relationship.id === id) ?? null;
}

export async function archiveRelationship(id: string): Promise<Relationship | null> {
  const existing = await getRelationshipById(id);
  await deleteRelationship(id);
  return existing;
}

export const mockRelationshipRepository = {
  getRelationshipsForContent,
  getRelationshipsByType,
  createRelationship,
  updateRelationship,
  deleteRelationship,
  getAllRelationships,
  getRelationshipById,
  archiveRelationship,
};

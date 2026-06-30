"use client";

import { createContext, useContext, useMemo, useState } from "react";
import businesses from "@/data/businesses.json";
import { mockArticles } from "@/data/articles";
import { mockCollections } from "@/data/collections";
import { mockEvents } from "@/data/events";
import { mediaAssets } from "@/data/media";
import { mockPlaces } from "@/data/places";
import { mockRelationships } from "@/data/relationships";
import type { Relationship, RelationshipContentType, RelationshipType } from "@/types/Relationship";

interface RelationshipCatalogItem {
  id: string;
  type: RelationshipContentType;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  url: string;
}

interface RelationshipFilters {
  contentType?: RelationshipContentType;
  contentId?: string;
  relationshipType?: RelationshipType;
}

interface AddRelationshipInput {
  fromType: RelationshipContentType;
  fromId: string;
  toType: RelationshipContentType;
  toId: string;
  relationshipType: RelationshipType;
  label?: string;
}

interface UpdateRelationshipInput {
  relationshipType?: RelationshipType;
  label?: string;
  sortOrder?: number;
}

interface RelationshipStoreContextValue {
  relationships: Relationship[];
  addRelationship: (input: AddRelationshipInput) => Relationship;
  removeRelationship: (id: string) => void;
  updateRelationship: (id: string, input: UpdateRelationshipInput) => void;
  getRelationships: (filters?: RelationshipFilters) => Relationship[];
  searchContent: (query: string, type: RelationshipContentType | "all") => RelationshipCatalogItem[];
  getCatalogItem: (type: RelationshipContentType, id: string) => RelationshipCatalogItem | null;
  reorderRelationshipInType: (
    contentType: RelationshipContentType,
    contentId: string,
    relationshipType: RelationshipType,
    draggedId: string,
    targetId: string,
  ) => void;
}

const catalog: RelationshipCatalogItem[] = [
  ...mockPlaces.map((place) => ({
    id: place.id,
    type: "place" as const,
    title: place.name,
    subtitle: `${place.placeType} · ${place.city}`,
    description: place.description,
    image: place.featuredImage,
    url: `/places/${place.slug}`,
  })),
  ...mockCollections.map((collection) => ({
    id: collection.id,
    type: "collection" as const,
    title: collection.title,
    subtitle: `${collection.season} · ${collection.audience}`,
    description: collection.description,
    image: collection.featuredImage,
    url: `/collections/${collection.slug}`,
  })),
  ...mediaAssets.map((asset) => ({
    id: asset.id,
    type: "media" as const,
    title: asset.title,
    subtitle: `Media · ${asset.type}`,
    description: asset.altText,
    image: asset.thumbnailUrl || asset.url,
    url: "/basecamp/media",
  })),
  ...mockArticles.map((article) => ({
    id: article.id,
    type: "article" as const,
    title: article.title,
    subtitle: `${article.articleType} · ${article.author}`,
    description: article.excerpt,
    image: article.featuredImage,
    url: `/guides/${article.slug}`,
  })),
  ...mockEvents.map((event) => ({
    id: event.id,
    type: "event" as const,
    title: event.title,
    subtitle: `${event.city} · ${event.eventType}`,
    description: event.description,
    image: event.featuredImage,
    url: `/events/${event.slug}`,
  })),
  ...businesses.map((business) => ({
    id: business.id,
    type: "deal" as const,
    title: business.name,
    subtitle: `${business.city} · Partner deal`,
    description: business.description,
    image: business.featuredImage,
    url: "/#deals",
  })),
];

const RelationshipStoreContext = createContext<RelationshipStoreContextValue | null>(null);

function makeId() {
  return `rel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function sortByOrder(items: Relationship[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));
}

export function RelationshipStoreProvider({ children }: { children: React.ReactNode }) {
  const [relationships, setRelationships] = useState<Relationship[]>(() => sortByOrder(mockRelationships));

  const getRelationships = (filters?: RelationshipFilters) => {
    const filtered = relationships.filter((item) => {
      if (!filters) {
        return true;
      }

      const typeMatch = !filters.contentType || item.fromType === filters.contentType || item.toType === filters.contentType;
      const idMatch =
        !filters.contentId ||
        (filters.contentType
          ? (item.fromType === filters.contentType && item.fromId === filters.contentId) ||
            (item.toType === filters.contentType && item.toId === filters.contentId)
          : item.fromId === filters.contentId || item.toId === filters.contentId);
      const relationshipMatch = !filters.relationshipType || item.relationshipType === filters.relationshipType;

      return typeMatch && idMatch && relationshipMatch;
    });

    return sortByOrder(filtered);
  };

  const addRelationship = (input: AddRelationshipInput) => {
    const existingCount = getRelationships({
      contentType: input.fromType,
      contentId: input.fromId,
      relationshipType: input.relationshipType,
    }).length;

    const created: Relationship = {
      id: makeId(),
      fromType: input.fromType,
      fromId: input.fromId,
      toType: input.toType,
      toId: input.toId,
      relationshipType: input.relationshipType,
      label: input.label ?? "Linked from editor",
      sortOrder: existingCount + 1,
      createdAt: new Date().toISOString(),
    };

    setRelationships((current) => sortByOrder([...current, created]));
    return created;
  };

  const removeRelationship = (id: string) => {
    setRelationships((current) => current.filter((item) => item.id !== id));
  };

  const updateRelationship = (id: string, input: UpdateRelationshipInput) => {
    setRelationships((current) =>
      sortByOrder(
        current.map((item) => {
          if (item.id !== id) {
            return item;
          }

          return {
            ...item,
            ...input,
          };
        }),
      ),
    );
  };

  const searchContent = (query: string, type: RelationshipContentType | "all") => {
    const normalizedQuery = query.trim().toLowerCase();
    const byType = type === "all" ? catalog : catalog.filter((item) => item.type === type);

    if (!normalizedQuery) {
      return byType.slice(0, 8);
    }

    return byType
      .filter((item) =>
        [item.title, item.subtitle, item.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 8);
  };

  const getCatalogItem = (type: RelationshipContentType, id: string) => {
    return catalog.find((item) => item.type === type && item.id === id) ?? null;
  };

  const reorderRelationshipInType = (
    contentType: RelationshipContentType,
    contentId: string,
    relationshipType: RelationshipType,
    draggedId: string,
    targetId: string,
  ) => {
    setRelationships((current) => {
      const scoped = sortByOrder(
        current.filter(
          (item) =>
            item.relationshipType === relationshipType &&
            ((item.fromType === contentType && item.fromId === contentId) || (item.toType === contentType && item.toId === contentId)),
        ),
      );

      const draggedIndex = scoped.findIndex((item) => item.id === draggedId);
      const targetIndex = scoped.findIndex((item) => item.id === targetId);

      if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) {
        return current;
      }

      const nextScoped = [...scoped];
      const [dragged] = nextScoped.splice(draggedIndex, 1);
      nextScoped.splice(targetIndex, 0, dragged);

      const mapped = new Map(nextScoped.map((item, index) => [item.id, index + 1]));

      return sortByOrder(
        current.map((item) => {
          const nextOrder = mapped.get(item.id);
          if (!nextOrder) {
            return item;
          }
          return {
            ...item,
            sortOrder: nextOrder,
          };
        }),
      );
    });
  };

  const value = useMemo<RelationshipStoreContextValue>(
    () => ({
      relationships,
      addRelationship,
      removeRelationship,
      updateRelationship,
      getRelationships,
      searchContent,
      getCatalogItem,
      reorderRelationshipInType,
    }),
    [relationships],
  );

  return <RelationshipStoreContext.Provider value={value}>{children}</RelationshipStoreContext.Provider>;
}

export function useRelationshipStore() {
  const context = useContext(RelationshipStoreContext);
  if (!context) {
    throw new Error("useRelationshipStore must be used within RelationshipStoreProvider");
  }
  return context;
}

export type { AddRelationshipInput, RelationshipCatalogItem, RelationshipFilters, UpdateRelationshipInput };

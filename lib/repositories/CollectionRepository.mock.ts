import { mockCollections } from "@/data/collections";
import type { Collection } from "@/types/Collection";

export type CollectionInput = Omit<Collection, "id" | "createdAt" | "updatedAt">;

let collectionStore: Collection[] = mockCollections.map((collection) => ({
  ...collection,
  tags: [...collection.tags],
  gallery: [...collection.gallery],
  places: [...collection.places],
}));

function cloneCollection(collection: Collection): Collection {
  return {
    ...collection,
    tags: [...collection.tags],
    gallery: [...collection.gallery],
    places: [...collection.places],
  };
}

function createId(slug: string) {
  return `collection-${slug}-${Date.now().toString(36)}`;
}

export async function getCollections(): Promise<Collection[]> {
  return collectionStore.map(cloneCollection);
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  const collection = collectionStore.find((item) => item.id === id);
  return collection ? cloneCollection(collection) : null;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const collection = collectionStore.find((item) => item.slug === slug);
  return collection ? cloneCollection(collection) : null;
}

export async function createCollection(collection: CollectionInput): Promise<Collection> {
  const created: Collection = {
    ...collection,
    id: createId(collection.slug),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  collectionStore = [created, ...collectionStore];
  return cloneCollection(created);
}

export async function updateCollection(id: string, updates: Partial<CollectionInput>): Promise<Collection | null> {
  const index = collectionStore.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }

  const current = collectionStore[index];
  const updated: Collection = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  collectionStore[index] = updated;
  return cloneCollection(updated);
}

export async function archiveCollection(id: string): Promise<Collection | null> {
  return updateCollection(id, { status: "archived" });
}

export const mockCollectionRepository = {
  getCollections,
  getCollectionById,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  archiveCollection,
};

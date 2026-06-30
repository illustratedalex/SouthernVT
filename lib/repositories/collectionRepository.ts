import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { CollectionInput } from "@/lib/repositories/CollectionRepository.mock";
import * as mockRepository from "@/lib/repositories/CollectionRepository.mock";
import * as supabaseRepository from "@/lib/repositories/collectionRepository.supabase";
import type { Collection } from "@/types/Collection";
type CollectionRepositoryModule = {
  getCollections: () => Promise<Collection[]>;
  getCollectionById: (id: string) => Promise<Collection | null>;
  getCollectionBySlug: (slug: string) => Promise<Collection | null>;
  createCollection: (collection: CollectionInput) => Promise<Collection>;
  updateCollection: (id: string, updates: Partial<CollectionInput>) => Promise<Collection | null>;
  archiveCollection: (id: string) => Promise<Collection | null>;
};

async function getActiveCollectionRepository(): Promise<CollectionRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getCollections(): Promise<Collection[]> {
  const repository = await getActiveCollectionRepository();
  return repository.getCollections();
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  const repository = await getActiveCollectionRepository();
  return repository.getCollectionById(id);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const repository = await getActiveCollectionRepository();
  return repository.getCollectionBySlug(slug);
}

export async function createCollection(collection: CollectionInput): Promise<Collection> {
  const repository = await getActiveCollectionRepository();
  return repository.createCollection(collection);
}

export async function updateCollection(id: string, updates: Partial<CollectionInput>): Promise<Collection | null> {
  const repository = await getActiveCollectionRepository();
  return repository.updateCollection(id, updates);
}

export async function deleteCollection(id: string): Promise<Collection | null> {
  const repository = await getActiveCollectionRepository();
  return repository.archiveCollection(id);
}

export const collectionRepository = {
  getAll: getCollections,
  getById: getCollectionById,
  create: createCollection,
  update: updateCollection,
  archive: deleteCollection,
  getCollections,
  getCollectionById,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};

import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Story } from "@/types/Story";
import type { StoryInput } from "./StoryRepository.mock";
import * as mockRepository from "./StoryRepository.mock";
import * as supabaseRepository from "./storyRepository.supabase";

type StoryRepositoryModule = {
  getStoryByPlace: (placeId: string) => Promise<Story | null>;
  getStoryByCollection: (collectionId: string) => Promise<Story | null>;
  getStory: (id: string) => Promise<Story | null>;
  createStory: (input: StoryInput) => Promise<Story>;
  updateStory: (id: string, updates: Partial<StoryInput>) => Promise<Story | null>;
};

async function getActiveStoryRepository(): Promise<StoryRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getStoryByPlace(placeId: string): Promise<Story | null> {
  const repository = await getActiveStoryRepository();
  try {
    return await repository.getStoryByPlace(placeId);
  } catch {
    return mockRepository.getStoryByPlace(placeId);
  }
}

export async function getStoryByCollection(collectionId: string): Promise<Story | null> {
  const repository = await getActiveStoryRepository();
  try {
    return await repository.getStoryByCollection(collectionId);
  } catch {
    return mockRepository.getStoryByCollection(collectionId);
  }
}

export async function getStory(id: string): Promise<Story | null> {
  const repository = await getActiveStoryRepository();
  try {
    return await repository.getStory(id);
  } catch {
    return mockRepository.getStory(id);
  }
}

export async function createStory(input: StoryInput): Promise<Story> {
  const repository = await getActiveStoryRepository();
  try {
    return await repository.createStory(input);
  } catch {
    return mockRepository.createStory(input);
  }
}

export async function updateStory(id: string, updates: Partial<StoryInput>): Promise<Story | null> {
  const repository = await getActiveStoryRepository();
  try {
    return await repository.updateStory(id, updates);
  } catch {
    return mockRepository.updateStory(id, updates);
  }
}

export const storyRepository = {
  getByPlace: getStoryByPlace,
  getByCollection: getStoryByCollection,
  getById: getStory,
  create: createStory,
  update: updateStory,
  getStoryByPlace,
  getStoryByCollection,
  getStory,
  createStory,
  updateStory,
};

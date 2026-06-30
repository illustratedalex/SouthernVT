import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { MediaAssetInput } from "@/lib/repositories/mediaRepository.mock";
import * as mockRepository from "@/lib/repositories/mediaRepository.mock";
import * as supabaseRepository from "@/lib/repositories/mediaRepository.supabase";
import type { MediaAsset } from "@/types/MediaAsset";
type MediaRepositoryModule = {
  getMediaAssets: () => Promise<MediaAsset[]>;
  getMediaAssetById: (id: string) => Promise<MediaAsset | null>;
  createMediaAsset: (input: MediaAssetInput) => Promise<MediaAsset>;
  updateMediaAsset: (id: string, updates: Partial<MediaAssetInput>) => Promise<MediaAsset | null>;
  archiveMediaAsset: (id: string) => Promise<MediaAsset | null>;
};

async function getActiveMediaRepository(): Promise<MediaRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const repository = await getActiveMediaRepository();
  return repository.getMediaAssets();
}

export async function getMediaAssetById(id: string): Promise<MediaAsset | null> {
  const repository = await getActiveMediaRepository();
  return repository.getMediaAssetById(id);
}

export async function createMediaAsset(input: MediaAssetInput): Promise<MediaAsset> {
  const repository = await getActiveMediaRepository();
  return repository.createMediaAsset(input);
}

export async function updateMediaAsset(id: string, updates: Partial<MediaAssetInput>): Promise<MediaAsset | null> {
  const repository = await getActiveMediaRepository();
  return repository.updateMediaAsset(id, updates);
}

export async function archiveMediaAsset(id: string): Promise<MediaAsset | null> {
  const repository = await getActiveMediaRepository();
  return repository.archiveMediaAsset(id);
}

export const mediaRepository = {
  getAll: getMediaAssets,
  getById: getMediaAssetById,
  create: createMediaAsset,
  update: updateMediaAsset,
  archive: archiveMediaAsset,
  getMediaAssets,
  getMediaAssetById,
  createMediaAsset,
  updateMediaAsset,
  archiveMediaAsset,
};

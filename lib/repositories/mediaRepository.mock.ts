import { mediaAssets } from "@/data/media";
import type { MediaAsset } from "@/types/MediaAsset";

export type MediaAssetInput = Omit<MediaAsset, "id" | "createdAt">;

let mediaStore: MediaAsset[] = mediaAssets.map((asset) => ({
  ...asset,
  tags: [...asset.tags],
  attachedTo: [...asset.attachedTo],
}));

function cloneAsset(asset: MediaAsset): MediaAsset {
  return {
    ...asset,
    tags: [...asset.tags],
    attachedTo: [...asset.attachedTo],
  };
}

function createId() {
  return `media-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  return mediaStore.map(cloneAsset);
}

export async function getMediaAssetById(id: string): Promise<MediaAsset | null> {
  const asset = mediaStore.find((item) => item.id === id);
  return asset ? cloneAsset(asset) : null;
}

export async function createMediaAsset(input: MediaAssetInput): Promise<MediaAsset> {
  const created: MediaAsset = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  mediaStore = [created, ...mediaStore];
  return cloneAsset(created);
}

export async function updateMediaAsset(id: string, updates: Partial<MediaAssetInput>): Promise<MediaAsset | null> {
  const index = mediaStore.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }

  const updated: MediaAsset = {
    ...mediaStore[index],
    ...updates,
  };
  mediaStore[index] = updated;
  return cloneAsset(updated);
}

export async function archiveMediaAsset(id: string): Promise<MediaAsset | null> {
  const index = mediaStore.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }

  const updated: MediaAsset = {
    ...mediaStore[index],
    status: "archived",
  };

  mediaStore[index] = updated;
  return cloneAsset(updated);
}

export const mockMediaRepository = {
  getMediaAssets,
  getMediaAssetById,
  createMediaAsset,
  updateMediaAsset,
  archiveMediaAsset,
};

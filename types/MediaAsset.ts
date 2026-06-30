export type MediaAssetType = "image" | "video" | "document";

export type MediaAssetStatus = "active" | "archived";

export interface MediaAsset {
  id: string;
  title: string;
  altText: string;
  type: MediaAssetType;
  url: string;
  thumbnailUrl: string;
  tags: string[];
  attachedTo: string[];
  credit?: string;
  license?: string;
  notes?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  usageCount?: number;
  status: MediaAssetStatus;
  createdAt: string;
}

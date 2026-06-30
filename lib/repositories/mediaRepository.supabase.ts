import { getSupabaseClient } from "@/lib/supabase/client";
import type { MediaAsset } from "@/types/MediaAsset";

export type MediaAssetInput = Omit<MediaAsset, "id" | "createdAt">;

function mapMediaRowToAsset(row: any): MediaAsset {
  return {
    id: row.id,
    title: row.title,
    altText: row.alt_text,
    type: row.asset_type,
    url: row.url,
    thumbnailUrl: row.thumbnail_url,
    tags: row.tags ?? [],
    attachedTo: row.attached_to ?? [],
    credit: row.credit ?? undefined,
    license: row.license ?? undefined,
    notes: row.notes ?? undefined,
    fileSize: row.file_size ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    usageCount: row.usage_count ?? undefined,
    status: row.status ?? (row.archived_at ? "archived" : "active"),
    createdAt: row.created_at,
  };
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("media_assets").select("*").is("archived_at", null).order("created_at", { ascending: false });
  if (error || !data) {
    throw new Error(`Failed to fetch media assets from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapMediaRowToAsset);
}

export async function getMediaAssetById(id: string): Promise<MediaAsset | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("media_assets").select("*").eq("id", id).is("archived_at", null).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch media asset by id from Supabase: ${error.message}`);
  }
  return data ? mapMediaRowToAsset(data) : null;
}

export async function createMediaAsset(input: MediaAssetInput): Promise<MediaAsset> {
  const client: any = getSupabaseClient();
  const now = new Date().toISOString();
  const payload = {
    id: `media-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title,
    alt_text: input.altText,
    asset_type: input.type,
    url: input.url,
    thumbnail_url: input.thumbnailUrl,
    tags: input.tags,
    attached_to: input.attachedTo,
    credit: input.credit ?? null,
    license: input.license ?? null,
    notes: input.notes ?? null,
    file_size: input.fileSize ?? null,
    width: input.width ?? null,
    height: input.height ?? null,
    usage_count: input.usageCount ?? 0,
    status: input.status,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await client.from("media_assets").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to create media asset in Supabase: ${error?.message ?? "unknown error"}`);
  }
  return mapMediaRowToAsset(data);
}

export async function updateMediaAsset(id: string, updates: Partial<MediaAssetInput>): Promise<MediaAsset | null> {
  const client: any = getSupabaseClient();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.altText !== undefined) payload.alt_text = updates.altText;
  if (updates.type !== undefined) payload.asset_type = updates.type;
  if (updates.url !== undefined) payload.url = updates.url;
  if (updates.thumbnailUrl !== undefined) payload.thumbnail_url = updates.thumbnailUrl;
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.attachedTo !== undefined) payload.attached_to = updates.attachedTo;
  if (updates.credit !== undefined) payload.credit = updates.credit;
  if (updates.license !== undefined) payload.license = updates.license;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.fileSize !== undefined) payload.file_size = updates.fileSize;
  if (updates.width !== undefined) payload.width = updates.width;
  if (updates.height !== undefined) payload.height = updates.height;
  if (updates.usageCount !== undefined) payload.usage_count = updates.usageCount;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await client.from("media_assets").update(payload).eq("id", id).is("archived_at", null).select("*").maybeSingle();
  if (error) {
    throw new Error(`Failed to update media asset in Supabase: ${error.message}`);
  }
  return data ? mapMediaRowToAsset(data) : null;
}

export async function archiveMediaAsset(id: string): Promise<MediaAsset | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("media_assets")
    .update({ archived_at: new Date().toISOString(), status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to archive media asset in Supabase: ${error.message}`);
  }
  return data ? mapMediaRowToAsset(data) : null;
}

export const supabaseMediaRepository = {
  getMediaAssets,
  getMediaAssetById,
  createMediaAsset,
  updateMediaAsset,
  archiveMediaAsset,
};

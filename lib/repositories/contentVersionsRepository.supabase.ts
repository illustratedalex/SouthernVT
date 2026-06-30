import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentVersion } from "@/types/Workflow";

function mapContentVersion(row: any): ContentVersion {
  return {
    id: row.id,
    contentType: row.content_type,
    contentId: row.content_id,
    versionNumber: row.version_number,
    title: row.summary ?? row.title,
    snapshot: typeof row.snapshot === "string" ? row.snapshot : JSON.stringify(row.snapshot ?? {}),
    createdBy: row.actor ?? row.created_by,
    createdAt: row.created_at,
    published: row.published ?? false,
  };
}

export async function getContentVersionsSupabase(contentType: string, contentId: string): Promise<ContentVersion[]> {
  const client: any = getSupabaseServerClient();
  const { data, error } = await client
    .from("content_versions")
    .select("*")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .is("archived_at", null)
    .order("version_number", { ascending: false });

  if (error || !data) {
    throw new Error(`Failed to fetch content versions from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapContentVersion);
}

export async function addContentVersionSupabase(version: Omit<ContentVersion, "id">): Promise<ContentVersion> {
  const client: any = getSupabaseServerClient();
  const payload = {
    id: `ver-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    content_type: version.contentType,
    content_id: version.contentId,
    version_number: version.versionNumber,
    actor: version.createdBy,
    summary: version.title,
    snapshot: version.snapshot,
    created_at: version.createdAt,
    published: version.published,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client.from("content_versions").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to add content version in Supabase: ${error?.message ?? "unknown error"}`);
  }

  return mapContentVersion(data);
}

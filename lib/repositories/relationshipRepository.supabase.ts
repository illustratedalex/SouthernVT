import { getSupabaseClient } from "@/lib/supabase/client";
import type { Relationship, RelationshipContentType, RelationshipType } from "@/types/Relationship";

export type RelationshipInput = Omit<Relationship, "id" | "createdAt">;

function mapRelationshipRowToRelationship(row: any): Relationship {
  return {
    id: row.id,
    fromType: row.source_type ?? row.from_type,
    fromId: row.source_id ?? row.from_id,
    toType: row.target_type ?? row.to_type,
    toId: row.target_id ?? row.to_id,
    relationshipType: row.relationship_type,
    label: row.label,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export async function getRelationshipsForContent(contentType: RelationshipContentType, contentId: string): Promise<Relationship[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("relationships")
    .select("*")
    .is("archived_at", null)
    .or(`and(source_type.eq.${contentType},source_id.eq.${contentId}),and(target_type.eq.${contentType},target_id.eq.${contentId}),and(from_type.eq.${contentType},from_id.eq.${contentId}),and(to_type.eq.${contentType},to_id.eq.${contentId})`)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    throw new Error(`Failed to fetch relationships for content from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapRelationshipRowToRelationship);
}

export async function getRelationshipsByType(
  contentType: RelationshipContentType,
  contentId: string,
  relationshipType: RelationshipType,
): Promise<Relationship[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("relationships")
    .select("*")
    .eq("relationship_type", relationshipType)
    .is("archived_at", null)
    .or(`and(source_type.eq.${contentType},source_id.eq.${contentId}),and(target_type.eq.${contentType},target_id.eq.${contentId}),and(from_type.eq.${contentType},from_id.eq.${contentId}),and(to_type.eq.${contentType},to_id.eq.${contentId})`)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    throw new Error(`Failed to fetch relationships by type from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapRelationshipRowToRelationship);
}

export async function createRelationship(input: RelationshipInput): Promise<Relationship> {
  const client: any = getSupabaseClient();
  const now = new Date().toISOString();
  const payload = {
    id: `rel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    source_type: input.fromType,
    source_id: input.fromId,
    target_type: input.toType,
    target_id: input.toId,
    relationship_type: input.relationshipType,
    label: input.label,
    sort_order: input.sortOrder,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await client.from("relationships").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to create relationship in Supabase: ${error?.message ?? "unknown error"}`);
  }
  return mapRelationshipRowToRelationship(data);
}

export async function updateRelationship(id: string, updates: Partial<RelationshipInput>): Promise<Relationship | null> {
  const client: any = getSupabaseClient();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.fromType !== undefined) payload.source_type = updates.fromType;
  if (updates.fromId !== undefined) payload.source_id = updates.fromId;
  if (updates.toType !== undefined) payload.target_type = updates.toType;
  if (updates.toId !== undefined) payload.target_id = updates.toId;
  if (updates.relationshipType !== undefined) payload.relationship_type = updates.relationshipType;
  if (updates.label !== undefined) payload.label = updates.label;
  if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;

  const { data, error } = await client.from("relationships").update(payload).eq("id", id).is("archived_at", null).select("*").maybeSingle();
  if (error) {
    throw new Error(`Failed to update relationship in Supabase: ${error.message}`);
  }
  return data ? mapRelationshipRowToRelationship(data) : null;
}

export async function deleteRelationship(id: string): Promise<boolean> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("relationships")
    .update({ archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to archive relationship in Supabase: ${error.message}`);
  }
  return Boolean(data);
}

export async function getAllRelationships(): Promise<Relationship[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("relationships").select("*").is("archived_at", null).order("sort_order", { ascending: true });
  if (error || !data) {
    throw new Error(`Failed to fetch relationships from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapRelationshipRowToRelationship);
}

export async function getRelationshipById(id: string): Promise<Relationship | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("relationships").select("*").eq("id", id).is("archived_at", null).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch relationship: ${error.message}`);
  }
  return data ? mapRelationshipRowToRelationship(data) : null;
}

export async function archiveRelationship(id: string): Promise<Relationship | null> {
  const existing = await getRelationshipById(id);
  await deleteRelationship(id);
  return existing;
}

export const supabaseRelationshipRepository = {
  getRelationshipsForContent,
  getRelationshipsByType,
  createRelationship,
  updateRelationship,
  deleteRelationship,
  getAllRelationships,
  getRelationshipById,
  archiveRelationship,
};

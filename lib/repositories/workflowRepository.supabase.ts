import { getSupabaseClient } from "@/lib/supabase/client";
import type { ContentVersion, EditorialComment, WorkflowContentType, WorkflowEvent } from "@/types/Workflow";

export type WorkflowEventInput = Omit<WorkflowEvent, "id" | "createdAt">;
export type EditorialCommentInput = Omit<EditorialComment, "id" | "createdAt" | "resolved">;

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function mapWorkflowEvent(row: any): WorkflowEvent {
  return {
    id: row.id,
    contentType: row.content_type,
    contentId: row.content_id,
    fromStatus: row.from_status ?? "draft",
    toStatus: row.to_status,
    note: row.note,
    createdBy: row.actor ?? row.created_by,
    createdAt: row.created_at,
  };
}

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

function mapEditorialComment(row: any): EditorialComment {
  return {
    id: row.id,
    contentType: row.content_type,
    contentId: row.content_id,
    body: row.body,
    author: row.author,
    resolved: row.resolved,
    createdAt: row.created_at,
  };
}

export async function getWorkflowEventsForContent(contentType: WorkflowContentType, contentId: string): Promise<WorkflowEvent[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("workflow_events")
    .select("*")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) {
    throw new Error(`Failed to fetch workflow events from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapWorkflowEvent);
}

export async function getVersionsForContent(contentType: WorkflowContentType, contentId: string): Promise<ContentVersion[]> {
  const client: any = getSupabaseClient();
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

export async function getCommentsForContent(contentType: WorkflowContentType, contentId: string): Promise<EditorialComment[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("editorial_comments")
    .select("*")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) {
    throw new Error(`Failed to fetch editorial comments from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapEditorialComment);
}

export async function addWorkflowEvent(event: WorkflowEventInput): Promise<WorkflowEvent> {
  const client: any = getSupabaseClient();
  const now = new Date().toISOString();
  const payload = {
    id: createId("wf"),
    content_type: event.contentType,
    content_id: event.contentId,
    from_status: event.fromStatus,
    to_status: event.toStatus,
    actor: event.createdBy,
    note: event.note,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await client.from("workflow_events").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to add workflow event in Supabase: ${error?.message ?? "unknown error"}`);
  }
  return mapWorkflowEvent(data);
}

export async function addComment(comment: EditorialCommentInput): Promise<EditorialComment> {
  const client: any = getSupabaseClient();
  const now = new Date().toISOString();
  const payload = {
    id: createId("comment"),
    content_type: comment.contentType,
    content_id: comment.contentId,
    body: comment.body,
    author: comment.author,
    resolved: false,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await client.from("editorial_comments").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to add editorial comment in Supabase: ${error?.message ?? "unknown error"}`);
  }
  return mapEditorialComment(data);
}

export async function resolveComment(commentId: string): Promise<EditorialComment | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("editorial_comments")
    .update({ resolved: true, updated_at: new Date().toISOString() })
    .eq("id", commentId)
    .is("archived_at", null)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to resolve comment in Supabase: ${error.message}`);
  }
  return data ? mapEditorialComment(data) : null;
}

export async function getAllWorkflowEvents(): Promise<WorkflowEvent[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("workflow_events").select("*").is("archived_at", null).order("created_at", { ascending: false });
  if (error || !data) {
    throw new Error(`Failed to fetch workflow events from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapWorkflowEvent);
}

export async function getWorkflowEventById(id: string): Promise<WorkflowEvent | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("workflow_events").select("*").eq("id", id).is("archived_at", null).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch workflow event from Supabase: ${error.message}`);
  }
  return data ? mapWorkflowEvent(data) : null;
}

export async function updateWorkflowEvent(id: string, updates: Partial<WorkflowEventInput>): Promise<WorkflowEvent | null> {
  const client: any = getSupabaseClient();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.contentType !== undefined) payload.content_type = updates.contentType;
  if (updates.contentId !== undefined) payload.content_id = updates.contentId;
  if (updates.fromStatus !== undefined) payload.from_status = updates.fromStatus;
  if (updates.toStatus !== undefined) payload.to_status = updates.toStatus;
  if (updates.note !== undefined) payload.note = updates.note;
  if (updates.createdBy !== undefined) payload.actor = updates.createdBy;

  const { data, error } = await client.from("workflow_events").update(payload).eq("id", id).is("archived_at", null).select("*").maybeSingle();
  if (error) {
    throw new Error(`Failed to update workflow event in Supabase: ${error.message}`);
  }
  return data ? mapWorkflowEvent(data) : null;
}

export async function archiveWorkflowEvent(id: string): Promise<WorkflowEvent | null> {
  const existing = await getWorkflowEventById(id);
  const client: any = getSupabaseClient();
  const { error } = await client.from("workflow_events").update({ archived_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id);
  if (error) {
    throw new Error(`Failed to archive workflow event in Supabase: ${error.message}`);
  }
  return existing;
}

export const supabaseWorkflowRepository = {
  getWorkflowEventsForContent,
  getVersionsForContent,
  getCommentsForContent,
  addWorkflowEvent,
  addComment,
  resolveComment,
  getAllWorkflowEvents,
  getWorkflowEventById,
  updateWorkflowEvent,
  archiveWorkflowEvent,
};

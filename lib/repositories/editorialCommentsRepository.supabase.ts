import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { EditorialComment } from "@/types/Workflow";

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

export async function getEditorialCommentsSupabase(contentType: string, contentId: string): Promise<EditorialComment[]> {
  const client: any = getSupabaseServerClient();
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

export async function addEditorialCommentSupabase(comment: Omit<EditorialComment, "id" | "createdAt">): Promise<EditorialComment> {
  const client: any = getSupabaseServerClient();
  const now = new Date().toISOString();
  const payload = {
    id: `comment-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    content_type: comment.contentType,
    content_id: comment.contentId,
    body: comment.body,
    author: comment.author,
    resolved: comment.resolved,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await client.from("editorial_comments").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to add editorial comment in Supabase: ${error?.message ?? "unknown error"}`);
  }

  return mapEditorialComment(data);
}

export async function resolveEditorialCommentSupabase(id: string, resolved: boolean): Promise<EditorialComment | null> {
  const client: any = getSupabaseServerClient();
  const { data, error } = await client
    .from("editorial_comments")
    .update({ resolved, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("archived_at", null)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update editorial comment in Supabase: ${error.message}`);
  }
  return data ? mapEditorialComment(data) : null;
}

import type { Activity, ActivityContentType } from "@/types/Activity";
import { getSupabaseClient } from "@/lib/supabase/client";

export type ActivityInput = Omit<Activity, "id" | "createdAt">;

function createId() {
  return `activity-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function mapActivity(row: any): Activity {
  return {
    id: row.id,
    type: row.type,
    contentType: row.content_type,
    contentId: row.content_id,
    title: row.title,
    description: row.description,
    actor: row.actor,
    createdAt: row.created_at,
    metadata: row.metadata ?? {},
  };
}

export async function getActivity(): Promise<Activity[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("activities").select("*").is("archived_at", null).order("created_at", { ascending: false });
  if (error || !data) {
    throw new Error(`Failed to fetch activities from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapActivity);
}

export async function getRecentActivity(limit: number): Promise<Activity[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("activities").select("*").is("archived_at", null).order("created_at", { ascending: false }).limit(limit);
  if (error || !data) {
    throw new Error(`Failed to fetch recent activities from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapActivity);
}

export async function getActivityByContent(contentType: ActivityContentType, contentId: string): Promise<Activity[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("activities")
    .select("*")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) {
    throw new Error(`Failed to fetch activity by content from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapActivity);
}

export async function createActivity(activity: ActivityInput): Promise<Activity> {
  const client: any = getSupabaseClient();
  const now = new Date().toISOString();
  const payload = {
    id: createId(),
    type: activity.type,
    content_type: activity.contentType,
    content_id: activity.contentId,
    title: activity.title,
    description: activity.description,
    actor: activity.actor,
    metadata: activity.metadata,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await client.from("activities").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to add activity in Supabase: ${error?.message ?? "unknown error"}`);
  }
  return mapActivity(data);
}

export const supabaseActivityRepository = {
  getActivity,
  getRecentActivity,
  getActivityByContent,
  createActivity,
};

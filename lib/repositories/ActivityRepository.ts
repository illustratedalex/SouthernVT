import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Activity, ActivityContentType } from "@/types/Activity";
import type { ActivityInput } from "@/lib/repositories/activityRepository.mock";
import * as mockRepository from "@/lib/repositories/activityRepository.mock";
import * as supabaseRepository from "@/lib/repositories/activityRepository.supabase";

type ActivityRepositoryModule = {
  getActivity: () => Promise<Activity[]>;
  getRecentActivity: (limit: number) => Promise<Activity[]>;
  getActivityByContent: (contentType: ActivityContentType, contentId: string) => Promise<Activity[]>;
  createActivity: (activity: ActivityInput) => Promise<Activity>;
};

async function getActiveActivityRepository(): Promise<ActivityRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getActivity(): Promise<Activity[]> {
  const repository = await getActiveActivityRepository();
  return repository.getActivity();
}

export async function getRecentActivity(limit: number): Promise<Activity[]> {
  const repository = await getActiveActivityRepository();
  return repository.getRecentActivity(limit);
}

export async function getActivityByContent(contentType: ActivityContentType, contentId: string): Promise<Activity[]> {
  const repository = await getActiveActivityRepository();
  return repository.getActivityByContent(contentType, contentId);
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const items = await getActivity();
  return items.find((item) => item.id === id) ?? null;
}

export async function createActivity(activity: ActivityInput): Promise<Activity> {
  const repository = await getActiveActivityRepository();
  return repository.createActivity(activity);
}

export async function updateActivity(id: string, updates: Partial<ActivityInput>): Promise<Activity | null> {
  const existing = await getActivityById(id);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
    ...updates,
  };
}

export async function archiveActivity(id: string): Promise<Activity | null> {
  const existing = await getActivityById(id);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
    type: "archived",
  };
}

export const activityRepository = {
  getAll: getActivity,
  getById: getActivityById,
  create: createActivity,
  update: updateActivity,
  archive: archiveActivity,
  getActivity,
  getRecentActivity,
  getActivityByContent,
  getActivityById,
  createActivity,
  updateActivity,
  archiveActivity,
};

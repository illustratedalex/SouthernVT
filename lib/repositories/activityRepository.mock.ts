import { mockActivity } from "@/data/activity";
import type { Activity, ActivityContentType } from "@/types/Activity";

export type ActivityInput = Omit<Activity, "id" | "createdAt">;

let activityStore: Activity[] = [...mockActivity];

function createId() {
  return `activity-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function sortByNewest(items: Activity[]) {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getActivity(): Promise<Activity[]> {
  return sortByNewest(activityStore);
}

export async function getRecentActivity(limit: number): Promise<Activity[]> {
  const all = await getActivity();
  return all.slice(0, limit);
}

export async function getActivityByContent(contentType: ActivityContentType, contentId: string): Promise<Activity[]> {
  const all = await getActivity();
  return all.filter((item) => item.contentType === contentType && item.contentId === contentId);
}

export async function createActivity(activity: ActivityInput): Promise<Activity> {
  const created: Activity = {
    ...activity,
    id: createId(),
    createdAt: new Date().toISOString(),
  };

  activityStore = [created, ...activityStore];
  return created;
}

export const mockActivityRepository = {
  getActivity,
  getRecentActivity,
  getActivityByContent,
  createActivity,
};

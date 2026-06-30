export type ActivityType =
  | "created"
  | "updated"
  | "published"
  | "archived"
  | "uploaded"
  | "related"
  | "commented"
  | "status_changed";

export type ActivityContentType = "place" | "collection" | "media" | "relationship" | "workflow" | "user" | "system";

export interface Activity {
  id: string;
  type: ActivityType;
  contentType: ActivityContentType;
  contentId: string;
  title: string;
  description: string;
  actor: string;
  createdAt: string;
  metadata: Record<string, string | number | boolean | null>;
}

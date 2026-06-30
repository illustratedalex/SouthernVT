export type ContentStatus = "draft" | "review" | "scheduled" | "published" | "archived";

export type WorkflowContentType = "place" | "collection" | "media" | "article" | "event";

export interface WorkflowEvent {
  id: string;
  contentType: WorkflowContentType;
  contentId: string;
  fromStatus: ContentStatus;
  toStatus: ContentStatus;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface ContentVersion {
  id: string;
  contentType: WorkflowContentType;
  contentId: string;
  versionNumber: number;
  title: string;
  snapshot: string;
  createdBy: string;
  createdAt: string;
  published: boolean;
}

export interface EditorialComment {
  id: string;
  contentType: WorkflowContentType;
  contentId: string;
  body: string;
  author: string;
  resolved: boolean;
  createdAt: string;
}

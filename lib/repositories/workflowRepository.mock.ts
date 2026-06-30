import { mockContentVersions, mockEditorialComments, mockWorkflowEvents } from "@/data/workflow";
import type { ContentVersion, EditorialComment, WorkflowContentType, WorkflowEvent } from "@/types/Workflow";

export type WorkflowEventInput = Omit<WorkflowEvent, "id" | "createdAt">;
export type EditorialCommentInput = Omit<EditorialComment, "id" | "createdAt" | "resolved">;

let workflowEventStore: WorkflowEvent[] = [...mockWorkflowEvents];
const contentVersionStore: ContentVersion[] = [...mockContentVersions];
let commentStore: EditorialComment[] = [...mockEditorialComments];

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function sortByNewest<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getWorkflowEventsForContent(contentType: WorkflowContentType, contentId: string): Promise<WorkflowEvent[]> {
  const events = workflowEventStore.filter((event) => event.contentType === contentType && event.contentId === contentId);
  return sortByNewest(events);
}

export async function getVersionsForContent(contentType: WorkflowContentType, contentId: string): Promise<ContentVersion[]> {
  const versions = contentVersionStore.filter((version) => version.contentType === contentType && version.contentId === contentId);
  return [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
}

export async function getCommentsForContent(contentType: WorkflowContentType, contentId: string): Promise<EditorialComment[]> {
  const comments = commentStore.filter((comment) => comment.contentType === contentType && comment.contentId === contentId);
  return sortByNewest(comments);
}

export async function addWorkflowEvent(event: WorkflowEventInput): Promise<WorkflowEvent> {
  const created: WorkflowEvent = {
    ...event,
    id: createId("wf"),
    createdAt: new Date().toISOString(),
  };

  workflowEventStore = [created, ...workflowEventStore];
  return created;
}

export async function addComment(comment: EditorialCommentInput): Promise<EditorialComment> {
  const created: EditorialComment = {
    ...comment,
    id: createId("comment"),
    resolved: false,
    createdAt: new Date().toISOString(),
  };

  commentStore = [created, ...commentStore];
  return created;
}

export async function resolveComment(commentId: string): Promise<EditorialComment | null> {
  const index = commentStore.findIndex((comment) => comment.id === commentId);
  if (index < 0) {
    return null;
  }

  const current = commentStore[index];
  const updated: EditorialComment = {
    ...current,
    resolved: true,
  };

  commentStore[index] = updated;
  return updated;
}

export async function getAllWorkflowEvents(): Promise<WorkflowEvent[]> {
  return sortByNewest(workflowEventStore);
}

export async function getWorkflowEventById(id: string): Promise<WorkflowEvent | null> {
  return workflowEventStore.find((event) => event.id === id) ?? null;
}

export async function updateWorkflowEvent(id: string, updates: Partial<WorkflowEventInput>): Promise<WorkflowEvent | null> {
  const index = workflowEventStore.findIndex((event) => event.id === id);
  if (index < 0) {
    return null;
  }

  const current = workflowEventStore[index];
  const updated: WorkflowEvent = {
    ...current,
    ...updates,
  };
  workflowEventStore[index] = updated;
  return updated;
}

export async function archiveWorkflowEvent(id: string): Promise<WorkflowEvent | null> {
  const existing = workflowEventStore.find((event) => event.id === id) ?? null;
  workflowEventStore = workflowEventStore.filter((event) => event.id !== id);
  return existing;
}

export const mockWorkflowRepository = {
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

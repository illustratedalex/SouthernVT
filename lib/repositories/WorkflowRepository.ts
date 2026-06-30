import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { ContentVersion, EditorialComment, WorkflowContentType, WorkflowEvent } from "@/types/Workflow";
import type { EditorialCommentInput, WorkflowEventInput } from "@/lib/repositories/workflowRepository.mock";
import * as mockRepository from "@/lib/repositories/workflowRepository.mock";
import * as supabaseRepository from "@/lib/repositories/workflowRepository.supabase";

type WorkflowRepositoryModule = {
  getWorkflowEventsForContent: (contentType: WorkflowContentType, contentId: string) => Promise<WorkflowEvent[]>;
  getVersionsForContent: (contentType: WorkflowContentType, contentId: string) => Promise<ContentVersion[]>;
  getCommentsForContent: (contentType: WorkflowContentType, contentId: string) => Promise<EditorialComment[]>;
  addWorkflowEvent: (event: WorkflowEventInput) => Promise<WorkflowEvent>;
  addComment: (comment: EditorialCommentInput) => Promise<EditorialComment>;
  resolveComment: (commentId: string) => Promise<EditorialComment | null>;
  getAllWorkflowEvents: () => Promise<WorkflowEvent[]>;
  getWorkflowEventById: (id: string) => Promise<WorkflowEvent | null>;
  updateWorkflowEvent: (id: string, updates: Partial<WorkflowEventInput>) => Promise<WorkflowEvent | null>;
  archiveWorkflowEvent: (id: string) => Promise<WorkflowEvent | null>;
};

async function getActiveWorkflowRepository(): Promise<WorkflowRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getWorkflowEventsForContent(contentType: WorkflowContentType, contentId: string): Promise<WorkflowEvent[]> {
  const repository = await getActiveWorkflowRepository();
  return repository.getWorkflowEventsForContent(contentType, contentId);
}

export async function getVersionsForContent(contentType: WorkflowContentType, contentId: string): Promise<ContentVersion[]> {
  const repository = await getActiveWorkflowRepository();
  return repository.getVersionsForContent(contentType, contentId);
}

export async function getCommentsForContent(contentType: WorkflowContentType, contentId: string): Promise<EditorialComment[]> {
  const repository = await getActiveWorkflowRepository();
  return repository.getCommentsForContent(contentType, contentId);
}

export async function addWorkflowEvent(event: WorkflowEventInput): Promise<WorkflowEvent> {
  const repository = await getActiveWorkflowRepository();
  return repository.addWorkflowEvent(event);
}

export async function addComment(comment: EditorialCommentInput): Promise<EditorialComment> {
  const repository = await getActiveWorkflowRepository();
  return repository.addComment(comment);
}

export async function resolveComment(commentId: string): Promise<EditorialComment | null> {
  const repository = await getActiveWorkflowRepository();
  return repository.resolveComment(commentId);
}

export async function getAllWorkflowEvents(): Promise<WorkflowEvent[]> {
  const repository = await getActiveWorkflowRepository();
  return repository.getAllWorkflowEvents();
}

export async function getWorkflowEventById(id: string): Promise<WorkflowEvent | null> {
  const repository = await getActiveWorkflowRepository();
  return repository.getWorkflowEventById(id);
}

export async function updateWorkflowEvent(id: string, updates: Partial<WorkflowEventInput>): Promise<WorkflowEvent | null> {
  const repository = await getActiveWorkflowRepository();
  return repository.updateWorkflowEvent(id, updates);
}

export async function archiveWorkflowEvent(id: string): Promise<WorkflowEvent | null> {
  const repository = await getActiveWorkflowRepository();
  return repository.archiveWorkflowEvent(id);
}

export const workflowRepository = {
  getAll: getAllWorkflowEvents,
  getById: getWorkflowEventById,
  create: addWorkflowEvent,
  update: updateWorkflowEvent,
  archive: archiveWorkflowEvent,
  getWorkflowEventsForContent,
  getVersionsForContent,
  getCommentsForContent,
  addWorkflowEvent,
  addComment,
  resolveComment,
};

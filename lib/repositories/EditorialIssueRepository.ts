import { EditorialIssue, EditorialIssueWithMetadata } from "@/types/EditorialIssue";
import { editorialIssues } from "@/data/editorialIssues";

export function getEditorialIssues(): EditorialIssue[] {
  return editorialIssues;
}

export function getActiveEditorialIssue(): EditorialIssue | undefined {
  return editorialIssues.find((issue) => issue.status === "active");
}

export function getEditorialIssueById(id: string): EditorialIssue | undefined {
  return editorialIssues.find((issue) => issue.id === id);
}

export function getUpcomingEditorialIssues(): EditorialIssue[] {
  return editorialIssues.filter((issue) => issue.status === "planning" || issue.status === "active");
}

export function getEditorialIssueWithMetadata(id: string): EditorialIssueWithMetadata | undefined {
  const issue = getEditorialIssueById(id);
  if (!issue) return undefined;

  return {
    ...issue,
    placesCount: issue.featuredPlaces.length,
    assignmentsCount: issue.assignments.length,
    completedAssignments: issue.assignments.filter((a) => a.status === "complete").length,
    photoNeedsCount: issue.assignments.filter((a) => a.type === "photography").length,
  };
}

export function getAssignmentsByStatus(issueId: string, status: string) {
  const issue = getEditorialIssueById(issueId);
  if (!issue) return [];
  return issue.assignments.filter((a) => a.status === status);
}

export function getAssignmentsByType(issueId: string, type: string) {
  const issue = getEditorialIssueById(issueId);
  if (!issue) return [];
  return issue.assignments.filter((a) => a.type === type);
}

// Mock CRUD (not persisted)
export function createEditorialIssue(data: Omit<EditorialIssue, "id" | "createdAt" | "updatedAt">): EditorialIssue {
  const newIssue: EditorialIssue = {
    ...data,
    id: `issue-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  editorialIssues.push(newIssue);
  return newIssue;
}

export function updateEditorialIssue(id: string, updates: Partial<EditorialIssue>): EditorialIssue | undefined {
  const issue = getEditorialIssueById(id);
  if (!issue) return undefined;

  const updated: EditorialIssue = {
    ...issue,
    ...updates,
    id: issue.id,
    createdAt: issue.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const index = editorialIssues.findIndex((i) => i.id === id);
  if (index !== -1) {
    editorialIssues[index] = updated;
  }

  return updated;
}

export function archiveEditorialIssue(id: string): EditorialIssue | undefined {
  return updateEditorialIssue(id, { status: "archived" });
}

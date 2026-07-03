export type AssignmentType =
  | "Story"
  | "Photography"
  | "Research"
  | "Verification"
  | "SEO"
  | "Collections"
  | "Business Outreach"
  | "Relationship Mapping";

export type AssignmentPriority = "Critical" | "High" | "Medium" | "Low";

export type AssignmentStatus = "Unassigned" | "In Progress" | "In Review" | "Complete" | "On Hold";

export interface Assignment {
  id: string;
  title: string;
  placeId: string;
  assignee?: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  deadline?: string;
  estimatedMinutes?: number;
  assignmentType: AssignmentType;
  description?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentWithPlace extends Assignment {
  placeName: string;
  placeSlug: string;
}

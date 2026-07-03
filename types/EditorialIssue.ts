export type EditorialIssueStatus = "planning" | "active" | "review" | "published" | "archived";

export type AssignmentType = "story" | "photography" | "research" | "verification" | "seo" | "outreach" | "collection";

export type AssignmentStatus = "idea" | "assigned" | "in_progress" | "submitted" | "review" | "complete";

export type AssignmentPriority = "low" | "medium" | "high" | "urgent";

export interface EditorialIssueAssignment {
  id: string;
  title: string;
  type: AssignmentType;
  assignee?: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  dueDate?: string;
  contentId?: string;
  contentType?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorialIssue {
  id: string;
  title: string;
  weekOf: string;
  theme: string;
  status: EditorialIssueStatus;
  coverStoryId?: string;
  featuredPlaces: string[];
  featuredCollections: string[];
  featuredArticles: string[];
  featuredEvents: string[];
  featuredDeals: string[];
  assignments: EditorialIssueAssignment[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorialIssueWithMetadata extends EditorialIssue {
  placesCount: number;
  assignmentsCount: number;
  completedAssignments: number;
  photoNeedsCount: number;
}

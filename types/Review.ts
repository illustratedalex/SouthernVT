export type ReviewStatus = "pending" | "approved" | "rejected" | "archived";

export interface Review {
  id: string;
  placeId: string;
  reviewerName: string;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  visitDate?: string;
  tags: string[];
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

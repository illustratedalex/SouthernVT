import { mockReviews } from "@/data/reviews";
import type { Review, ReviewStatus } from "@/types/Review";

export type ReviewInput = Omit<Review, "id" | "status" | "helpfulCount" | "createdAt" | "updatedAt"> & {
  status?: ReviewStatus;
  helpfulCount?: number;
};

let reviewStore: Review[] = mockReviews.map((review) => ({ ...review, tags: [...review.tags] }));

function clone(review: Review): Review {
  return { ...review, tags: [...review.tags] };
}

function sortByCreatedAt(items: Review[]): Review[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function createId(placeId: string): string {
  return `review-${placeId}-${Date.now().toString(36)}`;
}

export async function getReviews(): Promise<Review[]> {
  return sortByCreatedAt(reviewStore).map(clone);
}

export async function getReviewsByPlaceId(placeId: string): Promise<Review[]> {
  const reviews = await getReviews();
  return reviews.filter((review) => review.placeId === placeId);
}

export async function getApprovedReviewsByPlaceId(placeId: string): Promise<Review[]> {
  const reviews = await getReviewsByPlaceId(placeId);
  return reviews.filter((review) => review.status === "approved");
}

export async function getPendingReviews(): Promise<Review[]> {
  const reviews = await getReviews();
  return reviews.filter((review) => review.status === "pending");
}

async function updateReviewStatus(id: string, status: ReviewStatus): Promise<Review | null> {
  const index = reviewStore.findIndex((review) => review.id === id);
  if (index < 0) {
    return null;
  }

  const updated: Review = {
    ...reviewStore[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  reviewStore[index] = updated;
  return clone(updated);
}

export async function approveReview(id: string): Promise<Review | null> {
  return updateReviewStatus(id, "approved");
}

export async function rejectReview(id: string): Promise<Review | null> {
  return updateReviewStatus(id, "rejected");
}

export async function archiveReview(id: string): Promise<Review | null> {
  return updateReviewStatus(id, "archived");
}

export async function createReview(input: ReviewInput): Promise<Review> {
  const now = new Date().toISOString();
  const created: Review = {
    ...input,
    id: createId(input.placeId),
    status: input.status ?? "pending",
    helpfulCount: input.helpfulCount ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  reviewStore = [created, ...reviewStore];
  return clone(created);
}

export const mockReviewRepository = {
  getReviews,
  getReviewsByPlaceId,
  getApprovedReviewsByPlaceId,
  getPendingReviews,
  approveReview,
  rejectReview,
  archiveReview,
  createReview,
};

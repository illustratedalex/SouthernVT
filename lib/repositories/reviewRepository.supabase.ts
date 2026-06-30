import type { Review } from "@/types/Review";
import type { ReviewInput } from "@/lib/repositories/reviewRepository.mock";

function notReady(functionName: string): never {
  throw new Error(`${functionName} is not implemented for Supabase yet.`);
}

export async function getReviews(): Promise<Review[]> {
  return notReady("getReviews");
}

export async function getReviewsByPlaceId(_placeId: string): Promise<Review[]> {
  return notReady("getReviewsByPlaceId");
}

export async function getApprovedReviewsByPlaceId(_placeId: string): Promise<Review[]> {
  return notReady("getApprovedReviewsByPlaceId");
}

export async function getPendingReviews(): Promise<Review[]> {
  return notReady("getPendingReviews");
}

export async function approveReview(_id: string): Promise<Review | null> {
  return notReady("approveReview");
}

export async function rejectReview(_id: string): Promise<Review | null> {
  return notReady("rejectReview");
}

export async function archiveReview(_id: string): Promise<Review | null> {
  return notReady("archiveReview");
}

export async function createReview(_input: ReviewInput): Promise<Review> {
  return notReady("createReview");
}

export const supabaseReviewRepository = {
  getReviews,
  getReviewsByPlaceId,
  getApprovedReviewsByPlaceId,
  getPendingReviews,
  approveReview,
  rejectReview,
  archiveReview,
  createReview,
};

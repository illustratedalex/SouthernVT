import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Review } from "@/types/Review";
import type { ReviewInput } from "@/lib/repositories/reviewRepository.mock";
import * as mockRepository from "@/lib/repositories/reviewRepository.mock";
import * as supabaseRepository from "@/lib/repositories/reviewRepository.supabase";

type ReviewRepositoryModule = {
  getReviews: () => Promise<Review[]>;
  getReviewsByPlaceId: (placeId: string) => Promise<Review[]>;
  getApprovedReviewsByPlaceId: (placeId: string) => Promise<Review[]>;
  getPendingReviews: () => Promise<Review[]>;
  approveReview: (id: string) => Promise<Review | null>;
  rejectReview: (id: string) => Promise<Review | null>;
  archiveReview: (id: string) => Promise<Review | null>;
  createReview: (input: ReviewInput) => Promise<Review>;
};

async function getActiveReviewRepository(): Promise<ReviewRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getReviews(): Promise<Review[]> {
  const repository = await getActiveReviewRepository();
  try {
    return await repository.getReviews();
  } catch {
    return mockRepository.getReviews();
  }
}

export async function getReviewsByPlaceId(placeId: string): Promise<Review[]> {
  const repository = await getActiveReviewRepository();
  try {
    return await repository.getReviewsByPlaceId(placeId);
  } catch {
    return mockRepository.getReviewsByPlaceId(placeId);
  }
}

export async function getApprovedReviewsByPlaceId(placeId: string): Promise<Review[]> {
  const repository = await getActiveReviewRepository();
  try {
    return await repository.getApprovedReviewsByPlaceId(placeId);
  } catch {
    return mockRepository.getApprovedReviewsByPlaceId(placeId);
  }
}

export async function getPendingReviews(): Promise<Review[]> {
  const repository = await getActiveReviewRepository();
  try {
    return await repository.getPendingReviews();
  } catch {
    return mockRepository.getPendingReviews();
  }
}

export async function getReviewById(id: string): Promise<Review | null> {
  const reviews = await getReviews();
  return reviews.find((review) => review.id === id) ?? null;
}

export async function approveReview(id: string): Promise<Review | null> {
  const repository = await getActiveReviewRepository();
  try {
    return await repository.approveReview(id);
  } catch {
    return mockRepository.approveReview(id);
  }
}

export async function rejectReview(id: string): Promise<Review | null> {
  const repository = await getActiveReviewRepository();
  try {
    return await repository.rejectReview(id);
  } catch {
    return mockRepository.rejectReview(id);
  }
}

export async function archiveReview(id: string): Promise<Review | null> {
  const repository = await getActiveReviewRepository();
  try {
    return await repository.archiveReview(id);
  } catch {
    return mockRepository.archiveReview(id);
  }
}

export async function createReview(input: ReviewInput): Promise<Review> {
  if (!input.placeId || !input.reviewerName || !input.title || !input.body) {
    throw new Error("Review is missing required fields.");
  }

  const repository = await getActiveReviewRepository();
  try {
    return await repository.createReview(input);
  } catch {
    return mockRepository.createReview(input);
  }
}

export async function updateReview(id: string, updates: Partial<ReviewInput>): Promise<Review | null> {
  const existing = await getReviewById(id);
  if (!existing) {
    return null;
  }

  const merged: Review = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return merged;
}

export const reviewRepository = {
  getAll: getReviews,
  getById: getReviewById,
  getByPlaceId: getReviewsByPlaceId,
  getApprovedByPlaceId: getApprovedReviewsByPlaceId,
  getPending: getPendingReviews,
  approve: approveReview,
  reject: rejectReview,
  archive: archiveReview,
  create: createReview,
  update: updateReview,
  getReviews,
  getReviewById,
  getReviewsByPlaceId,
  getApprovedReviewsByPlaceId,
  getPendingReviews,
  approveReview,
  rejectReview,
  archiveReview,
  createReview,
  updateReview,
};

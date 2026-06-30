import type { Deal } from "@/types/Deal";
import type { DealInput } from "@/lib/repositories/dealRepository.mock";

function notReady(functionName: string): never {
  throw new Error(`${functionName} is not implemented for Supabase yet.`);
}

export async function getDeals(): Promise<Deal[]> {
  return notReady("getDeals");
}

export async function getPublishedDeals(): Promise<Deal[]> {
  return notReady("getPublishedDeals");
}

export async function getFeaturedDeals(): Promise<Deal[]> {
  return notReady("getFeaturedDeals");
}

export async function getDealById(_id: string): Promise<Deal | null> {
  return notReady("getDealById");
}

export async function getDealBySlug(_slug: string): Promise<Deal | null> {
  return notReady("getDealBySlug");
}

export async function getDealsByPlaceId(_placeId: string): Promise<Deal[]> {
  return notReady("getDealsByPlaceId");
}

export async function createDeal(_input: DealInput): Promise<Deal> {
  return notReady("createDeal");
}

export async function updateDeal(_id: string, _updates: Partial<DealInput>): Promise<Deal | null> {
  return notReady("updateDeal");
}

export async function archiveDeal(_id: string): Promise<Deal | null> {
  return notReady("archiveDeal");
}

export const supabaseDealRepository = {
  getDeals,
  getPublishedDeals,
  getFeaturedDeals,
  getDealById,
  getDealBySlug,
  getDealsByPlaceId,
  createDeal,
  updateDeal,
  archiveDeal,
};

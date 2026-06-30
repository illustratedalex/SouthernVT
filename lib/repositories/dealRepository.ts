import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Deal } from "@/types/Deal";
import type { DealInput } from "@/lib/repositories/dealRepository.mock";
import * as mockRepository from "@/lib/repositories/dealRepository.mock";
import * as supabaseRepository from "@/lib/repositories/dealRepository.supabase";

type DealRepositoryModule = {
  getDeals: () => Promise<Deal[]>;
  getPublishedDeals: () => Promise<Deal[]>;
  getFeaturedDeals: () => Promise<Deal[]>;
  getDealById: (id: string) => Promise<Deal | null>;
  getDealBySlug: (slug: string) => Promise<Deal | null>;
  getDealsByPlaceId: (placeId: string) => Promise<Deal[]>;
  createDeal: (input: DealInput) => Promise<Deal>;
  updateDeal: (id: string, updates: Partial<DealInput>) => Promise<Deal | null>;
  archiveDeal: (id: string) => Promise<Deal | null>;
};

async function getActiveDealRepository(): Promise<DealRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getDeals(): Promise<Deal[]> {
  const repository = await getActiveDealRepository();
  try {
    return await repository.getDeals();
  } catch {
    return mockRepository.getDeals();
  }
}

export async function getPublishedDeals(): Promise<Deal[]> {
  const repository = await getActiveDealRepository();
  try {
    return await repository.getPublishedDeals();
  } catch {
    return mockRepository.getPublishedDeals();
  }
}

export async function getFeaturedDeals(): Promise<Deal[]> {
  const repository = await getActiveDealRepository();
  try {
    return await repository.getFeaturedDeals();
  } catch {
    return mockRepository.getFeaturedDeals();
  }
}

export async function getDealById(id: string): Promise<Deal | null> {
  const repository = await getActiveDealRepository();
  try {
    return await repository.getDealById(id);
  } catch {
    return mockRepository.getDealById(id);
  }
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  const repository = await getActiveDealRepository();
  try {
    return await repository.getDealBySlug(slug);
  } catch {
    return mockRepository.getDealBySlug(slug);
  }
}

export async function getDealsByPlaceId(placeId: string): Promise<Deal[]> {
  const repository = await getActiveDealRepository();
  try {
    return await repository.getDealsByPlaceId(placeId);
  } catch {
    return mockRepository.getDealsByPlaceId(placeId);
  }
}

export async function createDeal(input: DealInput): Promise<Deal> {
  const repository = await getActiveDealRepository();
  try {
    return await repository.createDeal(input);
  } catch {
    return mockRepository.createDeal(input);
  }
}

export async function updateDeal(id: string, updates: Partial<DealInput>): Promise<Deal | null> {
  const repository = await getActiveDealRepository();
  try {
    return await repository.updateDeal(id, updates);
  } catch {
    return mockRepository.updateDeal(id, updates);
  }
}

export async function archiveDeal(id: string): Promise<Deal | null> {
  const repository = await getActiveDealRepository();
  try {
    return await repository.archiveDeal(id);
  } catch {
    return mockRepository.archiveDeal(id);
  }
}

export const dealRepository = {
  getAll: getDeals,
  getPublished: getPublishedDeals,
  getFeatured: getFeaturedDeals,
  getById: getDealById,
  getBySlug: getDealBySlug,
  getByPlaceId: getDealsByPlaceId,
  create: createDeal,
  update: updateDeal,
  archive: archiveDeal,
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

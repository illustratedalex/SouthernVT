import { isFeatureEnabled } from "@/lib/featureFlags";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { BusinessOwner, PartnerDashboardStats } from "@/types/PartnerPortal";
import * as mockRepository from "@/lib/repositories/partnerPortalRepository.mock";
import * as supabaseRepository from "@/lib/repositories/partnerPortalRepository.supabase";

type PartnerPortalRepositoryModule = {
  getCurrentOwner: () => Promise<BusinessOwner>;
  getOwnerPlaces: (ownerId?: string) => Promise<Place[]>;
  getPartnerStats: (ownerId?: string) => Promise<PartnerDashboardStats>;
  getOwnerDeals: (ownerId?: string) => Promise<Deal[]>;
  getOwnerEvents: (ownerId?: string) => Promise<Event[]>;
};

async function getActivePartnerPortalRepository(): Promise<PartnerPortalRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  if (supabaseEnabled && hasSupabaseEnv()) {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getCurrentOwner(): Promise<BusinessOwner> {
  const repository = await getActivePartnerPortalRepository();
  try {
    return await repository.getCurrentOwner();
  } catch {
    return mockRepository.getCurrentOwner();
  }
}

export async function getOwnerPlaces(ownerId?: string): Promise<Place[]> {
  const repository = await getActivePartnerPortalRepository();
  try {
    return await repository.getOwnerPlaces(ownerId);
  } catch {
    return mockRepository.getOwnerPlaces(ownerId);
  }
}

export async function getPartnerStats(ownerId?: string): Promise<PartnerDashboardStats> {
  const repository = await getActivePartnerPortalRepository();
  try {
    return await repository.getPartnerStats(ownerId);
  } catch {
    return mockRepository.getPartnerStats(ownerId);
  }
}

export async function getOwnerDeals(ownerId?: string): Promise<Deal[]> {
  const repository = await getActivePartnerPortalRepository();
  try {
    return await repository.getOwnerDeals(ownerId);
  } catch {
    return mockRepository.getOwnerDeals(ownerId);
  }
}

export async function getOwnerEvents(ownerId?: string): Promise<Event[]> {
  const repository = await getActivePartnerPortalRepository();
  try {
    return await repository.getOwnerEvents(ownerId);
  } catch {
    return mockRepository.getOwnerEvents(ownerId);
  }
}

export const partnerPortalRepository = {
  getCurrentOwner,
  getOwnerPlaces,
  getPartnerStats,
  getOwnerDeals,
  getOwnerEvents,
};

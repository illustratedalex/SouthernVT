import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { BusinessOwner, PartnerDashboardStats } from "@/types/PartnerPortal";

function notReady(functionName: string): never {
  throw new Error(`${functionName} is not implemented for Supabase yet.`);
}

export async function getCurrentOwner(): Promise<BusinessOwner> {
  return notReady("getCurrentOwner");
}

export async function getOwnerPlaces(_ownerId?: string): Promise<Place[]> {
  return notReady("getOwnerPlaces");
}

export async function getPartnerStats(_ownerId?: string): Promise<PartnerDashboardStats> {
  return notReady("getPartnerStats");
}

export async function getOwnerDeals(_ownerId?: string): Promise<Deal[]> {
  return notReady("getOwnerDeals");
}

export async function getOwnerEvents(_ownerId?: string): Promise<Event[]> {
  return notReady("getOwnerEvents");
}

export const supabasePartnerPortalRepository = {
  getCurrentOwner,
  getOwnerPlaces,
  getPartnerStats,
  getOwnerDeals,
  getOwnerEvents,
};

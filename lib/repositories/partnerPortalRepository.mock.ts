import { mockPartnerDashboardStats, mockCurrentBusinessOwner } from "@/data/partnerPortal";
import { getDeals } from "@/repositories/DealRepository";
import { getEvents } from "@/repositories/EventRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { BusinessOwner, PartnerDashboardStats } from "@/types/PartnerPortal";

export async function getCurrentOwner(): Promise<BusinessOwner> {
  return { ...mockCurrentBusinessOwner, businessPlaceIds: [...mockCurrentBusinessOwner.businessPlaceIds] };
}

export async function getOwnerPlaces(ownerId?: string): Promise<Place[]> {
  const owner = ownerId && ownerId !== mockCurrentBusinessOwner.id ? null : await getCurrentOwner();
  if (!owner) {
    return [];
  }

  const places = await getPlaces();
  return places.filter((place) => owner.businessPlaceIds.includes(place.id));
}

export async function getPartnerStats(_ownerId?: string): Promise<PartnerDashboardStats> {
  return { ...mockPartnerDashboardStats };
}

export async function getOwnerDeals(ownerId?: string): Promise<Deal[]> {
  const ownerPlaces = await getOwnerPlaces(ownerId);
  const placeIds = new Set(ownerPlaces.map((place) => place.id));
  const deals = await getDeals();
  return deals.filter((deal) => placeIds.has(deal.placeId));
}

export async function getOwnerEvents(ownerId?: string): Promise<Event[]> {
  const ownerPlaces = await getOwnerPlaces(ownerId);
  const placeIds = new Set(ownerPlaces.map((place) => place.id));
  const events = await getEvents();
  return events.filter((event) => placeIds.has(event.venuePlaceId));
}

export const mockPartnerPortalRepository = {
  getCurrentOwner,
  getOwnerPlaces,
  getPartnerStats,
  getOwnerDeals,
  getOwnerEvents,
};

import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";

export type BusinessOwnerRole = "owner" | "manager" | "staff";

export interface BusinessOwner {
  id: string;
  name: string;
  email: string;
  businessPlaceIds: string[];
  role: BusinessOwnerRole;
  createdAt: string;
}

export interface PartnerDashboardStats {
  placeViews: number;
  dealRedemptions: number;
  passportCheckIns: number;
  upcomingEvents: number;
  profileCompleteness: number;
  profileViews?: number;
  passportVisits?: number;
  dealViews?: number;
}

export interface PartnerPortalActivityItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface PartnerPortalSnapshot {
  owner: BusinessOwner;
  places: Place[];
  stats: PartnerDashboardStats;
  deals: Deal[];
  events: Event[];
}

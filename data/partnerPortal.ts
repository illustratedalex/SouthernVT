import type { BusinessOwner, PartnerDashboardStats, PartnerPortalActivityItem } from "@/types/PartnerPortal";

export const mockCurrentBusinessOwner: BusinessOwner = {
  id: "owner-local-partner",
  name: "Local Partner",
  email: "partner@southernvt.com",
  businessPlaceIds: ["place-grafton-inn"],
  role: "owner",
  createdAt: "2026-06-01T09:00:00.000Z",
};

export const mockPartnerDashboardStats: PartnerDashboardStats = {
  placeViews: 1842,
  dealRedemptions: 126,
  passportCheckIns: 89,
  upcomingEvents: 2,
  profileCompleteness: 84,
  profileViews: 1842,
  passportVisits: 89,
  dealViews: 624,
};

export const mockPartnerRecentActivity: PartnerPortalActivityItem[] = [
  {
    id: "partner-activity-1",
    title: "Listing photo updated",
    description: "Main hero image was refreshed for better seasonal relevance.",
    createdAt: "2026-06-26T14:35:00.000Z",
  },
  {
    id: "partner-activity-2",
    title: "Deal performance summary",
    description: "Weekday discount was redeemed 18 times in the last 7 days.",
    createdAt: "2026-06-25T11:20:00.000Z",
  },
  {
    id: "partner-activity-3",
    title: "Event submission reviewed",
    description: "Upcoming food and antique weekend event is under editorial review.",
    createdAt: "2026-06-24T09:15:00.000Z",
  },
];

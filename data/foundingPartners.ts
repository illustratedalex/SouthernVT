import type { FoundingPartner, FoundingPartnerSlots } from "@/types/FoundingPartner";

export const foundingPartnerPublicSlots: FoundingPartnerSlots = {
  filled: 0,
  total: 25,
};

export const foundingPartnerInternalSlots: FoundingPartnerSlots = {
  filled: 4,
  total: 25,
};

export const foundingPartners: FoundingPartner[] = [
  {
    businessName: "Grafton Inn",
    contactName: "Mara Lowell",
    status: "active",
    monthlySupport: 50,
    notes: "Interested in seasonal stories and a profile refresh before summer travel ramps up.",
    nextFollowUpDate: "2026-07-10",
  },
  {
    businessName: "Vermont Country Store",
    contactName: "Ben Carter",
    status: "interested",
    monthlySupport: 50,
    notes: "Wants to review the founding partner overview and explore visibility opportunities.",
    nextFollowUpDate: "2026-07-08",
  },
  {
    businessName: "Bellows Falls business placeholder",
    contactName: "Priya Stone",
    status: "invited",
    monthlySupport: 50,
    notes: "Warm lead from the local business community; awaiting an intro call.",
    nextFollowUpDate: "2026-07-12",
  },
  {
    businessName: "Local café placeholder",
    contactName: "Elena Park",
    status: "declined",
    monthlySupport: 50,
    notes: "Not ready for beta support yet; keep in the nurture list for later.",
    nextFollowUpDate: "2026-07-18",
  },
  {
    businessName: "Brewery placeholder",
    contactName: "Jordan Miles",
    status: "active",
    monthlySupport: 75,
    notes: "Open to featured events, partner insights, and a stronger profile page.",
    nextFollowUpDate: "2026-07-09",
  },
];
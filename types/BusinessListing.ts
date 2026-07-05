export type BusinessListingStatus = "basic" | "claimed" | "verified" | "founding_partner" | "premium";

export type BusinessListingClaimStatus = "unclaimed" | "pending" | "claimed";

export type BusinessListingSource = "southernvt_seeded" | "owner_submitted" | "verified_by_southernvt";

export interface BusinessListing {
  id: string;
  name: string;
  slug: string;
  category: string;
  town: string;
  county: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  status: BusinessListingStatus;
  claimStatus: BusinessListingClaimStatus;
  source: BusinessListingSource;
  completenessScore: number;
  isFeatured: boolean;
  isFoundingPartner: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastReviewedAt: string;
}
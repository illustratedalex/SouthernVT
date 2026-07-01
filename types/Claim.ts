export type ClaimStatus = "pending" | "approved" | "rejected";

export type ClaimRelationship = "owner" | "manager" | "marketing" | "other";

export interface BusinessClaim {
  id: string;
  placeId: string;
  placeSlug: string;
  placeName: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  relationship: ClaimRelationship;
  message: string;
  certified: boolean;
  status: ClaimStatus;
  submittedAt: string;
  reviewedAt?: string;
}

export interface BusinessClaimInput {
  placeId: string;
  placeSlug: string;
  placeName: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  relationship: ClaimRelationship;
  message: string;
  certified: boolean;
}

export type ClaimStatus = "pending" | "approved" | "rejected";

export type ClaimRelationship = "owner" | "manager" | "editor" | "other";

export interface BusinessClaim {
  id: string;
  businessListingId: string;
  businessSlug: string;
  businessName: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  roleAtBusiness: ClaimRelationship | string;
  proofMessage: string;
  status: ClaimStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface BusinessClaimInput {
  businessListingId: string;
  businessSlug: string;
  businessName: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  roleAtBusiness: ClaimRelationship | string;
  proofMessage: string;
}

export interface ClaimReviewInput {
  status: Extract<ClaimStatus, "approved" | "rejected">;
  reviewNotes?: string;
}

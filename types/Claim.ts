export type ClaimStatus = "pending" | "approved" | "rejected";

export type ClaimRelationship = "owner" | "manager" | "editor" | "other";

export interface BusinessClaim {
  id: string;
  businessListingId: string;
  businessSlug: string;
  businessName: string;
  listingUrl: string;
  contactName: string;
  role: ClaimRelationship | string;
  email: string;
  phone: string;
  website: string;
  requestedUpdates: string;
  verificationNotes: string;
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
  listingUrl: string;
  contactName: string;
  role: ClaimRelationship | string;
  email: string;
  phone: string;
  website: string;
  requestedUpdates: string;
  verificationNotes: string;
  honeypot?: string;
}

export interface ClaimReviewInput {
  status: Extract<ClaimStatus, "approved" | "rejected">;
  reviewNotes?: string;
}

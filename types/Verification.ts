export type VerificationLevel =
  | "location_verified"
  | "photo_verified"
  | "personally_visited"
  | "southernvt_recommended";

export type VerificationStatus = "unverified" | "partial" | "verified" | "expired" | "review_needed";

export interface VerificationHistoryItem {
  id: string;
  date: string;
  action: string;
  level?: VerificationLevel;
  verifiedBy: string;
  note: string;
}

export interface VerificationRecord {
  id: string;
  placeId: string;
  levels: VerificationLevel[];
  status: VerificationStatus;
  verifiedBy: string;
  verifiedAt: string;
  expiresAt?: string;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  notes?: string;
  history: VerificationHistoryItem[];
}


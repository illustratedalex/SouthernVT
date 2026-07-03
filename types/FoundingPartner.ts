export type FoundingPartnerStatus = "invited" | "interested" | "active" | "declined";

export interface FoundingPartner {
  businessName: string;
  contactName: string;
  status: FoundingPartnerStatus;
  monthlySupport: number;
  notes: string;
  nextFollowUpDate: string;
}

export interface FoundingPartnerSlots {
  filled: number;
  total: number;
}
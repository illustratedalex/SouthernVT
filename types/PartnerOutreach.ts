export type RelationshipStrength = "new" | "know_them" | "friend" | "existing_customer";

export type OutreachStatus =
  | "idea"
  | "contacted"
  | "meeting_scheduled"
  | "demo_given"
  | "interested"
  | "follow_up"
  | "founding_partner"
  | "not_interested";

export interface OutreachBusiness {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  relationshipStrength: RelationshipStrength;
  status: OutreachStatus;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  requestedFeatures: string[];
  potentialFitScore: number;
}

export interface OutreachConversationEvent {
  id: string;
  businessId: string;
  date: string;
  title: string;
  detail: string;
}

export type ReadinessCriteria =
  | "heroPhoto"
  | "gallery"
  | "businessStory"
  | "ownerMessage"
  | "website"
  | "phone"
  | "hours"
  | "deals"
  | "events"
  | "collections"
  | "guides"
  | "verification"
  | "photos"
  | "seasonalContent";

export type ReadinessCriteriaStatus = "missing" | "present";

export interface ReadinessCriteriaItem {
  id: ReadinessCriteria;
  label: string;
  description: string;
  status: ReadinessCriteriaStatus;
  weight: number;
}

export interface PartnerReadinessScore {
  businessId: string;
  businessName: string;
  overallScore: number;
  percentComplete: number;
  criteria: ReadinessCriteriaItem[];
  missingItems: ReadinessCriteriaItem[];
  recommendedActions: string[];
  lastUpdated: string;
}

export interface PartnerValueMetric {
  label: string;
  value: number;
  unit: string;
  description?: string;
}

export interface PartnerValueSummary {
  businessId: string;
  businessName: string;
  metrics: PartnerValueMetric[];
  totalMentions: number;
  appearsInCollections: number;
  mentionedInGuides: number;
  shownInRecommendations: number;
  websiteClicks: number;
  lastUpdated: string;
}

export interface PartnerInsight {
  profileViews: number;
  websiteClicks: number;
  phoneClicks: number;
  directionsClicks: number;
  savedToTrips: number;
  passportCheckIns: number;
  dealViews: number;
  collectionAppearances: number;
  guideMentions: number;
  searchImpressions: number;
  topSearchTerms: string[];
}

export type FeatureFlagKey =
  | "aiPlanner"
  | "passport"
  | "reviews"
  | "weather"
  | "analytics"
  | "mapbox"
  | "supabase"
  | "businessPortal"
  | "events"
  | "publicCollections"
  | "publicPlaces";

export type FeatureFlagEnvironment = "development" | "staging" | "production";

export interface FeatureFlag {
  key: FeatureFlagKey;
  label: string;
  description: string;
  enabled: boolean;
  environment: FeatureFlagEnvironment;
  createdAt: string;
  updatedAt: string;
}

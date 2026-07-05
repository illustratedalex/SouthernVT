import { southernVT100Destinations } from "@/data/southernvt100";

export type CoverageBadgeKey = "core" | "worth_the_drive" | "regional_feature";

export type CoverageBadge = {
  key: CoverageBadgeKey;
  label: "Core Southern Vermont" | "Worth the Drive" | "Regional Feature";
  icon: "📍" | "🚗" | "🗺";
  badgeVariant: "forest" | "featured" | "amber";
};

const coverageBySlug = new Map(
  southernVT100Destinations.map((destination) => [destination.slug, destination.coverage]),
);

const overrideCoverage: Record<string, CoverageBadgeKey> = {
  "mount-equinox-skyline-drive": "regional_feature",
  "bellows-falls-downtown": "regional_feature",
  "vermont-country-store": "worth_the_drive",
};

const BADGES: Record<CoverageBadgeKey, CoverageBadge> = {
  core: {
    key: "core",
    label: "Core Southern Vermont",
    icon: "📍",
    badgeVariant: "forest",
  },
  worth_the_drive: {
    key: "worth_the_drive",
    label: "Worth the Drive",
    icon: "🚗",
    badgeVariant: "featured",
  },
  regional_feature: {
    key: "regional_feature",
    label: "Regional Feature",
    icon: "🗺",
    badgeVariant: "amber",
  },
};

function toCoverageBadgeKey(coverage: string | undefined): CoverageBadgeKey {
  if (coverage === "Worth the Drive") {
    return "worth_the_drive";
  }

  if (coverage === "Regional Feature") {
    return "regional_feature";
  }

  return "core";
}

export function getCoverageBadgeForPlace(place: { slug: string; state?: string }): CoverageBadge {
  const override = overrideCoverage[place.slug];
  if (override) {
    return BADGES[override];
  }

  const fromSouthernVT100 = coverageBySlug.get(place.slug);
  if (fromSouthernVT100) {
    return BADGES[toCoverageBadgeKey(fromSouthernVT100)];
  }

  if (place.state && place.state.toUpperCase() !== "VT") {
    return BADGES.worth_the_drive;
  }

  return BADGES.core;
}

export const coverageBadgeExamples = [
  BADGES.core,
  BADGES.worth_the_drive,
  BADGES.regional_feature,
] as const;

import type { PartnerReadinessScore, ReadinessCriteria, ReadinessCriteriaItem } from "@/types/PartnerReadiness";
import type { Place } from "@/types/Place";

const readinessCriteria: ReadinessCriteria[] = [
  "heroPhoto",
  "gallery",
  "businessStory",
  "ownerMessage",
  "website",
  "phone",
  "hours",
  "deals",
  "events",
  "collections",
  "guides",
  "verification",
  "photos",
  "seasonalContent",
];

const criteriaConfig: Record<ReadinessCriteria, { label: string; description: string; weight: number }> = {
  heroPhoto: {
    label: "Hero Photo",
    description: "Main business image in high quality",
    weight: 10,
  },
  gallery: {
    label: "Gallery",
    description: "Multiple images showcasing the business",
    weight: 8,
  },
  businessStory: {
    label: "Business Story",
    description: "Detailed description of your business",
    weight: 12,
  },
  ownerMessage: {
    label: "Owner Message",
    description: "Personal message from the business owner",
    weight: 7,
  },
  website: {
    label: "Website",
    description: "Link to your business website",
    weight: 8,
  },
  phone: {
    label: "Phone",
    description: "Business phone number",
    weight: 9,
  },
  hours: {
    label: "Hours",
    description: "Operating hours and availability",
    weight: 10,
  },
  deals: {
    label: "Deals",
    description: "Promotional offers and discounts",
    weight: 6,
  },
  events: {
    label: "Events",
    description: "Upcoming events and programs",
    weight: 6,
  },
  collections: {
    label: "Collections",
    description: "Featured in SouthernVT collections",
    weight: 5,
  },
  guides: {
    label: "Guides",
    description: "Mentioned in SouthernVT guides",
    weight: 5,
  },
  verification: {
    label: "Verification",
    description: "Verified by SouthernVT",
    weight: 9,
  },
  photos: {
    label: "Recent Photos",
    description: "Seasonal and up-to-date imagery",
    weight: 7,
  },
  seasonalContent: {
    label: "Seasonal Content",
    description: "Content updated for current season",
    weight: 6,
  },
};

export function calculatePartnerReadinessScore(place: Place): PartnerReadinessScore {
  const criteria: ReadinessCriteriaItem[] = [];
  let totalWeight = 0;
  let completedWeight = 0;

  for (const criterion of readinessCriteria) {
    const config = criteriaConfig[criterion];
    totalWeight += config.weight;

    const status = evaluateCriterion(criterion, place);
    if (status === "present") {
      completedWeight += config.weight;
    }

    criteria.push({
      id: criterion,
      label: config.label,
      description: config.description,
      status,
      weight: config.weight,
    });
  }

  const percentComplete = Math.round((completedWeight / totalWeight) * 100);

  const missingItems = criteria.filter((c) => c.status === "missing");
  const recommendedActions = generateRecommendedActions(missingItems);

  return {
    businessId: place.id,
    businessName: place.name,
    overallScore: percentComplete,
    percentComplete,
    criteria,
    missingItems,
    recommendedActions,
    lastUpdated: new Date().toISOString(),
  };
}

function evaluateCriterion(criterion: ReadinessCriteria, place: Place): "present" | "missing" {
  switch (criterion) {
    case "heroPhoto":
      return place.featuredImage ? "present" : "missing";
    case "gallery":
      return place.gallery && place.gallery.length > 0 ? "present" : "missing";
    case "businessStory":
      return place.description && place.description.length > 100 ? "present" : "missing";
    case "ownerMessage":
      return place.ownerMessage ? "present" : "missing";
    case "website":
      return place.website ? "present" : "missing";
    case "phone":
      return place.phone ? "present" : "missing";
    case "hours":
      return place.hours ? "present" : "missing";
    case "deals":
      return place.featured ? "present" : "missing";
    case "events":
      return place.tags && place.tags.some((t) => t.toLowerCase().includes("event")) ? "present" : "missing";
    case "collections":
      return place.categories && place.categories.length > 1 ? "present" : "missing";
    case "guides":
      return place.tags && place.tags.length > 0 ? "present" : "missing";
    case "verification":
      return place.verifiedBusiness ? "present" : "missing";
    case "photos":
      return place.gallery && place.gallery.length >= 3 ? "present" : "missing";
    case "seasonalContent":
      return place.businessGallery && place.businessGallery.length > 0 ? "present" : "missing";
    default:
      return "missing";
  }
}

function generateRecommendedActions(missingItems: ReadinessCriteriaItem[]): string[] {
  const actions: string[] = [];

  const priorityMap: Record<string, number> = {
    "Business Story": 1,
    "Hero Photo": 2,
    Verification: 3,
    Hours: 4,
    Phone: 5,
    Website: 6,
    Deals: 7,
    Events: 8,
    Gallery: 9,
    "Owner Message": 10,
    Collections: 11,
    Guides: 12,
    "Recent Photos": 13,
    "Seasonal Content": 14,
  };

  const sorted = [...missingItems].sort((a, b) => (priorityMap[a.label] || 999) - (priorityMap[b.label] || 999));

  for (const item of sorted.slice(0, 5)) {
    actions.push(`Add ${item.label.toLowerCase()}`);
  }

  return actions;
}

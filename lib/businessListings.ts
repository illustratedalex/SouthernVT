import { basicBusinessListings } from "@/data/basicBusinessListings";
import type { BusinessListing, BusinessListingClaimStatus, BusinessListingStatus } from "@/types/BusinessListing";

const categoryIcons: Record<string, string> = {
  Attraction: "📍",
  Bakery: "🥐",
  Brewery: "🍺",
  Cafe: "☕",
  Campground: "⛺",
  Distillery: "🥃",
  "Farm Stand": "🥕",
  Gallery: "🖼️",
  "General Store": "🛒",
  Lodging: "🏨",
  Museum: "🏛️",
  "Outdoor Recreation": "🥾",
  Restaurant: "🍽️",
  Shopping: "🛍️",
  Winery: "🍷",
};

const requiredBusinessFilters = [
  "Lodging",
  "Restaurant",
  "Cafe",
  "Brewery",
  "Shopping",
  "Gallery",
  "Campground",
  "Attraction",
  "Services",
  "Stays",
] as const;

const stayCategories = new Set([
  "Lodging",
  "Campground",
  "Inn",
  "Motel",
  "Bed & Breakfast",
  "Cabin",
  "Vacation Rental",
  "Unique Stay",
  "Stays",
]);

const directFilterCategories = new Set<string>(
  requiredBusinessFilters.filter((category) => category !== "Services" && category !== "Stays"),
);
const serviceCategories = new Set(["Bakery", "Distillery", "Farm Stand", "General Store", "Museum", "Outdoor Recreation", "Winery"]);

export function getBusinessListings() {
  return basicBusinessListings;
}

export function getBusinessListingBySlug(slug: string) {
  return basicBusinessListings.find((listing) => listing.slug === slug) ?? null;
}

export function getBusinessListingTowns() {
  return [...new Set(basicBusinessListings.map((listing) => listing.town))].sort((left, right) => left.localeCompare(right));
}

export function getBusinessListingCategories() {
  return [...new Set(basicBusinessListings.map((listing) => listing.category))].sort((left, right) => left.localeCompare(right));
}

export function getBusinessListingFilterCategories() {
  const discoveredCategories = getBusinessListingCategories();
  const extras = discoveredCategories.filter(
    (category) =>
      !requiredBusinessFilters.includes(category as (typeof requiredBusinessFilters)[number]) &&
      !stayCategories.has(category) &&
      !serviceCategories.has(category),
  );

  return [...requiredBusinessFilters, ...extras];
}

export function getBusinessListingCategoryIcon(category: string) {
  return categoryIcons[category] ?? "📌";
}

export function filterBusinessListings(listings: BusinessListing[], filters: {
  town?: string;
  category?: string;
  claimed?: string;
  verified?: string;
  foundingPartner?: string;
}) {
  const selectedCategory = filters.category?.trim() ?? "";

  const matchesFilterCategory = (listing: BusinessListing) => {
    if (!selectedCategory || selectedCategory === "All") {
      return true;
    }

    if (selectedCategory === "Stays") {
      return stayCategories.has(listing.category);
    }

    if (selectedCategory === "Services") {
      return serviceCategories.has(listing.category);
    }

    if (directFilterCategories.has(selectedCategory)) {
      return listing.category === selectedCategory;
    }

    return listing.category === selectedCategory;
  };

  return listings.filter((listing) => {
    const matchesTown = !filters.town || filters.town === "All" || listing.town === filters.town;
    const matchesCategory = matchesFilterCategory(listing);
    const matchesClaimed = filters.claimed !== "true" || listing.claimStatus === "claimed";
    const matchesVerified = filters.verified !== "true" || listing.isVerified;
    const matchesFoundingPartner = filters.foundingPartner !== "true" || listing.isFoundingPartner;

    return matchesTown && matchesCategory && matchesClaimed && matchesVerified && matchesFoundingPartner;
  });
}

export function getBusinessListingStatusLabel(status: BusinessListingStatus) {
  switch (status) {
    case "basic":
      return "Basic Listing";
    case "claimed":
      return "Claimed by Owner";
    case "verified":
      return "Verified by SouthernVT";
    case "founding_partner":
      return "Founding Partner";
    case "premium":
      return "Premium";
    default:
      return status;
  }
}

export function getBusinessListingClaimLabel(claimStatus: BusinessListingClaimStatus) {
  switch (claimStatus) {
    case "unclaimed":
      return "Unclaimed";
    case "pending":
      return "Claim Pending";
    case "claimed":
      return "Claimed";
    default:
      return claimStatus;
  }
}

export function getBusinessListingDescription(status: BusinessListingStatus) {
  switch (status) {
    case "basic":
      return "Created by SouthernVT from publicly available or submitted information. May be incomplete.";
    case "claimed":
      return "Business owner has claimed the profile.";
    case "verified":
      return "SouthernVT has reviewed or verified key details.";
    case "founding_partner":
      return "Business is helping support SouthernVT during beta.";
    case "premium":
      return "Premium directory profile.";
    default:
      return "";
  }
}

export function getBusinessListingStatusTone(status: BusinessListingStatus) {
  switch (status) {
    case "basic":
      return "subtle" as const;
    case "claimed":
      return "forest" as const;
    case "verified":
      return "amber" as const;
    case "founding_partner":
      return "featured" as const;
    case "premium":
      return "default" as const;
    default:
      return "subtle" as const;
  }
}
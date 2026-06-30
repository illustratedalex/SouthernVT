import type { CompletenessItem, CompletenessScore } from "@/types/Completeness";
import type { Place } from "@/types/Place";

function hasText(value: string) {
  return value.trim().length > 0;
}

function hasCoordinates(place: Place) {
  return Number.isFinite(place.latitude) && Number.isFinite(place.longitude);
}

function buildItem(key: string, label: string, points: number, completed: boolean, description: string): CompletenessItem {
  return {
    key,
    label,
    points,
    completed,
    description,
  };
}

export function calculatePlaceCompleteness(place: Place): CompletenessScore {
  const items: CompletenessItem[] = [
    buildItem("name", "Name", 5, hasText(place.name), "A clear place name is required."),
    buildItem("description", "Description", 10, hasText(place.description), "Add descriptive context for visitors."),
    buildItem("placeType", "Place Type", 5, hasText(place.placeType), "Select a place type for filtering and badges."),
    buildItem(
      "location",
      "Address or coordinates",
      10,
      hasText(place.address) || hasCoordinates(place),
      "Provide either a street address or valid map coordinates.",
    ),
    buildItem("featuredImage", "Featured Image", 15, hasText(place.featuredImage), "A hero image is needed for cards and detail pages."),
    buildItem("gallery", "Gallery (3+ images)", 15, place.gallery.length >= 3, "Add at least three gallery images."),
    buildItem("categories", "Categories", 5, place.categories.length > 0, "Assign one or more categories."),
    buildItem("tags", "Tags", 5, place.tags.length > 0, "Add tags for search and curation."),
    buildItem("amenities", "Amenities", 5, place.amenities.length > 0, "Capture key amenities visitors expect."),
    buildItem(
      "contact",
      "Hours/contact/website",
      5,
      hasText(place.hours) || hasText(place.phone) || hasText(place.email) || hasText(place.website),
      "Provide hours, contact info, or website details.",
    ),
    buildItem("relationships", "Related Places", 10, place.relatedPlaces.length > 0, "Link related places for trip planning and discovery."),
    buildItem(
      "seo",
      "SEO title/description",
      10,
      hasText(place.seoTitle) && hasText(place.seoDescription),
      "Set both SEO title and description.",
    ),
  ];

  const maxScore = items.reduce((sum, item) => sum + item.points, 0);
  const score = items.reduce((sum, item) => (item.completed ? sum + item.points : sum), 0);
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const missingItems = items.filter((item) => !item.completed);

  return {
    contentType: "place",
    contentId: place.id,
    score,
    maxScore,
    percentage,
    items,
    missingItems,
  };
}

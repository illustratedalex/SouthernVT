import type { Collection } from "@/types/Collection";
import type { Place } from "@/types/Place";

export type MapCategory = string;

export interface MapFiltersState {
  search: string;
  placeTypes: string[];
  categories: string[];
  amenities: string[];
  featuredOnly: boolean;
  openNow: boolean;
  season: string;
}

export function getPublishedPlaces(places: Place[]) {
  return places.filter((place) => place.status === "published");
}

export function filterPlaces(places: Place[], filters: MapFiltersState): Place[] {
  return places.filter((place) => {
    const searchHaystack = [
      place.name,
      place.description,
      place.city,
      place.placeType,
      ...place.categories,
      ...place.tags,
      ...place.amenities,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !filters.search || searchHaystack.includes(filters.search.toLowerCase());
    const matchesType = !filters.placeTypes.length || filters.placeTypes.includes(place.placeType);
    const matchesCategory = !filters.categories.length || filters.categories.some((category) => place.categories.includes(category));
    const matchesAmenities = !filters.amenities.length || filters.amenities.every((amenity) => place.amenities.includes(amenity));
    const matchesFeatured = !filters.featuredOnly || place.featured;

    // Placeholder until live hours parsing exists.
    const matchesOpenNow = !filters.openNow || Boolean(place.hours);

    const seasonNeedle = filters.season.toLowerCase();
    const matchesSeason =
      !filters.season ||
      filters.season === "All" ||
      place.tags.some((tag) => tag.toLowerCase().includes(seasonNeedle)) ||
      place.categories.some((category) => category.toLowerCase().includes(seasonNeedle));

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesAmenities &&
      matchesFeatured &&
      matchesOpenNow &&
      matchesSeason
    );
  });
}

export function getFilterOptions(places: Place[]) {
  const placeTypes = [...new Set(places.map((place) => place.placeType))].sort((a, b) => a.localeCompare(b));
  const categories = [...new Set(places.flatMap((place) => place.categories))].sort((a, b) => a.localeCompare(b));
  const amenities = [...new Set(places.flatMap((place) => place.amenities))].sort((a, b) => a.localeCompare(b));

  return {
    placeTypes,
    categories,
    amenities,
    seasons: ["All", "Spring", "Summer", "Fall", "Winter"],
  };
}

export function getCollectionsForPlace(placeId: string, collections: Collection[]) {
  return collections.filter((collection) => collection.status === "published" && collection.places.includes(placeId));
}

export function getNearbyPlaces(target: Place, allPlaces: Place[], limit = 4) {
  return allPlaces
    .filter((place) => place.id !== target.id)
    .map((place) => ({ place, distance: haversineMiles(target.latitude, target.longitude, place.latitude, place.longitude) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

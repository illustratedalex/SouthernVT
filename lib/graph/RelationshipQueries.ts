import { getRelationshipLabel, getRelationshipGraph } from "@/lib/graph/RelationshipGraph";
import {
  findEntityBySlug,
  getConnectedEntities,
  getMissingRelationshipTypes,
} from "@/lib/graph/RelationshipResolver";
import type { RelationshipGraphEntity, RelationshipType } from "@/types/RelationshipGraph";

export interface RelationshipSuggestion {
  id: string;
  name: string;
  type: RelationshipGraphEntity["type"];
  href: string;
  reason: string;
}

export interface BusinessRelationshipSnapshot {
  nearbyAttractions: RelationshipSuggestion[];
  relatedCollections: RelationshipSuggestion[];
  upcomingEvents: RelationshipSuggestion[];
}

export interface RelationshipOpportunity {
  place: string;
  missing: string[];
}

function toSuggestion(connection: ReturnType<typeof getConnectedEntities>[number]): RelationshipSuggestion {
  const target = connection.direction === "outgoing" ? connection.to : connection.from;
  return {
    id: target.id,
    name: target.name,
    type: target.type,
    href: target.href ?? "#",
    reason: getRelationshipLabel(connection.relationship.type),
  };
}

export function getSuggestedNextStopsForPlace(placeSlug: string, limit = 4) {
  const place = findEntityBySlug("place", placeSlug);
  if (!place) {
    return [];
  }

  return getConnectedEntities(place.id, {
    targetTypes: ["place", "business", "event", "collection"],
    relationshipTypes: [
      "recommended_after",
      "recommended_before",
      "near",
      "best_with",
      "food_nearby",
      "coffee_nearby",
      "lodging_nearby",
      "shopping_nearby",
      "related",
      "hidden_gem",
    ],
    limit,
  }).map(toSuggestion);
}

export function getBusinessRelationshipSnapshot(businessSlug: string): BusinessRelationshipSnapshot {
  const business = findEntityBySlug("business", businessSlug);
  if (!business) {
    return {
      nearbyAttractions: [],
      relatedCollections: [],
      upcomingEvents: [],
    };
  }

  const nearbyAttractions = getConnectedEntities(business.id, {
    targetTypes: ["place"],
    relationshipTypes: ["near", "inside", "hidden_gem", "family_friendly", "dog_friendly", "photography", "camping", "historic"],
    limit: 4,
  }).map(toSuggestion);

  const relatedCollections = getConnectedEntities(business.id, {
    targetTypes: ["collection"],
    relationshipTypes: ["related", "best_with", "food_nearby", "coffee_nearby", "lodging_nearby", "shopping_nearby"],
    limit: 4,
  }).map(toSuggestion);

  const upcomingEvents = getConnectedEntities(business.id, {
    targetTypes: ["event"],
    relationshipTypes: ["related", "recommended_after", "recommended_before", "inside", "near"],
    limit: 4,
  }).map(toSuggestion);

  return {
    nearbyAttractions,
    relatedCollections,
    upcomingEvents,
  };
}

export function getRelatedBusinessesForCollection(collectionSlug: string, limit = 6) {
  const collection = findEntityBySlug("collection", collectionSlug);
  if (!collection) {
    return [];
  }

  return getConnectedEntities(collection.id, {
    targetTypes: ["business"],
    relationshipTypes: ["related", "food_nearby", "coffee_nearby", "lodging_nearby", "shopping_nearby", "family_friendly", "dog_friendly"],
    limit,
  }).map(toSuggestion);
}

export function getRelationshipOpportunities(limit = 4): RelationshipOpportunity[] {
  const graph = getRelationshipGraph();
  const places = graph.entities.filter((entity) => entity.type === "place");

  const requiredForPlace: RelationshipType[] = ["coffee_nearby", "lodging_nearby", "winter", "photography"];
  const fallbackLabels: Record<RelationshipType, string> = {
    near: "Near",
    inside: "Inside",
    related: "Related",
    recommended_after: "Recommended After",
    recommended_before: "Recommended Before",
    best_with: "Best With",
    hidden_gem: "Hidden Gem",
    family_friendly: "Family Friendly",
    dog_friendly: "Dog Friendly",
    photography: "Photography",
    camping: "Camping",
    historic: "Historic",
    food_nearby: "Food Nearby",
    coffee_nearby: "Coffee Nearby",
    lodging_nearby: "Nearby Lodging",
    shopping_nearby: "Shopping Nearby",
    rainy_day: "Rainy Day",
    fall_foliage: "Fall Foliage",
    winter: "Winter Story",
    summer: "Summer",
  };

  return places
    .map((place) => {
      const missingTypes = getMissingRelationshipTypes(place.id, requiredForPlace);
      const missing = missingTypes.map((type) => {
        if (place.id === "place-hamilton-falls" && type === "photography") {
          return "Drone Gallery";
        }
        return fallbackLabels[type];
      });
      return {
        place: place.name,
        missing,
      };
    })
    .filter((entry) => entry.missing.length > 0)
    .slice(0, limit);
}

export function getRelationshipExplorerGraph() {
  return getRelationshipGraph();
}

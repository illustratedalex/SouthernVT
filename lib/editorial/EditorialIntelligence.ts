import { collectionStoryMap, mockStories, placeStoryMap } from "@/data/stories";
import { mockVerifications } from "@/data/verifications";
import { getRelationshipGraph } from "@/lib/graph/RelationshipGraph";
import { getConnectionsForEntity, getMissingRelationshipTypes } from "@/lib/graph/RelationshipResolver";
import type { RelationshipGraphEntity, RelationshipType } from "@/types/RelationshipGraph";

export interface EditorialOpportunity {
  entityId: string;
  entityName: string;
  entityType: RelationshipGraphEntity["type"];
  href: string;
  missing: string[];
  priority: number;
}

function parseReadingMinutes(readingTime: string) {
  const firstToken = readingTime.split(" ")[0];
  const parsed = Number.parseInt(firstToken, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getEntityHref(entity: RelationshipGraphEntity) {
  return entity.href ?? "#";
}

function getPlaces() {
  const graph = getRelationshipGraph();
  return graph.entities.filter((entity) => entity.type === "place");
}

function getCollections() {
  const graph = getRelationshipGraph();
  return graph.entities.filter((entity) => entity.type === "collection");
}

function mapMissingRelationshipLabel(type: RelationshipType) {
  if (type === "coffee_nearby") {
    return "Coffee Nearby";
  }
  if (type === "lodging_nearby") {
    return "Nearby Inn";
  }
  if (type === "winter") {
    return "Winter Gallery";
  }
  if (type === "photography") {
    return "Drone Orbit";
  }
  if (type === "food_nearby") {
    return "Food Nearby";
  }
  if (type === "shopping_nearby") {
    return "Shopping Nearby";
  }
  if (type === "summer") {
    return "Summer Story";
  }
  if (type === "fall_foliage") {
    return "Fall Foliage Story";
  }
  if (type === "rainy_day") {
    return "Rainy Day Coverage";
  }
  return "Relationship Gap";
}

function scoreOpportunity(missingCount: number, boost = 0) {
  return missingCount * 20 + boost;
}

export function findMissingRelationships(limit = 8): EditorialOpportunity[] {
  const required: RelationshipType[] = ["coffee_nearby", "lodging_nearby", "winter", "photography"];

  return getPlaces()
    .map((place) => {
      const missing = getMissingRelationshipTypes(place.id, required).map(mapMissingRelationshipLabel);
      return {
        entityId: place.id,
        entityName: place.name,
        entityType: place.type,
        href: getEntityHref(place),
        missing,
        priority: scoreOpportunity(missing.length, place.slug === "hamilton-falls" ? 10 : 0),
      };
    })
    .filter((entry) => entry.missing.length > 0)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, limit);
}

export function findWeakStories(limit = 8): EditorialOpportunity[] {
  const byStoryId = new Map(mockStories.map((story) => [story.id, story]));

  const placeEntries = getPlaces().map((entity) => ({ entity, storyId: placeStoryMap[entity.id] }));
  const collectionEntries = getCollections().map((entity) => ({ entity, storyId: collectionStoryMap[entity.id] }));

  return [...placeEntries, ...collectionEntries]
    .map(({ entity, storyId }) => {
      const missing: string[] = [];
      const story = storyId ? byStoryId.get(storyId) : undefined;
      if (!story) {
        missing.push("Missing Story");
      } else {
        if (story.body.trim().length < 450) {
          missing.push("Thin Narrative");
        }
        if (parseReadingMinutes(story.readingTime) < 4) {
          missing.push("Short Story Coverage");
        }
        if (story.photographyTips.length < 3) {
          missing.push("Photo Direction Needed");
        }
      }

      return {
        entityId: entity.id,
        entityName: entity.name,
        entityType: entity.type,
        href: getEntityHref(entity),
        missing,
        priority: scoreOpportunity(missing.length),
      };
    })
    .filter((entry) => entry.missing.length > 0)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, limit);
}

export function findMissingPhotography(limit = 8): EditorialOpportunity[] {
  const required: RelationshipType[] = ["photography", "winter"];
  return getPlaces()
    .map((place) => {
      const missing = getMissingRelationshipTypes(place.id, required).map(mapMissingRelationshipLabel);
      return {
        entityId: place.id,
        entityName: place.name,
        entityType: place.type,
        href: getEntityHref(place),
        missing,
        priority: scoreOpportunity(missing.length, place.slug === "hamilton-falls" ? 10 : 0),
      };
    })
    .filter((entry) => entry.missing.length > 0)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, limit);
}

export function findMissingBusinesses(limit = 8): EditorialOpportunity[] {
  const required: RelationshipType[] = ["coffee_nearby", "food_nearby", "lodging_nearby"];
  return getPlaces()
    .map((place) => {
      const outgoing = getConnectionsForEntity(place.id).filter((connection) => connection.direction === "outgoing");
      const businessTypesPresent = new Set(
        outgoing
          .filter((connection) => connection.to.type === "business")
          .map((connection) => connection.relationship.type),
      );

      const missing = required
        .filter((type) => !businessTypesPresent.has(type))
        .map(mapMissingRelationshipLabel);

      return {
        entityId: place.id,
        entityName: place.name,
        entityType: place.type,
        href: getEntityHref(place),
        missing,
        priority: scoreOpportunity(missing.length),
      };
    })
    .filter((entry) => entry.missing.length > 0)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, limit);
}

export function findMissingCollections(limit = 8): EditorialOpportunity[] {
  return getPlaces()
    .map((place) => {
      const hasCollectionLink = getConnectionsForEntity(place.id).some(
        (connection) =>
          connection.direction === "outgoing" &&
          connection.to.type === "collection" &&
          connection.relationship.type === "related",
      );

      return {
        entityId: place.id,
        entityName: place.name,
        entityType: place.type,
        href: getEntityHref(place),
        missing: hasCollectionLink ? [] : ["Related Collection"],
        priority: hasCollectionLink ? 0 : 20,
      };
    })
    .filter((entry) => entry.missing.length > 0)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, limit);
}

export function findVerificationOpportunities(limit = 8): EditorialOpportunity[] {
  const verificationByPlaceId = new Map(mockVerifications.map((record) => [record.placeId, record]));
  return getPlaces()
    .map((place) => {
      const record = verificationByPlaceId.get(place.id);
      const missing: string[] = [];
      if (!record) {
        missing.push("Verification Record");
      } else {
        if (record.status !== "verified") {
          missing.push("Full Verification");
        }
        if (!record.levels.includes("photo_verified")) {
          missing.push("Photo Verified");
        }
        if (!record.levels.includes("southernvt_recommended")) {
          missing.push("Editorial Recommendation");
        }
      }

      return {
        entityId: place.id,
        entityName: place.name,
        entityType: place.type,
        href: getEntityHref(place),
        missing,
        priority: scoreOpportunity(missing.length),
      };
    })
    .filter((entry) => entry.missing.length > 0)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, limit);
}

export function findSeasonalGaps(limit = 8): EditorialOpportunity[] {
  const required: RelationshipType[] = ["summer", "fall_foliage", "winter"];
  return getPlaces()
    .map((place) => {
      const missing = getMissingRelationshipTypes(place.id, required).map(mapMissingRelationshipLabel);
      return {
        entityId: place.id,
        entityName: place.name,
        entityType: place.type,
        href: getEntityHref(place),
        missing,
        priority: scoreOpportunity(missing.length),
      };
    })
    .filter((entry) => entry.missing.length > 0)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, limit);
}

function scoreFromMissing(missingCount: number, weight: number) {
  return Math.max(0, Math.min(100, 100 - missingCount * weight));
}

export function getEditorialIntelligenceSummary() {
  const missingRelationships = findMissingRelationships();
  const weakStories = findWeakStories();
  const missingPhotography = findMissingPhotography();

  const bestCandidates = [...missingRelationships, ...weakStories, ...missingPhotography]
    .sort((left, right) => right.priority - left.priority);

  return {
    coverageScore: scoreFromMissing(weakStories.reduce((sum, item) => sum + item.missing.length, 0), 5),
    relationshipScore: scoreFromMissing(missingRelationships.reduce((sum, item) => sum + item.missing.length, 0), 5),
    photographyScore: scoreFromMissing(missingPhotography.reduce((sum, item) => sum + item.missing.length, 0), 8),
    bestOpportunity: bestCandidates[0] ?? null,
  };
}

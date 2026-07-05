import { getRelationshipGraph } from "@/lib/graph/RelationshipGraph";
import type {
  RelationshipGraphConnection,
  RelationshipGraphEntity,
  RelationshipType,
} from "@/types/RelationshipGraph";

function scoreRelationshipType(type: RelationshipType) {
  switch (type) {
    case "recommended_after":
      return 100;
    case "recommended_before":
      return 90;
    case "near":
      return 80;
    case "best_with":
      return 75;
    case "food_nearby":
    case "coffee_nearby":
    case "lodging_nearby":
    case "shopping_nearby":
      return 70;
    default:
      return 60;
  }
}

export function findEntityBySlug(type: RelationshipGraphEntity["type"], slug: string) {
  const graph = getRelationshipGraph();
  return graph.entities.find((entity) => entity.type === type && entity.slug === slug) ?? null;
}

export function findEntityById(entityId: string) {
  const graph = getRelationshipGraph();
  return graph.entities.find((entity) => entity.id === entityId) ?? null;
}

export function getConnectionsForEntity(entityId: string) {
  const graph = getRelationshipGraph();
  const entitiesById = new Map(graph.entities.map((entity) => [entity.id, entity]));

  const connections: RelationshipGraphConnection[] = [];
  for (const link of graph.links) {
    if (link.fromId === entityId || link.toId === entityId) {
      const from = entitiesById.get(link.fromId);
      const to = entitiesById.get(link.toId);
      if (!from || !to) {
        continue;
      }

      connections.push({
        relationship: link,
        from,
        to,
        direction: link.fromId === entityId ? "outgoing" : "incoming",
      });
    }
  }

  return connections;
}

export function getConnectedEntities(
  entityId: string,
  options?: {
    targetTypes?: RelationshipGraphEntity["type"][];
    relationshipTypes?: RelationshipType[];
    limit?: number;
  },
) {
  const connections = getConnectionsForEntity(entityId)
    .filter((connection) => {
      if (options?.relationshipTypes && !options.relationshipTypes.includes(connection.relationship.type)) {
        return false;
      }

      const target = connection.direction === "outgoing" ? connection.to : connection.from;
      if (options?.targetTypes && !options.targetTypes.includes(target.type)) {
        return false;
      }

      return true;
    })
    .sort((left, right) => scoreRelationshipType(right.relationship.type) - scoreRelationshipType(left.relationship.type));

  const deduped = new Map<string, RelationshipGraphConnection>();
  for (const connection of connections) {
    const target = connection.direction === "outgoing" ? connection.to : connection.from;
    if (!deduped.has(target.id)) {
      deduped.set(target.id, connection);
    }
  }

  const results = Array.from(deduped.values());
  return typeof options?.limit === "number" ? results.slice(0, options.limit) : results;
}

export function getMissingRelationshipTypes(entityId: string, requiredTypes: RelationshipType[]) {
  const present = new Set(getConnectionsForEntity(entityId).map((connection) => connection.relationship.type));
  return requiredTypes.filter((type) => !present.has(type));
}

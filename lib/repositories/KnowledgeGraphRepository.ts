import { mockRelationships } from "@/data/relationships";
import { collectionStoryMap, mockStories, placeStoryMap } from "@/data/stories";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getMediaAssets } from "@/lib/repositories/mediaRepository";
import { getPublishedArticles } from "@/repositories/ArticleRepository";
import { getPublishedDeals } from "@/repositories/DealRepository";
import { getPublishedEvents } from "@/repositories/EventRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import type { KnowledgeEdge, KnowledgeEdgeType } from "@/types/KnowledgeEdge";
import type { KnowledgeNode, KnowledgeNodeType } from "@/types/KnowledgeNode";

const edgeWeightMap: Record<KnowledgeEdgeType, number> = {
  nearby: 26,
  contains: 20,
  mentions: 18,
  related: 16,
  featured_in: 14,
  hosts: 14,
  recommended: 12,
  photographed_with: 10,
};

const edgeLabelMap: Record<KnowledgeEdgeType, string> = {
  nearby: "Nearby",
  contains: "Contains",
  mentions: "Mentions",
  related: "Related",
  featured_in: "Featured in",
  hosts: "Hosts",
  recommended: "Recommended",
  photographed_with: "Photographed with",
};

function nodeId(type: KnowledgeNodeType, id: string): string {
  return `${type}:${id}`;
}

function mapType(value: string): KnowledgeNodeType {
  if (value === "place" || value === "collection" || value === "article" || value === "event" || value === "deal" || value === "media") {
    return value;
  }
  return "story";
}

function mapEdgeType(value: string): KnowledgeEdgeType {
  if (value === "nearby") {
    return "nearby";
  }
  if (value === "contains") {
    return "contains";
  }
  if (value === "featured_in") {
    return "featured_in";
  }
  if (value === "related") {
    return "related";
  }
  if (value === "hosts_event") {
    return "hosts";
  }
  if (value === "uses_media") {
    return "photographed_with";
  }
  return "recommended";
}

function buildEdge(fromType: KnowledgeNodeType, fromId: string, toType: KnowledgeNodeType, toId: string, type: KnowledgeEdgeType): KnowledgeEdge {
  return {
    id: `${fromType}:${fromId}->${toType}:${toId}:${type}`,
    fromNodeId: nodeId(fromType, fromId),
    toNodeId: nodeId(toType, toId),
    type,
    weight: edgeWeightMap[type],
    label: edgeLabelMap[type],
  };
}

export async function getAllNodes(): Promise<KnowledgeNode[]> {
  const [places, collections, articles, events, deals, media] = await Promise.all([
    getPlaces(),
    getCollections(),
    getPublishedArticles(),
    getPublishedEvents(),
    getPublishedDeals(),
    getMediaAssets(),
  ]);

  const nodes: KnowledgeNode[] = [
    ...places.map((place) => ({
      id: nodeId("place", place.id),
      type: "place" as const,
      title: place.name,
      subtitle: `${place.placeType} · ${place.city}`,
      description: place.description,
      image: place.featuredImage,
      href: `/places/${place.slug}`,
      tags: place.tags,
    })),
    ...collections.map((collection) => ({
      id: nodeId("collection", collection.id),
      type: "collection" as const,
      title: collection.title,
      subtitle: `${collection.season} · ${collection.audience}`,
      description: collection.description,
      image: collection.featuredImage,
      href: `/collections/${collection.slug}`,
      tags: collection.tags,
    })),
    ...articles.map((article) => ({
      id: nodeId("article", article.id),
      type: "article" as const,
      title: article.title,
      subtitle: article.articleType,
      description: article.excerpt,
      image: article.featuredImage,
      href: `/guides/${article.slug}`,
      tags: article.tags,
    })),
    ...events.map((event) => ({
      id: nodeId("event", event.id),
      type: "event" as const,
      title: event.title,
      subtitle: `${event.city} · ${event.eventType}`,
      description: event.description,
      image: event.featuredImage,
      href: `/events/${event.slug}`,
      tags: event.tags,
    })),
    ...deals.map((deal) => ({
      id: nodeId("deal", deal.id),
      type: "deal" as const,
      title: deal.title,
      subtitle: deal.dealType,
      description: deal.shortDescription,
      image: deal.featuredImage,
      href: `/deals/${deal.slug}`,
      tags: deal.tags,
    })),
    ...media.map((asset) => ({
      id: nodeId("media", asset.id),
      type: "media" as const,
      title: asset.title,
      subtitle: asset.type,
      description: asset.altText,
      image: asset.thumbnailUrl || asset.url,
      href: "/basecamp/media",
      tags: asset.tags,
    })),
    ...mockStories.map((story) => ({
      id: nodeId("story", story.id),
      type: "story" as const,
      title: story.title,
      subtitle: `${story.season} · ${story.difficulty}`,
      description: story.summary,
      href: "/basecamp/articles",
      tags: [...story.visitorTips, ...story.photographyTips].slice(0, 6),
    })),
  ];

  return nodes;
}

export async function getEdges(nodeIdFilter?: string): Promise<KnowledgeEdge[]> {
  const [articles, media] = await Promise.all([getPublishedArticles(), getMediaAssets()]);

  const relEdges = mockRelationships
    .map((relationship) =>
      buildEdge(
        mapType(relationship.fromType),
        relationship.fromId,
        mapType(relationship.toType),
        relationship.toId,
        mapEdgeType(relationship.relationshipType),
      ),
    );

  const storyMentionEdges = [
    ...Object.entries(placeStoryMap).map(([placeId, storyId]) => buildEdge("story", storyId, "place", placeId, "mentions")),
    ...Object.entries(collectionStoryMap).map(([collectionId, storyId]) => buildEdge("story", storyId, "collection", collectionId, "mentions")),
  ];

  const articleMentionEdges = articles.flatMap((article) => [
    ...article.relatedPlaces.map((placeId) => buildEdge("article", article.id, "place", placeId, "mentions")),
    ...article.relatedCollections.map((collectionId) => buildEdge("article", article.id, "collection", collectionId, "mentions")),
    ...article.relatedEvents.map((eventId) => buildEdge("article", article.id, "event", eventId, "mentions")),
  ]);

  const mediaEdges = media.flatMap((asset) =>
    asset.attachedTo
      .map((ref) => {
        const [type, id] = ref.split(":");
        if (!type || !id) {
          return null;
        }
        const nodeType = mapType(type);
        return buildEdge("media", asset.id, nodeType, id, "photographed_with");
      })
      .filter((item): item is KnowledgeEdge => Boolean(item)),
  );

  const all = [...relEdges, ...storyMentionEdges, ...articleMentionEdges, ...mediaEdges];

  if (!nodeIdFilter) {
    return all;
  }

  return all.filter((edge) => edge.fromNodeId === nodeIdFilter || edge.toNodeId === nodeIdFilter);
}

export async function getNode(id: string): Promise<KnowledgeNode | null> {
  const nodes = await getAllNodes();
  return nodes.find((node) => node.id === id) ?? null;
}

export async function getConnectedNodes(id: string): Promise<KnowledgeNode[]> {
  const [nodes, edges] = await Promise.all([getAllNodes(), getEdges(id)]);
  const connectedIds = new Set<string>();

  edges.forEach((edge) => {
    if (edge.fromNodeId === id) {
      connectedIds.add(edge.toNodeId);
    }
    if (edge.toNodeId === id) {
      connectedIds.add(edge.fromNodeId);
    }
  });

  return nodes.filter((node) => connectedIds.has(node.id));
}

export async function recommendConnections(id: string, limit = 6): Promise<KnowledgeNode[]> {
  const [nodes, edges] = await Promise.all([getAllNodes(), getEdges()]);
  const edgeByNode = new Map<string, number>();

  const firstHop = edges.filter((edge) => edge.fromNodeId === id || edge.toNodeId === id);
  const firstHopNodeIds = new Set<string>();

  firstHop.forEach((edge) => {
    const other = edge.fromNodeId === id ? edge.toNodeId : edge.fromNodeId;
    firstHopNodeIds.add(other);
    edgeByNode.set(other, (edgeByNode.get(other) ?? 0) + edge.weight + 20);
  });

  edges.forEach((edge) => {
    if (firstHopNodeIds.has(edge.fromNodeId) && edge.toNodeId !== id) {
      edgeByNode.set(edge.toNodeId, (edgeByNode.get(edge.toNodeId) ?? 0) + Math.round(edge.weight * 0.6));
    }
    if (firstHopNodeIds.has(edge.toNodeId) && edge.fromNodeId !== id) {
      edgeByNode.set(edge.fromNodeId, (edgeByNode.get(edge.fromNodeId) ?? 0) + Math.round(edge.weight * 0.6));
    }
  });

  return nodes
    .filter((node) => node.id !== id && edgeByNode.has(node.id))
    .sort((a, b) => (edgeByNode.get(b.id) ?? 0) - (edgeByNode.get(a.id) ?? 0))
    .slice(0, limit);
}

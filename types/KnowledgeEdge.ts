export type KnowledgeEdgeType =
  | "nearby"
  | "contains"
  | "mentions"
  | "related"
  | "featured_in"
  | "hosts"
  | "recommended"
  | "photographed_with";

export interface KnowledgeEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: KnowledgeEdgeType;
  weight: number;
  label: string;
}

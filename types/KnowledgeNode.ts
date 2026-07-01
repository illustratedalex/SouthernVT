export type KnowledgeNodeType = "place" | "collection" | "article" | "event" | "deal" | "media" | "story";

export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  href?: string;
  tags?: string[];
}

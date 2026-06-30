export type RelationshipType =
  | "nearby"
  | "contains"
  | "uses_media"
  | "related"
  | "featured_in"
  | "has_deal"
  | "hosts_event";

export type RelationshipContentType = "place" | "collection" | "media" | "article" | "event" | "deal";

export interface Relationship {
  id: string;
  fromType: RelationshipContentType;
  fromId: string;
  toType: RelationshipContentType;
  toId: string;
  relationshipType: RelationshipType;
  label: string;
  sortOrder: number;
  createdAt: string;
}

export interface RelationshipTypeMeta {
  label: string;
  badgeClassName: string;
}

export const relationshipTypeMeta: Record<RelationshipType, RelationshipTypeMeta> = {
  nearby: {
    label: "Nearby Place",
    badgeClassName: "bg-[#d9f2e3] text-[#1d5c3d]",
  },
  featured_in: {
    label: "Featured In",
    badgeClassName: "bg-[#fbe8c7] text-[#6a4815]",
  },
  contains: {
    label: "Contains",
    badgeClassName: "bg-[#d9e8ff] text-[#1f457c]",
  },
  related: {
    label: "Related",
    badgeClassName: "bg-[#ece6ff] text-[#5037a3]",
  },
  uses_media: {
    label: "Uses Media",
    badgeClassName: "bg-[#f6dff0] text-[#8a2c63]",
  },
  hosts_event: {
    label: "Hosts Event",
    badgeClassName: "bg-[#fde0dc] text-[#8a2a22]",
  },
  has_deal: {
    label: "Has Deal",
    badgeClassName: "bg-[#def3ff] text-[#0f5a7a]",
  },
};

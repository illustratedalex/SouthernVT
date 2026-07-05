export type RelationshipEntityType =
  | "place"
  | "business"
  | "collection"
  | "article"
  | "guide"
  | "event"
  | "deal"
  | "town"
  | "region"
  | "person"
  | "season"
  | "activity";

export type RelationshipType =
  | "near"
  | "inside"
  | "related"
  | "recommended_after"
  | "recommended_before"
  | "best_with"
  | "hidden_gem"
  | "family_friendly"
  | "dog_friendly"
  | "photography"
  | "camping"
  | "historic"
  | "food_nearby"
  | "coffee_nearby"
  | "lodging_nearby"
  | "shopping_nearby"
  | "rainy_day"
  | "fall_foliage"
  | "winter"
  | "summer";

export interface RelationshipGraphEntity {
  id: string;
  type: RelationshipEntityType;
  name: string;
  slug?: string;
  href?: string;
}

export interface RelationshipGraphLink {
  id: string;
  fromId: string;
  toId: string;
  type: RelationshipType;
}

export interface RelationshipGraphData {
  entities: RelationshipGraphEntity[];
  links: RelationshipGraphLink[];
}

export interface RelationshipGraphConnection {
  relationship: RelationshipGraphLink;
  from: RelationshipGraphEntity;
  to: RelationshipGraphEntity;
  direction: "outgoing" | "incoming";
}

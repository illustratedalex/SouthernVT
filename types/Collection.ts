export type CollectionStatus = "draft" | "review" | "scheduled" | "published" | "archived";

export type CollectionSeason = "Spring" | "Summer" | "Fall" | "Winter" | "Year-Round";

export type CollectionAudience =
  | "Families"
  | "Couples"
  | "Road Trippers"
  | "Food Lovers"
  | "Outdoor Explorers"
  | "Local Explorers";

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  featuredImage: string;
  gallery: string[];
  places: string[];
  tags: string[];
  season: CollectionSeason;
  audience: CollectionAudience;
  status: CollectionStatus;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

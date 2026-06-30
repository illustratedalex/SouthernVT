export type ArticleType = "guide" | "story" | "list" | "itinerary" | "news";

export type ArticleStatus = "draft" | "review" | "scheduled" | "published" | "archived";

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  articleType: ArticleType;
  status: ArticleStatus;
  author: string;
  featuredImage: string;
  gallery: string[];
  relatedPlaces: string[];
  relatedCollections: string[];
  relatedEvents: string[];
  categories: string[];
  tags: string[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export type DealStatus = "draft" | "review" | "scheduled" | "published" | "archived";

export type DealType = "discount" | "freebie" | "package" | "seasonal" | "event" | "member_only";

export type DealRedemptionMethod = "show_phone" | "code" | "qr" | "link" | "in_person";

export interface Deal {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  status: DealStatus;
  dealType: DealType;
  placeId: string;
  collectionId?: string;
  code?: string;
  terms: string;
  startDate: string;
  endDate: string;
  redemptionMethod: DealRedemptionMethod;
  redemptionUrl?: string;
  featuredImage: string;
  featured: boolean;
  categories: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

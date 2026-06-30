export interface Lodging {
  id: string;
  slug: string;
  name: string;
  description?: string;
  featuredImage?: string;
  gallery?: string[];
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;

  category?: "inn" | "hotel" | "cabin" | "lodge" | "bnb";
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  starRating?: number;
  isFeatured?: boolean;
}

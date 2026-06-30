export interface Restaurant {
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

  cuisine?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  priceRange?: "$" | "$$" | "$$$" | "$$$$";
  isFeatured?: boolean;
}

export interface Waterfall {
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

  elevationFeet?: number;
  difficulty?: "easy" | "moderate" | "challenging";
  accessNote?: string;
  isFeatured?: boolean;
}

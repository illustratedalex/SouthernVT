export interface Trail {
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

  distanceMiles?: number;
  elevationGainFeet?: number;
  difficulty?: "easy" | "moderate" | "challenging";
  routeType?: string;
  isFeatured?: boolean;
}

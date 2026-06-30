export interface HiddenGem {
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

  blurb?: string;
  difficulty?: "easy" | "moderate" | "challenging";
  accessNote?: string;
  isFeatured?: boolean;
}

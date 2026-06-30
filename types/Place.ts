export type PlaceStatus = "draft" | "review" | "scheduled" | "published" | "archived";

export type PlaceType =
  | "Restaurant"
  | "Waterfall"
  | "Brewery"
  | "Hotel"
  | "Trail"
  | "Covered Bridge"
  | "Maker Studio"
  | "Farm Stand"
  | "Scenic Overlook"
  | "Shop";

export type PlaceMetadata = {
  restaurant?: {
    cuisine: string;
    reservations: boolean;
    outdoorSeating: boolean;
  };
  waterfall?: {
    height: string;
    swimming: boolean;
    trailDistance: string;
    difficulty: string;
  };
  hotel?: {
    rooms: string;
    checkIn: string;
    petFriendly: boolean;
  };
  trail?: {
    distance: string;
    elevationGain: string;
    loop: boolean;
    dogsAllowed: boolean;
  };
  shop?: {
    products: string;
    localMade: boolean;
    shippingAvailable: boolean;
  };
};

export interface Place {
  id: string;
  slug: string;
  name: string;
  description: string;
  placeType: PlaceType;
  categories: string[];
  tags: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  hours: string;
  featuredImage: string;
  gallery: string[];
  amenities: string[];
  featured: boolean;
  status: PlaceStatus;
  metadata: PlaceMetadata;
  relatedPlaces: string[];
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

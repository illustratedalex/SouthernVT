export type ContentStatus = "draft" | "published" | "archived";

export interface BaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
  status: ContentStatus;
}

export interface Business extends BaseRecord {
  name: string;
  slug: string;
  description?: string;
  category: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city: string;
  state: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
  is_featured?: boolean;
}

export interface HiddenGem extends BaseRecord {
  title: string;
  slug: string;
  blurb: string;
  description?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  image_url?: string;
  is_featured?: boolean;
}

export interface Restaurant extends BaseRecord {
  name: string;
  slug: string;
  cuisine: string;
  description?: string;
  address?: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  price_range?: "$" | "$$" | "$$$" | "$$$$";
  is_featured?: boolean;
}

export interface EventItem extends BaseRecord {
  title: string;
  slug: string;
  description?: string;
  start_date: string;
  end_date?: string;
  venue?: string;
  city: string;
  state: string;
  category?: string;
  image_url?: string;
  is_featured?: boolean;
}

export interface Waterfall extends BaseRecord {
  name: string;
  slug: string;
  description?: string;
  location: string;
  difficulty?: "easy" | "moderate" | "challenging";
  elevation_ft?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  is_featured?: boolean;
}

export interface Trail extends BaseRecord {
  name: string;
  slug: string;
  description?: string;
  location: string;
  distance_miles?: number;
  elevation_gain_ft?: number;
  difficulty?: "easy" | "moderate" | "challenging";
  is_featured?: boolean;
}

export interface Lodging extends BaseRecord {
  name: string;
  slug: string;
  description?: string;
  category: "inn" | "hotel" | "cabin" | "lodge" | "bnb";
  address?: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  star_rating?: number;
  is_featured?: boolean;
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: any;
        Insert: any;
        Update: any;
      };
      places: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          place_type: string;
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
          featured_image: string;
          gallery: string[];
          amenities: string[];
          featured: boolean;
          status: string;
          metadata: Json;
          related_places: string[];
          seo_title: string;
          seo_description: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["places"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["places"]["Row"]>;
      };
      collections: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string;
          description: string;
          featured_image: string;
          gallery: string[];
          place_ids: string[];
          places?: string[];
          tags: string[];
          season: string;
          audience: string;
          status: string;
          featured: boolean;
          seo_title: string;
          seo_description: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
      };
      media: {
        Row: {
          id: string;
          title: string;
          alt_text: string;
          type: string;
          url: string;
          thumbnail_url: string;
          tags: string[];
          attached_to: string[];
          status: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["media"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["media"]["Row"]>;
      };
      relationships: {
        Row: {
          id: string;
          from_type: string;
          from_id: string;
          to_type: string;
          to_id: string;
          relationship_type: string;
          label: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["relationships"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["relationships"]["Row"]>;
      };
      workflow_events: {
        Row: {
          id: string;
          content_type: string;
          content_id: string;
          from_status: string;
          to_status: string;
          note: string;
          created_by: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["workflow_events"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["workflow_events"]["Row"]>;
      };
      versions: {
        Row: {
          id: string;
          content_type: string;
          content_id: string;
          version_number: number;
          title: string;
          snapshot: string;
          created_by: string;
          created_at: string;
          published: boolean;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["versions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["versions"]["Row"]>;
      };
      comments: {
        Row: {
          id: string;
          content_type: string;
          content_id: string;
          body: string;
          author: string;
          resolved: boolean;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["comments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["comments"]["Row"]>;
      };
    };
  };
}

import { getSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import type { Place } from "@/types/Place";

export type PlaceInput = Omit<Place, "id" | "createdAt" | "updatedAt">;

type PlaceRow = Database["public"]["Tables"]["places"]["Row"];

type PlaceInsert = Partial<PlaceRow>;
type PlaceUpdate = Partial<PlaceRow>;

function createId(slug: string) {
  return `place-${slug}-${Date.now().toString(36)}`;
}

function mapRowToPlace(row: PlaceRow): Place {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    placeType: row.place_type as Place["placeType"],
    categories: row.categories ?? [],
    tags: row.tags ?? [],
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    latitude: row.latitude,
    longitude: row.longitude,
    phone: row.phone ?? "",
    email: row.email ?? "",
    website: row.website ?? "",
    hours: row.hours ?? "",
    featuredImage: row.featured_image,
    gallery: row.gallery ?? [],
    amenities: row.amenities ?? [],
    featured: row.featured,
    status: row.status as Place["status"],
    metadata: (row.metadata ?? {}) as Place["metadata"],
    relatedPlaces: row.related_places ?? [],
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInputToInsert(input: PlaceInput): PlaceInsert {
  return {
    slug: input.slug,
    name: input.name,
    description: input.description,
    place_type: input.placeType,
    categories: input.categories,
    tags: input.tags,
    address: input.address,
    city: input.city,
    state: input.state,
    zip: input.zip,
    latitude: input.latitude,
    longitude: input.longitude,
    phone: input.phone,
    email: input.email,
    website: input.website,
    hours: input.hours,
    featured_image: input.featuredImage,
    gallery: input.gallery,
    amenities: input.amenities,
    featured: input.featured,
    status: input.status,
    metadata: input.metadata,
    related_places: input.relatedPlaces,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
  };
}

function mapUpdateToRow(update: Partial<PlaceInput>): PlaceUpdate {
  return {
    slug: update.slug,
    name: update.name,
    description: update.description,
    place_type: update.placeType,
    categories: update.categories,
    tags: update.tags,
    address: update.address,
    city: update.city,
    state: update.state,
    zip: update.zip,
    latitude: update.latitude,
    longitude: update.longitude,
    phone: update.phone,
    email: update.email,
    website: update.website,
    hours: update.hours,
    featured_image: update.featuredImage,
    gallery: update.gallery,
    amenities: update.amenities,
    featured: update.featured,
    status: update.status,
    metadata: update.metadata,
    related_places: update.relatedPlaces,
    seo_title: update.seoTitle,
    seo_description: update.seoDescription,
    updated_at: new Date().toISOString(),
  };
}

export async function getPlaces(): Promise<Place[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("places").select("*").is("archived_at", null).order("updated_at", { ascending: false });
  if (error || !data) {
    throw new Error(`Failed to fetch places: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapRowToPlace);
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("places").select("*").eq("id", id).is("archived_at", null).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch place: ${error.message}`);
  }
  return data ? mapRowToPlace(data) : null;
}

export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("places").select("*").eq("slug", slug).is("archived_at", null).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch place by slug: ${error.message}`);
  }
  return data ? mapRowToPlace(data) : null;
}

export async function createPlace(place: PlaceInput): Promise<Place> {
  const client: any = getSupabaseClient();
  const payload: PlaceInsert = {
    id: createId(place.slug),
    ...mapInputToInsert(place),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await client.from("places").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to create place: ${error?.message ?? "unknown error"}`);
  }
  return mapRowToPlace(data);
}

export async function updatePlace(id: string, updates: Partial<PlaceInput>): Promise<Place | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("places").update(mapUpdateToRow(updates)).eq("id", id).is("archived_at", null).select("*").maybeSingle();
  if (error) {
    throw new Error(`Failed to update place: ${error.message}`);
  }
  return data ? mapRowToPlace(data) : null;
}

export async function archivePlace(id: string): Promise<Place | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("places")
    .update({ status: "archived", archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to archive place: ${error.message}`);
  }

  return data ? mapRowToPlace(data) : null;
}

export const supabasePlaceRepository = {
  getPlaces,
  getPlaceById,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  archivePlace,
};

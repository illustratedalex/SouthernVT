import { getSupabaseClient } from "@/lib/supabase/client";
import type { Collection } from "@/types/Collection";

export type CollectionInput = Omit<Collection, "id" | "createdAt" | "updatedAt">;

function mapCollectionRowToCollection(row: any): Collection {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    featuredImage: row.featured_image,
    gallery: row.gallery ?? [],
    places: row.place_ids ?? row.places ?? [],
    tags: row.tags ?? [],
    season: row.season,
    audience: row.audience,
    status: row.status,
    featured: row.featured ?? false,
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCollections(): Promise<Collection[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("collections").select("*").is("archived_at", null).order("updated_at", { ascending: false });
  if (error || !data) {
    throw new Error(`Failed to fetch collections from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapCollectionRowToCollection);
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("collections").select("*").eq("id", id).is("archived_at", null).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch collection by id from Supabase: ${error.message}`);
  }
  return data ? mapCollectionRowToCollection(data) : null;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("collections").select("*").eq("slug", slug).is("archived_at", null).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch collection by slug from Supabase: ${error.message}`);
  }
  return data ? mapCollectionRowToCollection(data) : null;
}

export async function createCollection(input: CollectionInput): Promise<Collection> {
  const client: any = getSupabaseClient();
  const now = new Date().toISOString();
  const payload = {
    id: `collection-${input.slug}-${Date.now().toString(36)}`,
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle,
    description: input.description,
    featured_image: input.featuredImage,
    gallery: input.gallery,
    place_ids: input.places,
    tags: input.tags,
    season: input.season,
    audience: input.audience,
    status: input.status,
    featured: input.featured,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await client.from("collections").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(`Failed to create collection in Supabase: ${error?.message ?? "unknown error"}`);
  }
  return mapCollectionRowToCollection(data);
}

export async function updateCollection(id: string, updates: Partial<CollectionInput>): Promise<Collection | null> {
  const client: any = getSupabaseClient();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.slug !== undefined) payload.slug = updates.slug;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.subtitle !== undefined) payload.subtitle = updates.subtitle;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.featuredImage !== undefined) payload.featured_image = updates.featuredImage;
  if (updates.gallery !== undefined) payload.gallery = updates.gallery;
  if (updates.places !== undefined) payload.place_ids = updates.places;
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.season !== undefined) payload.season = updates.season;
  if (updates.audience !== undefined) payload.audience = updates.audience;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.featured !== undefined) payload.featured = updates.featured;
  if (updates.seoTitle !== undefined) payload.seo_title = updates.seoTitle;
  if (updates.seoDescription !== undefined) payload.seo_description = updates.seoDescription;

  const { data, error } = await client.from("collections").update(payload).eq("id", id).is("archived_at", null).select("*").maybeSingle();
  if (error) {
    throw new Error(`Failed to update collection in Supabase: ${error.message}`);
  }
  return data ? mapCollectionRowToCollection(data) : null;
}

export async function archiveCollection(id: string): Promise<Collection | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("collections")
    .update({ archived_at: new Date().toISOString(), status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to archive collection in Supabase: ${error.message}`);
  }
  return data ? mapCollectionRowToCollection(data) : null;
}

export const supabaseCollectionRepository = {
  getCollections,
  getCollectionById,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  archiveCollection,
};

import { mockPlaces } from "@/data/places";
import type { Place } from "@/types/Place";

export type PlaceInput = Omit<Place, "id" | "createdAt" | "updatedAt">;

let placeStore: Place[] = mockPlaces.map((place) => ({
  ...place,
  categories: [...place.categories],
  tags: [...place.tags],
  gallery: [...place.gallery],
  amenities: [...place.amenities],
  relatedPlaces: [...place.relatedPlaces],
  metadata: JSON.parse(JSON.stringify(place.metadata)) as Place["metadata"],
}));

function clonePlace(place: Place): Place {
  return {
    ...place,
    categories: [...place.categories],
    tags: [...place.tags],
    gallery: [...place.gallery],
    amenities: [...place.amenities],
    relatedPlaces: [...place.relatedPlaces],
    metadata: JSON.parse(JSON.stringify(place.metadata)) as Place["metadata"],
  };
}

function createId(slug: string) {
  return `place-${slug}-${Date.now().toString(36)}`;
}

export async function getPlaces(): Promise<Place[]> {
  return placeStore.map(clonePlace);
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const place = placeStore.find((item) => item.id === id);
  return place ? clonePlace(place) : null;
}

export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const place = placeStore.find((item) => item.slug === slug);
  return place ? clonePlace(place) : null;
}

export async function createPlace(place: PlaceInput): Promise<Place> {
  const created: Place = {
    ...place,
    id: createId(place.slug),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  placeStore = [created, ...placeStore];
  return clonePlace(created);
}

export async function updatePlace(id: string, updates: Partial<PlaceInput>): Promise<Place | null> {
  const index = placeStore.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }

  const current = placeStore[index];
  const updated: Place = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  placeStore[index] = updated;
  return clonePlace(updated);
}

export async function archivePlace(id: string): Promise<Place | null> {
  return updatePlace(id, { status: "archived" });
}

export const mockPlaceRepository = {
  getPlaces,
  getPlaceById,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  archivePlace,
};

import { isFeatureEnabled } from "@/lib/featureFlags";
import { resolveRepositoryMode } from "@/lib/repositories/mode";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { PlaceInput } from "@/lib/repositories/PlaceRepository.mock";
import * as mockRepository from "@/lib/repositories/PlaceRepository.mock";
import * as supabaseRepository from "@/lib/repositories/placeRepository.supabase";
import type { Place } from "@/types/Place";

export interface PlaceRepository {
  getAll(): Promise<Place[]>;
  getById(id: string): Promise<Place | null>;
  create(place: Omit<Place, "id" | "createdAt" | "updatedAt">): Promise<Place>;
  update(id: string, place: Partial<Place>): Promise<Place | null>;
  archive(id: string): Promise<Place | null>;
  getBySlug(slug: string): Promise<Place | null>;
}

type PlaceRepositoryModule = {
  getPlaces: () => Promise<Place[]>;
  getPlaceById: (id: string) => Promise<Place | null>;
  getPlaceBySlug: (slug: string) => Promise<Place | null>;
  createPlace: (place: PlaceInput) => Promise<Place>;
  updatePlace: (id: string, place: Partial<PlaceInput>) => Promise<Place | null>;
  archivePlace: (id: string) => Promise<Place | null>;
};

async function getActivePlaceRepository(): Promise<PlaceRepositoryModule> {
  const supabaseEnabled = await isFeatureEnabled("supabase");
  const mode = resolveRepositoryMode({ supabaseEnv: hasSupabaseEnv(), featureFlagSupabaseEnabled: supabaseEnabled });
  if (mode === "supabase") {
    return supabaseRepository;
  }
  return mockRepository;
}

export class AdaptivePlaceRepository implements PlaceRepository {
  async getAll(): Promise<Place[]> {
    return getPlaces();
  }

  async getById(id: string): Promise<Place | null> {
    return getPlaceById(id);
  }

  async getBySlug(slug: string): Promise<Place | null> {
    return getPlaceBySlug(slug);
  }

  async create(place: PlaceInput): Promise<Place> {
    return createPlace(place);
  }

  async update(id: string, place: Partial<PlaceInput>): Promise<Place | null> {
    return updatePlace(id, place);
  }

  async archive(id: string): Promise<Place | null> {
    return archivePlace(id);
  }
}

export async function getPlaces(): Promise<Place[]> {
  const repository = await getActivePlaceRepository();
  return repository.getPlaces();
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const repository = await getActivePlaceRepository();
  return repository.getPlaceById(id);
}

export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const repository = await getActivePlaceRepository();
  return repository.getPlaceBySlug(slug);
}

export async function createPlace(place: PlaceInput): Promise<Place> {
  const repository = await getActivePlaceRepository();
  return repository.createPlace(place);
}

export async function updatePlace(id: string, updates: Partial<PlaceInput>): Promise<Place | null> {
  const repository = await getActivePlaceRepository();
  return repository.updatePlace(id, updates);
}

export async function archivePlace(id: string): Promise<Place | null> {
  const repository = await getActivePlaceRepository();
  return repository.archivePlace(id);
}

export async function deletePlace(id: string): Promise<void> {
  await archivePlace(id);
}

export const placeRepository = new AdaptivePlaceRepository();

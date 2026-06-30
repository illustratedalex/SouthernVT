import { mockPlaceDNA } from "@/data/placeDNA";
import type { PlaceDNA, PlaceMood, VisitLength } from "@/types/PlaceDNA";

export async function getPlaceDNA(placeId: string): Promise<PlaceDNA | null> {
  return mockPlaceDNA.find((entry) => entry.placeId === placeId) ?? null;
}

export async function getAllPlaceDNA(): Promise<PlaceDNA[]> {
  return [...mockPlaceDNA];
}

export async function getPlaceDNAByMood(mood: PlaceMood): Promise<PlaceDNA[]> {
  return mockPlaceDNA.filter((entry) => entry.moods.includes(mood));
}

export async function getPlaceDNABySeason(season: string): Promise<PlaceDNA[]> {
  const needle = season.trim().toLowerCase();
  return mockPlaceDNA.filter((entry) => entry.bestSeasons.some((item) => item.toLowerCase().includes(needle)));
}

export async function getPlaceDNAByVisitLength(length: VisitLength): Promise<PlaceDNA[]> {
  return mockPlaceDNA.filter((entry) => entry.recommendedVisitLength === length);
}

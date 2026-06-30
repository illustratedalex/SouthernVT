import type { Restaurant } from "../types";

export async function getRestaurants(): Promise<Restaurant[]> {
  return [];
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  return null;
}

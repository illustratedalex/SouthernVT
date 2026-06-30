import type { Trail } from "../types";

export async function getTrails(): Promise<Trail[]> {
  return [];
}

export async function getTrailBySlug(_slug: string): Promise<Trail | null> {
  return null;
}

import type { Lodging } from "../types";

export async function getLodgings(): Promise<Lodging[]> {
  return [];
}

export async function getLodgingBySlug(slug: string): Promise<Lodging | null> {
  return null;
}

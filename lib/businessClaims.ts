import type { PlaceType } from "@/types/Place";

const BUSINESS_PLACE_TYPES: PlaceType[] = [
  "Restaurant",
  "Brewery",
  "Hotel",
  "Maker Studio",
  "Farm Stand",
  "Shop",
];

export function isBusinessPlaceType(placeType: PlaceType): boolean {
  return BUSINESS_PLACE_TYPES.includes(placeType);
}

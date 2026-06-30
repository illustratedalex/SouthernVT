import type { PlaceStatus, PlaceType } from "@/types/Place";

export const REQUIRED_PLACE_IMPORT_FIELDS = ["name", "placeType", "description", "city", "state", "status"] as const;

export type PlaceImportField = (typeof REQUIRED_PLACE_IMPORT_FIELDS)[number];

export type PlaceImportRecord = Record<PlaceImportField, string>;

export type PlaceImportValidationRow = {
  rowNumber: number;
  values: PlaceImportRecord;
  slug: string;
  errors: string[];
  warnings: string[];
  canImport: boolean;
};

const PLACE_TYPE_VALUES: PlaceType[] = [
  "Restaurant",
  "Waterfall",
  "Brewery",
  "Hotel",
  "Trail",
  "Covered Bridge",
  "Maker Studio",
  "Farm Stand",
  "Scenic Overlook",
  "Shop",
];

const PLACE_STATUS_VALUES: PlaceStatus[] = ["draft", "review", "scheduled", "published", "archived"];

function clean(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizePlaceType(value: string): PlaceType | null {
  const normalized = clean(value).toLowerCase();
  const match = PLACE_TYPE_VALUES.find((item) => item.toLowerCase() === normalized);
  return match ?? null;
}

export function normalizePlaceStatus(value: string): PlaceStatus | null {
  const normalized = clean(value).toLowerCase();
  const match = PLACE_STATUS_VALUES.find((item) => item === normalized);
  return match ?? null;
}

function pickRecord(input: Partial<Record<PlaceImportField, string>>): PlaceImportRecord {
  return {
    name: clean(input.name),
    placeType: clean(input.placeType),
    description: clean(input.description),
    city: clean(input.city),
    state: clean(input.state),
    status: clean(input.status),
  };
}

export function validatePlaceImport(rows: Array<Partial<Record<PlaceImportField, string>>>, existingSlugs: string[] = []): PlaceImportValidationRow[] {
  const seenSlugs = new Set(existingSlugs.map((value) => value.toLowerCase()));

  return rows.map((row, index) => {
    const values = pickRecord(row);
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const field of REQUIRED_PLACE_IMPORT_FIELDS) {
      if (!values[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    const slug = slugFromName(values.name);
    if (!slug) {
      errors.push("Unable to generate slug from name");
    }

    if (values.placeType && !normalizePlaceType(values.placeType)) {
      errors.push(`Invalid placeType: ${values.placeType}`);
    }

    if (values.status && !normalizePlaceStatus(values.status)) {
      errors.push(`Invalid status: ${values.status}`);
    }

    if (slug) {
      if (seenSlugs.has(slug.toLowerCase())) {
        warnings.push(`Duplicate slug detected: ${slug}`);
      } else if (errors.length === 0) {
        seenSlugs.add(slug.toLowerCase());
      }
    }

    const hasDuplicateWarning = warnings.some((item) => item.toLowerCase().startsWith("duplicate slug"));

    return {
      rowNumber: index + 2,
      values,
      slug,
      errors,
      warnings,
      canImport: errors.length === 0 && !hasDuplicateWarning,
    };
  });
}

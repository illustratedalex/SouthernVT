import type { PlaceType } from "@/types/Place";

export interface PlaceBuilderData {
  // Step 1 – Basic Information
  name: string;
  placeType: PlaceType;
  town: string;
  county: string;
  summary: string;
  // Step 2 – Story
  whyVisit: string;
  whatMakesUnique: string;
  bestSeason: string;
  insiderTip: string;
  // Step 3 – Visitor Information
  parking: string;
  restrooms: string;
  accessibility: string;
  dogs: string;
  swimming: string;
  difficulty: string;
  visitLength: string;
  // Step 4 – Photography
  heroImage: string;
  gallery: string;
  droneFootage: string;
  verticalReel: string;
  photoNotes: string;
  // Step 5 – Relationships
  nearbyFood: string;
  nearbyLodging: string;
  nearbyAttractions: string;
  collections: string;
  guides: string;
  // Step 6 – SEO
  seoTitle: string;
  seoDescription: string;
}

export function createInitialData(): PlaceBuilderData {
  return {
    name: "",
    placeType: "Restaurant",
    town: "",
    county: "Windham County",
    summary: "",
    whyVisit: "",
    whatMakesUnique: "",
    bestSeason: "Summer",
    insiderTip: "",
    parking: "",
    restrooms: "",
    accessibility: "",
    dogs: "",
    swimming: "",
    difficulty: "",
    visitLength: "",
    heroImage: "",
    gallery: "",
    droneFootage: "",
    verticalReel: "",
    photoNotes: "",
    nearbyFood: "",
    nearbyLodging: "",
    nearbyAttractions: "",
    collections: "",
    guides: "",
    seoTitle: "",
    seoDescription: "",
  };
}

export function calcLaunchReadiness(data: PlaceBuilderData): number {
  const checks: boolean[] = [
    !!data.name.trim(),
    !!data.placeType,
    !!data.town.trim(),
    !!data.summary.trim(),
    !!data.whyVisit.trim(),
    !!data.whatMakesUnique.trim(),
    !!data.heroImage.trim(),
    !!data.seoTitle.trim(),
    !!data.seoDescription.trim(),
    !!data.insiderTip.trim(),
    !!(data.parking || data.restrooms || data.accessibility || data.dogs || data.swimming || data.difficulty || data.visitLength),
    !!(data.nearbyFood || data.nearbyLodging || data.nearbyAttractions || data.collections || data.guides),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

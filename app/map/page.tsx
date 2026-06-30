import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { PublicMapShell } from "@/components/map/PublicMapShell";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getPlaces } from "@/repositories/PlaceRepository";

export const metadata: Metadata = createPageMetadata({
  title: "Interactive Map of Southern Vermont",
  description: "Explore waterfalls, restaurants, lodging, trails, events, and hidden gems across Southern Vermont.",
  path: "/map",
});

export default async function MapPage() {
  const [places, mapboxEnabled] = await Promise.all([getPlaces(), isFeatureEnabled("mapbox")]);
  const safePlaces = Array.isArray(places) ? places : [];
  const publishedPlaces = safePlaces.filter((place) => place.status === "published");

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <PublicMapShell places={publishedPlaces} mapboxEnabled={mapboxEnabled} />
    </main>
  );
}

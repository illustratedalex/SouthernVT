import { RelatedContentRail } from "@/components/public/RelatedContentRail";
import type { Place } from "@/types/Place";

type NearbyPlacesRailProps = {
  places: Place[];
  title?: string;
};

export function NearbyPlacesRail({ places, title = "Nearby Places" }: NearbyPlacesRailProps) {
  return (
    <RelatedContentRail
      title={title}
      items={places.map((place) => ({
        id: place.id,
        title: place.name,
        subtitle: `${place.placeType} · ${place.city}`,
        href: `/places/${place.slug}`,
        badge: place.featured ? "Featured" : undefined,
      }))}
      emptyTitle="No nearby places yet"
      emptyDescription="Nearby matches will appear as more destination relationships are mapped."
    />
  );
}

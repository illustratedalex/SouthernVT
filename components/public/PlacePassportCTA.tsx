import type { Place } from "@/types/Place";
import { PublicCTA } from "./PublicCTA";

interface PlacePassportCTAProps {
  place: Place;
}

export function PlacePassportCTA({ place }: PlacePassportCTAProps) {
  return (
    <PublicCTA
      eyebrow="Passport check-in"
      title={`Mark ${place.name} as visited`}
      description="Save your stop, track progress, and build toward rewards with the SouthernVT passport preview."
      href={`/passport/check-in/${place.id}`}
      label="Check in now"
    />
  );
}

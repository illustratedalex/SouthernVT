import type { Place } from "@/types/Place";
import { PlaceGallery } from "./PlaceGallery";
import { PlaceStatusBadge } from "./PlaceStatusBadge";
import { PlaceTypeBadge } from "./PlaceTypeBadge";

interface PlacePreviewProps {
  place: Place;
}

function summarizeMetadata(place: Place) {
  switch (place.placeType) {
    case "Restaurant":
      return place.metadata.restaurant
        ? [
            `Cuisine: ${place.metadata.restaurant.cuisine}`,
            `Reservations: ${place.metadata.restaurant.reservations ? "Yes" : "No"}`,
            `Outdoor seating: ${place.metadata.restaurant.outdoorSeating ? "Yes" : "No"}`,
          ]
        : [];
    case "Waterfall":
      return place.metadata.waterfall
        ? [
            `Height: ${place.metadata.waterfall.height}`,
            `Swimming: ${place.metadata.waterfall.swimming ? "Yes" : "No"}`,
            `Trail distance: ${place.metadata.waterfall.trailDistance}`,
            `Difficulty: ${place.metadata.waterfall.difficulty}`,
          ]
        : [];
    case "Hotel":
      return place.metadata.hotel
        ? [
            `Rooms: ${place.metadata.hotel.rooms}`,
            `Check-in: ${place.metadata.hotel.checkIn}`,
            `Pet friendly: ${place.metadata.hotel.petFriendly ? "Yes" : "No"}`,
          ]
        : [];
    case "Trail":
      return place.metadata.trail
        ? [
            `Distance: ${place.metadata.trail.distance}`,
            `Elevation gain: ${place.metadata.trail.elevationGain}`,
            `Loop: ${place.metadata.trail.loop ? "Yes" : "No"}`,
            `Dogs allowed: ${place.metadata.trail.dogsAllowed ? "Yes" : "No"}`,
          ]
        : [];
    case "Shop":
      return place.metadata.shop
        ? [
            `Products: ${place.metadata.shop.products}`,
            `Local made: ${place.metadata.shop.localMade ? "Yes" : "No"}`,
            `Shipping available: ${place.metadata.shop.shippingAvailable ? "Yes" : "No"}`,
          ]
        : [];
    default:
      return [];
  }
}

export function PlacePreview({ place }: PlacePreviewProps) {
  const metadataLines = summarizeMetadata(place);

  return (
    <div className="space-y-6 rounded-[32px] border border-[#e8dfc8] bg-[#fcfaf6] p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)]">
      <div className="overflow-hidden rounded-[24px] border border-[#e8dfc8] bg-white shadow-sm">
        <img src={place.featuredImage} alt={place.name} className="h-64 w-full object-cover" />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <PlaceTypeBadge placeType={place.placeType} />
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">{place.name}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{place.description}</p>
        </div>
        <PlaceStatusBadge status={place.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Location</p>
          <p className="mt-2 text-sm text-slate-700">
            {place.address}
            <br />
            {place.city}, {place.state} {place.zip}
          </p>
        </div>
        <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Contact</p>
          <p className="mt-2 text-sm text-slate-700">{place.phone || "No phone listed"}</p>
          <p className="text-sm text-slate-700">{place.website || "No website listed"}</p>
        </div>
        <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Tags</p>
          <p className="mt-2 text-sm text-slate-700">{place.tags.join(", ") || "No tags yet"}</p>
        </div>
      </div>

      {metadataLines.length ? (
        <div className="rounded-[24px] border border-[#e8dfc8] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Metadata</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {metadataLines.map((line) => (
              <div key={line} className="rounded-2xl bg-[#fcfaf6] px-4 py-3 text-sm text-slate-700">
                {line}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Gallery</p>
        <div className="mt-3">
          <PlaceGallery images={place.gallery} />
        </div>
      </div>
    </div>
  );
}

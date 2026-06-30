"use client";

import type { Place } from "@/types/Place";
import { MockMapPin } from "@/components/map/MockMapPin";

interface MockMapCanvasProps {
  places: Place[];
  selectedPlaceId?: string;
  onSelectPlace: (place: Place) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pinPosition(place: Place, index: number, allPlaces: Place[]) {
  const latitudes = allPlaces.map((item) => item.latitude);
  const longitudes = allPlaces.map((item) => item.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latRange = maxLat - minLat;
  const lngRange = maxLng - minLng;

  if (latRange > 0 && lngRange > 0) {
    const x = ((place.longitude - minLng) / lngRange) * 76 + 12;
    const y = (1 - (place.latitude - minLat) / latRange) * 72 + 14;
    return { x: clamp(x, 8, 92), y: clamp(y, 10, 90) };
  }

  const columns = 4;
  const row = Math.floor(index / columns);
  const col = index % columns;
  return {
    x: 18 + col * 18,
    y: 22 + row * 20,
  };
}

export function MockMapCanvas({ places, selectedPlaceId, onSelectPlace }: MockMapCanvasProps) {
  return (
    <div className="relative h-full min-h-[24rem] overflow-hidden rounded-[28px] border border-[#d9ccb0] bg-[linear-gradient(160deg,#f7efe1_0%,#eef4ec_46%,#d9eadf_100%)]">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 26%, rgba(31,59,47,0.18) 0 1px, transparent 1px), radial-gradient(circle at 68% 62%, rgba(31,59,47,0.16) 0 1px, transparent 1px)", backgroundSize: "44px 44px, 52px 52px" }} />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.3),transparent_42%,rgba(31,59,47,0.08)_100%)]" />

      <div className="absolute left-6 top-6 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
        Southern Vermont Mock Map
      </div>

      <div className="absolute inset-0">
        {places.map((place, index) => {
          const { x, y } = pinPosition(place, index, places);
          return (
            <MockMapPin
              key={place.id}
              label={place.name}
              x={x}
              y={y}
              active={selectedPlaceId === place.id}
              onClick={() => onSelectPlace(place)}
            />
          );
        })}
      </div>
    </div>
  );
}

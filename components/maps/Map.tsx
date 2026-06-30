"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { Collection } from "@/types/Collection";
import type { Place } from "@/types/Place";
import {
  filterPlaces,
  getCollectionsForPlace,
  getFilterOptions,
  getNearbyPlaces,
  type MapFiltersState,
} from "@/lib/maps/MapService";
import { createMarkerElement } from "./MapMarker";
import { MapPopup } from "./MapPopup";
import { MapSidebar } from "./MapSidebar";
import { PlaceDrawer } from "./PlaceDrawer";

interface MapProps {
  places: Place[];
  collections: Collection[];
}

const defaultFilters: MapFiltersState = {
  search: "",
  placeTypes: [],
  categories: [],
  amenities: [],
  featuredOnly: false,
  openNow: false,
  season: "All",
};

export function Map({ places, collections }: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState<MapFiltersState>(defaultFilters);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [drawerPlace, setDrawerPlace] = useState<Place | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const filterOptions = useMemo(() => getFilterOptions(places), [places]);
  const visiblePlaces = useMemo(() => filterPlaces(places, filters), [places, filters]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      // Safe local error state for missing env configuration during client map bootstrap.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMapError("Mapbox token missing. Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the interactive map.");
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-72.64, 43.01],
      zoom: 8,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");

    map.on("load", () => setMapReady(true));
    map.on("error", () => setMapError("Map failed to load. Please refresh and try again."));

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    visiblePlaces.forEach((place) => {
      const markerElement = createMarkerElement(place.placeType);
      markerElement.addEventListener("click", () => {
        setSelectedPlace(place);
        map.flyTo({ center: [place.longitude, place.latitude], zoom: Math.max(map.getZoom(), 10), essential: true });
      });

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });

    if (visiblePlaces.length === 1) {
      const only = visiblePlaces[0];
      map.flyTo({ center: [only.longitude, only.latitude], zoom: 11, essential: true });
    }
  }, [mapReady, visiblePlaces]);

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    const map = mapRef.current;
    if (map) {
      map.flyTo({ center: [place.longitude, place.latitude], zoom: Math.max(map.getZoom(), 10), essential: true });
    }
  };

  const nearby = drawerPlace ? getNearbyPlaces(drawerPlace, places, 5) : [];
  const placeCollections = drawerPlace ? getCollectionsForPlace(drawerPlace.id, collections) : [];

  return (
    <div className="trailhead-map relative h-screen w-full overflow-hidden bg-[#0f1d18] text-slate-100">
      <div className="absolute inset-0 flex">
        <MapSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((current) => !current)}
          filters={filters}
          onFiltersChange={setFilters}
          filterOptions={filterOptions}
          visiblePlaces={visiblePlaces}
          onSelectPlace={handleSelectPlace}
        />

        <div className="relative h-full flex-1">
          <div ref={mapContainerRef} className="h-full w-full" />

          {mapError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#102019] p-6">
              <div className="max-w-lg rounded-3xl border border-[#2d4a3c] bg-[#173126] p-6 text-center text-[#f8f2e4]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8b15d]">Map unavailable</p>
                <h2 className="mt-3 text-2xl font-semibold">Interactive map requires a Mapbox token</h2>
                <p className="mt-3 text-sm leading-7 text-slate-200">{mapError}</p>
              </div>
            </div>
          ) : null}

          {selectedPlace ? (
            <div className="pointer-events-none absolute bottom-5 left-4 z-20 lg:left-6">
              <div className="pointer-events-auto">
                <MapPopup
                  place={selectedPlace}
                  onViewDetails={() => {
                    setDrawerPlace(selectedPlace);
                    setSelectedPlace(null);
                  }}
                  onAddToTrip={() => {
                    setSelectedPlace(null);
                  }}
                />
              </div>
            </div>
          ) : null}

          <PlaceDrawer
            place={drawerPlace}
            isOpen={Boolean(drawerPlace)}
            onClose={() => setDrawerPlace(null)}
            nearby={nearby}
            collections={placeCollections}
          />
        </div>
      </div>
    </div>
  );
}

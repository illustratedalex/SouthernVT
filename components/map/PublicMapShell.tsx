"use client";

import { useMemo, useState } from "react";
import { MapFilterSidebar, type MapFilters } from "@/components/map/MapFilterSidebar";
import { MapLegend } from "@/components/map/MapLegend";
import { MapPlaceDrawer } from "@/components/map/MapPlaceDrawer";
import { MockMapCanvas } from "@/components/map/MockMapCanvas";
import type { Place } from "@/types/Place";

interface PublicMapShellProps {
  places: Place[];
  mapboxEnabled: boolean;
}

const initialFilters: MapFilters = {
  search: "",
  placeType: "All",
  categories: [],
  amenities: [],
  featuredOnly: false,
};

function toggleInList(list: string[], item: string) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

export function PublicMapShell({ places, mapboxEnabled }: PublicMapShellProps) {
  const [filters, setFilters] = useState<MapFilters>(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const normalizedPlaces = useMemo(
    () =>
      (Array.isArray(places) ? places : []).map((place) => {
        const categories = Array.isArray(place.categories) ? place.categories : [];
        const tags = Array.isArray(place.tags) ? place.tags : [];
        const amenities = Array.isArray(place.amenities) ? place.amenities : [];
        const haystack = `${place.name} ${place.description} ${place.city} ${place.placeType} ${categories.join(" ")} ${tags.join(" ")} ${amenities.join(" ")}`.toLowerCase();
        return { place, categories, amenities, haystack };
      }),
    [places],
  );

  const placeTypes = useMemo(() => [...new Set(normalizedPlaces.map((entry) => entry.place.placeType))].sort((a, b) => a.localeCompare(b)), [normalizedPlaces]);
  const categories = useMemo(() => [...new Set(normalizedPlaces.flatMap((entry) => entry.categories))].sort((a, b) => a.localeCompare(b)), [normalizedPlaces]);
  const amenities = useMemo(() => [...new Set(normalizedPlaces.flatMap((entry) => entry.amenities))].sort((a, b) => a.localeCompare(b)), [normalizedPlaces]);

  const visiblePlaces = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    return normalizedPlaces
      .filter((entry) => {
      const matchesSearch = !normalizedSearch || entry.haystack.includes(normalizedSearch);
      const matchesType = filters.placeType === "All" || entry.place.placeType === filters.placeType;
      const matchesCategories = !filters.categories.length || filters.categories.some((item) => entry.categories.includes(item));
      const matchesAmenities = !filters.amenities.length || filters.amenities.every((item) => entry.amenities.includes(item));
      const matchesFeatured = !filters.featuredOnly || entry.place.featured;
      return matchesSearch && matchesType && matchesCategories && matchesAmenities && matchesFeatured;
    })
      .map((entry) => entry.place);
  }, [normalizedPlaces, filters]);

  const selectedStillVisible = selectedPlace && visiblePlaces.some((place) => place.id === selectedPlace.id);
  const activePlace = selectedStillVisible ? selectedPlace : null;

  return (
    <section className="h-[calc(100vh-81px)] overflow-hidden border-t border-[#e8dfc8] bg-[#f7efe1] text-slate-800">
      {!mapboxEnabled ? (
        <div className="border-b border-[#d7cbb3] bg-[#fff6df] px-4 py-3 text-sm font-medium text-[#624b1a]">
          Mapbox integration coming soon. You are viewing the mock interactive map shell.
        </div>
      ) : null}

      <div className="flex h-full">
        <MapFilterSidebar
          filters={filters}
          placeTypes={placeTypes}
          categories={categories}
          amenities={amenities}
          resultCount={visiblePlaces.length}
          mobileOpen={mobileFiltersOpen}
          onMobileToggle={() => setMobileFiltersOpen((current) => !current)}
          onSearchChange={(value) => setFilters((current) => ({ ...current, search: value }))}
          onPlaceTypeChange={(value) => setFilters((current) => ({ ...current, placeType: value }))}
          onCategoryToggle={(value) => setFilters((current) => ({ ...current, categories: toggleInList(current.categories, value) }))}
          onAmenityToggle={(value) => setFilters((current) => ({ ...current, amenities: toggleInList(current.amenities, value) }))}
          onFeaturedOnlyToggle={(value) => setFilters((current) => ({ ...current, featuredOnly: value }))}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 lg:p-5">
          <MapLegend />
          <div className="min-h-0 flex-1">
            <MockMapCanvas
              places={visiblePlaces}
              selectedPlaceId={activePlace?.id}
              onSelectPlace={(place) => setSelectedPlace(place)}
            />
          </div>
        </div>

        <MapPlaceDrawer place={activePlace} onClose={() => setSelectedPlace(null)} />
      </div>
    </section>
  );
}

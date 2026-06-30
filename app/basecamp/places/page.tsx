"use client";

import { useEffect, useMemo, useState } from "react";
import { BasecampEmptyState, BasecampPageHeader, BasecampToolbar, PlaceCard, PlaceFilters, PlaceTable } from "@/components/basecamp";
import { calculatePlaceCompleteness } from "@/lib/completeness/placeCompleteness";
import { deletePlace, getPlaces } from "@/repositories/PlaceRepository";
import type { CompletenessScore } from "@/types/Completeness";
import type { Place, PlaceStatus, PlaceType } from "@/types/Place";

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState("");
  const [placeType, setPlaceType] = useState<PlaceType | "All">("All");
  const [status, setStatus] = useState<PlaceStatus | "All">("All");

  useEffect(() => {
    async function loadPlaces() {
      const data = await getPlaces();
      setPlaces(Array.isArray(data) ? data : []);
    }

    loadPlaces();
  }, []);

  const visiblePlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesSearch = `${place.name} ${place.city} ${place.description}`.toLowerCase().includes(search.toLowerCase());
      const matchesType = placeType === "All" || place.placeType === placeType;
      const matchesStatus = status === "All" || place.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [places, search, placeType, status]);

  const completenessById = useMemo<Record<string, CompletenessScore>>(() => {
    return places.reduce<Record<string, CompletenessScore>>((accumulator, place) => {
      accumulator[place.id] = calculatePlaceCompleteness(place);
      return accumulator;
    }, {});
  }, [places]);

  const handleDelete = async (id: string) => {
    await deletePlace(id);
    setPlaces((current) => current.filter((place) => place.id !== id));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Place management"
            description="Manage interactive destination listings for restaurants, waterfalls, hotels, and trails."
            primaryAction={{ label: "+ New place", href: "/basecamp/places/new" }}
          />

          <BasecampToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search places"
            filters={<PlaceFilters search={search} placeType={placeType} status={status} onSearchChange={setSearch} onTypeChange={setPlaceType} onStatusChange={setStatus} />}
            sortLabel="Sort"
            viewLabel="View"
            bulkLabel="Bulk"
          />

          {visiblePlaces.length === 0 ? (
            <BasecampEmptyState
              title="No places found"
              description="Try adjusting the search or filters, or create a new place entry."
              ctaLabel="New place"
              ctaHref="/basecamp/places/new"
            />
          ) : (
            <>
              <div className="hidden md:block">
                <PlaceTable places={visiblePlaces} completenessById={completenessById} onDelete={handleDelete} />
              </div>

              <div className="grid gap-4 md:hidden">
                {visiblePlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} completeness={completenessById[place.id]} onDelete={handleDelete} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

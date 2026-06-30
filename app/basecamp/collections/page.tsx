"use client";

import { useEffect, useMemo, useState } from "react";
import { BasecampEmptyState, BasecampPageHeader, BasecampToolbar, CollectionFilters, CollectionTable } from "@/components/basecamp";
import { deleteCollection, getCollections } from "@/lib/repositories/collectionRepository";
import type { Collection } from "@/types/Collection";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    async function loadCollections() {
      const data = await getCollections();
      setCollections(Array.isArray(data) ? data : []);
    }

    loadCollections();
  }, []);

  const visibleCollections = useMemo(() => {
    return collections.filter((collection) => {
      const query = `${collection.title} ${collection.subtitle} ${collection.description} ${collection.tags.join(" ")}`.toLowerCase();
      const matchesSearch = query.includes(search.toLowerCase());
      const matchesSeason = season === "All" || collection.season === season;
      const matchesStatus = status === "All" || collection.status === status;
      return matchesSearch && matchesSeason && matchesStatus;
    });
  }, [collections, search, season, status]);

  const handleArchive = async (id: string) => {
    await deleteCollection(id);
    const refreshed = await getCollections();
    setCollections(refreshed);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Collections management"
            description="Build curated guides from existing places, then refine them into polished Southern Vermont stories."
            primaryAction={{ label: "+ Add Collection", href: "/basecamp/collections/new" }}
          />

          <BasecampToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search collections"
            filters={<CollectionFilters search={search} season={season} status={status} onSearchChange={setSearch} onSeasonChange={setSeason} onStatusChange={setStatus} />}
            sortLabel="Sort"
            viewLabel="View"
            bulkLabel="Bulk"
          />

          {visibleCollections.length === 0 ? (
            <BasecampEmptyState
              title="No collections found"
              description="Change filters or start a new collection to curate a route."
              ctaLabel="Add Collection"
              ctaHref="/basecamp/collections/new"
            />
          ) : (
            <CollectionTable collections={visibleCollections} onArchive={handleArchive} />
          )}
        </div>
      </div>
    </div>
  );
}

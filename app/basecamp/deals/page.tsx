"use client";

import { useEffect, useMemo, useState } from "react";
import { BasecampEmptyState, BasecampPageHeader, BasecampToolbar, DealFilters, DealTable } from "@/components/basecamp";
import { archiveDeal, getDeals } from "@/repositories/DealRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import type { Deal, DealStatus, DealType } from "@/types/Deal";

export default function BasecampDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DealStatus | "All">("All");
  const [dealType, setDealType] = useState<DealType | "All">("All");
  const [placeNamesById, setPlaceNamesById] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    async function loadData() {
      const [loadedDeals, places] = await Promise.all([getDeals(), getPlaces()]);
      const safeDeals = Array.isArray(loadedDeals) ? loadedDeals : [];
      const safePlaces = Array.isArray(places) ? places : [];
      setDeals(safeDeals);
      setPlaceNamesById(new Map(safePlaces.map((place) => [place.id, place.name])));
    }

    loadData();
  }, []);

  const visibleDeals = useMemo(() => {
    const filtered = deals.filter((deal) => {
      const query = `${deal.title} ${deal.description} ${deal.shortDescription} ${deal.tags.join(" ")} ${deal.categories.join(" ")}`.toLowerCase();
      const matchesSearch = query.includes(search.toLowerCase());
      const matchesStatus = status === "All" || deal.status === status;
      const matchesType = dealType === "All" || deal.dealType === dealType;
      return matchesSearch && matchesStatus && matchesType;
    });

    return [...filtered].sort((a, b) => `${a.startDate}-${a.title}`.localeCompare(`${b.startDate}-${b.title}`));
  }, [deals, search, status, dealType]);

  const handleArchive = async (id: string) => {
    await archiveDeal(id);
    const refreshed = await getDeals();
    setDeals(refreshed);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Deals management"
            description="Manage Southern Vermont partner offers with editorial statuses and seasonal windows."
            primaryAction={{ label: "+ Add Deal", href: "/basecamp/deals/new" }}
          />

          <BasecampToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search deals"
            filters={<DealFilters search={search} status={status} dealType={dealType} onSearchChange={setSearch} onStatusChange={setStatus} onDealTypeChange={setDealType} />}
            sortLabel="Sort"
            viewLabel="View"
            bulkLabel="Bulk"
          />

          {visibleDeals.length === 0 ? (
            <BasecampEmptyState
              title="No deals found"
              description="Try clearing filters or add a new offer."
              ctaLabel="Add Deal"
              ctaHref="/basecamp/deals/new"
            />
          ) : (
            <DealTable deals={visibleDeals} placeNamesById={placeNamesById} onArchive={handleArchive} />
          )}
        </div>
      </div>
    </div>
  );
}

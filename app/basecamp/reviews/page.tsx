"use client";

import { useEffect, useMemo, useState } from "react";
import { BasecampEmptyState, BasecampPageHeader, BasecampStatCard, BasecampToolbar, ReviewFilters, ReviewTable } from "@/components/basecamp";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { approveReview, archiveReview, getReviews, rejectReview } from "@/repositories/ReviewRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import type { Review, ReviewStatus } from "@/types/Review";

export default function BasecampReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsEnabled, setReviewsEnabled] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReviewStatus | "All">("All");
  const [placeId, setPlaceId] = useState<string | "All">("All");
  const [places, setPlaces] = useState<Array<{ id: string; name: string }>>([]);
  const [placeNamesById, setPlaceNamesById] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    async function loadData() {
      const [loadedReviews, loadedPlaces, enabled] = await Promise.all([
        getReviews(),
        getPlaces(),
        isFeatureEnabled("reviews"),
      ]);

      setReviews(loadedReviews);
      setReviewsEnabled(enabled);
      const placeOptions = loadedPlaces.map((place) => ({ id: place.id, name: place.name }));
      setPlaces(placeOptions);
      setPlaceNamesById(new Map(placeOptions.map((place) => [place.id, place.name])));
    }

    void loadData();
  }, []);

  const counts = useMemo(() => {
    return {
      pending: reviews.filter((review) => review.status === "pending").length,
      approved: reviews.filter((review) => review.status === "approved").length,
      rejected: reviews.filter((review) => review.status === "rejected").length,
    };
  }, [reviews]);

  const visibleReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      const query = `${review.reviewerName} ${review.title} ${review.body} ${review.tags.join(" ")}`.toLowerCase();
      const matchesSearch = query.includes(search.toLowerCase());
      const matchesStatus = status === "All" || review.status === status;
      const matchesPlace = placeId === "All" || review.placeId === placeId;
      return matchesSearch && matchesStatus && matchesPlace;
    });

    return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [reviews, search, status, placeId]);

  const refreshReviews = async () => {
    const loaded = await getReviews();
    setReviews(loaded);
  };

  const handleApprove = async (id: string) => {
    await approveReview(id);
    await refreshReviews();
  };

  const handleReject = async (id: string) => {
    await rejectReview(id);
    await refreshReviews();
  };

  const handleArchive = async (id: string) => {
    await archiveReview(id);
    await refreshReviews();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Reviews moderation"
            description="Review pending, approved, and rejected submissions from place visitors."
            primaryAction={{ label: "Review queue", href: "#" }}
            statusPill={reviewsEnabled ? "Live" : "Preview"}
          />

          {!reviewsEnabled ? <BasecampEmptyState title="Reviews are in preview mode" description="Moderation tools are available now, but public submission remains in preview." ctaLabel="Open settings" ctaHref="/basecamp/settings/features" /> : null}

          <section className="grid gap-4 sm:grid-cols-3">
            <BasecampStatCard label="Pending reviews" value={`${counts.pending}`} />
            <BasecampStatCard label="Approved reviews" value={`${counts.approved}`} />
            <BasecampStatCard label="Rejected reviews" value={`${counts.rejected}`} />
          </section>

          <BasecampToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search reviews"
            filters={<ReviewFilters search={search} status={status} placeId={placeId} places={places} onSearchChange={setSearch} onStatusChange={setStatus} onPlaceChange={setPlaceId} />}
            sortLabel="Sort"
            viewLabel="View"
            bulkLabel="Bulk"
          />

          {visibleReviews.length === 0 ? (
            <BasecampEmptyState
              title="No reviews found"
              description="Try a different filter or wait for a new visitor submission."
              ctaLabel="Open settings"
              ctaHref="/basecamp/settings/features"
            />
          ) : (
            <ReviewTable reviews={visibleReviews} placeNamesById={placeNamesById} onApprove={handleApprove} onReject={handleReject} onArchive={handleArchive} />
          )}
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui";
import type { Review } from "@/types/Review";
import { ReviewCard } from "./ReviewCard";
import { ReviewSummary } from "./ReviewSummary";

interface ReviewListProps {
  reviews: Review[];
  previewMode: boolean;
}

export function ReviewList({ reviews, previewMode }: ReviewListProps) {
  const reviewCount = reviews.length;
  const averageRating = reviewCount ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;
  const uniqueTags = [...new Set(reviews.flatMap((review) => review.tags))].slice(0, 12);

  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-7 shadow-sm">
      {previewMode ? (
        <div className="mb-5 rounded-2xl border border-[#d7cbb3] bg-[#fff7e4] p-3 text-sm font-medium text-[#6b5a30]">
          Reviews are in preview mode.
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-pine)">Reviews</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">What visitors are saying</h2>
        </div>
        <Button variant="secondary">Write a review (coming soon)</Button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <ReviewSummary averageRating={averageRating} reviewCount={reviewCount} />

        <div className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-pine)">Popular tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {uniqueTags.length ? (
              uniqueTags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">Tags will appear as approved reviews are submitted.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.length ? (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d7cbb3] bg-[#fcfaf6] p-6 text-sm text-slate-600">
            No approved reviews yet. Be the first to share your experience.
          </div>
        )}
      </div>
    </section>
  );
}

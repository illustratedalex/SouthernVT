import type { Review } from "@/types/Review";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-(--color-pine)">{review.reviewerName}</p>
          <p className="mt-1 text-xs text-slate-500">{review.visitDate ? `Visited ${review.visitDate}` : "Visit date not provided"}</p>
        </div>
        <div className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-1 text-sm font-semibold text-slate-700">
          {review.rating}/5
        </div>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">{review.title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{review.body}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[#e8dfc8] bg-[#f7efe1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-(--color-forest-green)">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500">Helpful: {review.helpfulCount}</p>
      </div>
    </article>
  );
}

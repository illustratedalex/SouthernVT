interface ReviewSummaryProps {
  averageRating: number;
  reviewCount: number;
}

export function ReviewSummary({ averageRating, reviewCount }: ReviewSummaryProps) {
  const roundedAverage = Number.isFinite(averageRating) ? averageRating.toFixed(1) : "0.0";

  return (
    <div className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-pine)">Guest rating</p>
      <div className="mt-2 flex items-end gap-3">
        <p className="text-4xl font-semibold text-slate-900">{roundedAverage}</p>
        <p className="pb-1 text-sm text-slate-600">/ 5</p>
      </div>
      <p className="mt-2 text-sm text-slate-600">{reviewCount} approved reviews</p>
    </div>
  );
}

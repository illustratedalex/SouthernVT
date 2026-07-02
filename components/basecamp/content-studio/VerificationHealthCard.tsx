import Link from "next/link";

type VerificationHealthCardProps = {
  verifiedPlacesCount: number;
  recommendedPlacesCount: number;
  placesNeedingReviewCount: number;
  expiredVerificationsCount: number;
};

export function VerificationHealthCard({
  verifiedPlacesCount,
  recommendedPlacesCount,
  placesNeedingReviewCount,
  expiredVerificationsCount,
}: VerificationHealthCardProps) {
  const taskExamples = [
    "Verify GPS for Bellows Falls Downtown",
    "Review Grafton Inn photos",
    "Revisit Jamaica State Park",
  ];

  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Verification Health</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Verified by SouthernVT</h2>
        </div>
        <Link href="/basecamp/places" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white">
          Open Places
        </Link>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Verified Places</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{verifiedPlacesCount}</p>
        </article>
        <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recommended Places</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{recommendedPlacesCount}</p>
        </article>
        <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Need Review</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{placesNeedingReviewCount}</p>
        </article>
        <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Expired</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{expiredVerificationsCount}</p>
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Suggested Tasks</p>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          {taskExamples.map((task) => (
            <li key={task}>
              <span className="mr-2 text-[#1f3b2f]">☐</span>
              {task}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


import type { PassportStamp } from "@/types/Passport";

interface StampCardProps {
  stamp: PassportStamp;
}

export function StampCard({ stamp }: StampCardProps) {
  return (
    <article className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">{stamp.placeName}</p>
        <span className="rounded-full bg-[#eef5f1] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f3b2f]">
          {stamp.stampType}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">Earned {new Date(stamp.earnedAt).toLocaleDateString()}</p>
      {stamp.notes ? <p className="mt-2 text-sm leading-7 text-slate-600">{stamp.notes}</p> : null}
    </article>
  );
}

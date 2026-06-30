import Link from "next/link";
import type { RecommendationReason } from "@/types/RecommendationReason";
import { RecommendationReasonBadge } from "./RecommendationReasonBadge";

type RecommendationCardProps = {
  title: string;
  subtitle: string;
  href: string;
  score: number;
  badge?: string;
  reasons: RecommendationReason[];
};

export function RecommendationCard({ title, subtitle, href, score, badge, reasons }: RecommendationCardProps) {
  return (
    <article className="rounded-[22px] border border-[#e8dfc8] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {badge ? <span className="rounded-full bg-[#f7efe1] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">{badge}</span> : null}
      </div>
      <p className="mt-2 text-sm leading-7 text-slate-600">{subtitle}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Compass score: {Math.round(score)}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {reasons.slice(0, 3).map((reason) => (
          <RecommendationReasonBadge key={`${reason.code}-${reason.message}`} reason={reason} />
        ))}
      </div>
      <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-[#1f3b2f]">
        Open recommendation
      </Link>
    </article>
  );
}

import type { RecommendationReason } from "@/types/RecommendationReason";

type RecommendationReasonBadgeProps = {
  reason: RecommendationReason;
};

export function RecommendationReasonBadge({ reason }: RecommendationReasonBadgeProps) {
  return (
    <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">
      {reason.message}
    </span>
  );
}

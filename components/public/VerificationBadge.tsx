import type { VerificationLevel, VerificationStatus } from "@/types/Verification";

type VerificationBadgeProps = {
  level?: VerificationLevel;
  status?: VerificationStatus;
  emphasize?: boolean;
};

const levelLabels: Record<VerificationLevel, string> = {
  location_verified: "📍 Location Verified",
  photo_verified: "📸 Photo Verified",
  personally_visited: "🥾 Personally Visited",
  southernvt_recommended: "⭐ SouthernVT Recommended",
};

const statusLabels: Record<VerificationStatus, string> = {
  unverified: "Unverified",
  partial: "Partially Verified",
  verified: "Verified",
  expired: "Expired",
  review_needed: "Review Needed",
};

const statusTone: Record<VerificationStatus, string> = {
  unverified: "border-[#e4dccc] bg-[#fcfaf6] text-slate-700",
  partial: "border-[#d7cbb3] bg-[#fff7e7] text-[#7c5b13]",
  verified: "border-[#b9dcc4] bg-[#ecf8f0] text-[#1f5a3d]",
  expired: "border-[#e8c7bd] bg-[#fff3ef] text-[#8a3d2b]",
  review_needed: "border-[#edd8b6] bg-[#fff7e6] text-[#7a4b16]",
};

export function VerificationBadge({ level, status = "unverified", emphasize = false }: VerificationBadgeProps) {
  const text = level ? levelLabels[level] : statusLabels[status];
  const emphasisClass = emphasize ? "px-4 py-2 text-xs tracking-[0.2em]" : "px-3 py-1 text-[11px] tracking-[0.16em]";

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold uppercase ${statusTone[status]} ${emphasisClass}`}>
      {text}
    </span>
  );
}


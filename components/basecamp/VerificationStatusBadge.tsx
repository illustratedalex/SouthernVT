import type { VerificationStatus } from "@/types/Verification";

type VerificationStatusBadgeProps = {
  status: VerificationStatus;
};

const statusStyles: Record<VerificationStatus, string> = {
  unverified: "border-[#e8dfc8] bg-[#fcfaf6] text-slate-700",
  partial: "border-[#ecd8b7] bg-[#fff7e7] text-[#7a4b16]",
  verified: "border-[#b9dcc4] bg-[#ecf8f0] text-[#1f5a3d]",
  expired: "border-[#e8c7bd] bg-[#fff3ef] text-[#8a3d2b]",
  review_needed: "border-[#edd8b6] bg-[#fff7e6] text-[#7a4b16]",
};

const statusLabel: Record<VerificationStatus, string> = {
  unverified: "Unverified",
  partial: "Partial",
  verified: "Verified",
  expired: "Expired",
  review_needed: "Review Needed",
};

export function VerificationStatusBadge({ status }: VerificationStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[status]}`}>
      {statusLabel[status]}
    </span>
  );
}


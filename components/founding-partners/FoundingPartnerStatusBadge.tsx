import { cn } from "@/components/ui/cn";
import type { FoundingPartnerStatus } from "@/types/FoundingPartner";

type FoundingPartnerStatusBadgeProps = {
  status: FoundingPartnerStatus;
  className?: string;
};

const statusStyles: Record<FoundingPartnerStatus, string> = {
  invited: "border-amber-200 bg-amber-100 text-amber-800",
  interested: "border-blue-200 bg-blue-100 text-blue-800",
  active: "border-emerald-200 bg-emerald-100 text-emerald-800",
  declined: "border-slate-200 bg-slate-100 text-slate-700",
};

export function FoundingPartnerStatusBadge({ status, className }: FoundingPartnerStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
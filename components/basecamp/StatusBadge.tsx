import { cn } from "@/components/ui/cn";

const statusStyles = {
  draft: "border-amber-200 bg-amber-100 text-amber-800",
  review: "border-violet-200 bg-violet-100 text-violet-800",
  scheduled: "border-blue-200 bg-blue-100 text-blue-800",
  published: "border-emerald-200 bg-emerald-100 text-emerald-800",
  archived: "border-slate-200 bg-slate-100 text-slate-700",
  pending: "border-amber-200 bg-amber-100 text-amber-800",
  approved: "border-emerald-200 bg-emerald-100 text-emerald-800",
  rejected: "border-rose-200 bg-rose-100 text-rose-800",
  active: "border-emerald-200 bg-emerald-100 text-emerald-800",
  inactive: "border-slate-200 bg-slate-100 text-slate-700",
} as const;

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as keyof typeof statusStyles;
  const style = statusStyles[normalizedStatus] ?? statusStyles.inactive;

  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]", style, className)}>
      {status}
    </span>
  );
}
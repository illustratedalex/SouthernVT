import type { PlaceStatus } from "@/types/Place";

const statusStyles: Record<PlaceStatus, string> = {
  draft: "bg-amber-100 text-amber-800",
  review: "bg-violet-100 text-violet-800",
  scheduled: "bg-blue-100 text-blue-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-700",
};

export function PlaceStatusBadge({ status }: { status: PlaceStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${statusStyles[status]}`}>{status}</span>;
}

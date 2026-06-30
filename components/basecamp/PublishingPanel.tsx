import { Button } from "@/components/ui";
import type { ContentStatus } from "@/types/Workflow";

interface PublishingPanelProps {
  currentStatus: ContentStatus;
}

const statusStyles: Record<ContentStatus, string> = {
  draft: "bg-slate-100 text-slate-700 border-slate-300",
  review: "bg-amber-100 text-amber-800 border-amber-300",
  scheduled: "bg-sky-100 text-sky-800 border-sky-300",
  published: "bg-emerald-100 text-emerald-800 border-emerald-300",
  archived: "bg-stone-200 text-stone-700 border-stone-300",
};

export function PublishingPanel({ currentStatus }: PublishingPanelProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Publishing</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">Current status</p>
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusStyles[currentStatus]}`}>
          {currentStatus}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button type="button" variant="ghost" size="sm">
          Move to Review
        </Button>
        <Button type="button" variant="ghost" size="sm">
          Schedule
        </Button>
        <Button type="button" variant="secondary" size="sm">
          Publish
        </Button>
        <Button type="button" variant="ghost" size="sm">
          Archive
        </Button>
      </div>
    </section>
  );
}

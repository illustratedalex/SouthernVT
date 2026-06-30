import type { WorkflowEvent } from "@/types/Workflow";

interface WorkflowTimelineProps {
  events: WorkflowEvent[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function WorkflowTimeline({ events }: WorkflowTimelineProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Workflow timeline</h3>
      {events.length ? (
        <ol className="mt-4 space-y-4">
          {events.map((event, index) => (
            <li key={event.id} className="relative pl-7">
              <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#1f3b2f]" />
              {index < events.length - 1 ? <span className="absolute left-[5px] top-5 h-[calc(100%+8px)] w-[2px] bg-[#e6dcc4]" /> : null}
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{event.fromStatus} to {event.toStatus}</p>
              <p className="mt-1 text-sm text-slate-700">{event.note}</p>
              <p className="mt-2 text-xs text-slate-500">{event.createdBy} · {formatDate(event.createdAt)}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-slate-500">No workflow events yet for this content item.</p>
      )}
    </section>
  );
}

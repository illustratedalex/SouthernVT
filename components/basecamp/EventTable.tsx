import Link from "next/link";
import { Button } from "@/components/ui";
import type { Event } from "@/types/Event";
import { BasecampActionMenu } from "./BasecampActionMenu";
import { EventStatusBadge } from "./EventStatusBadge";

interface EventTableProps {
  events: Event[];
  onArchive?: (id: string) => void;
}

export function EventTable({ events, onArchive }: EventTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e8dfc8] bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.2em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Event</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {events.map((event) => (
            <tr key={event.id} className="text-sm text-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img src={event.featuredImage} alt={event.title} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900">{event.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{event.city}, {event.state}</p>
                    {event.featured ? <p className="mt-1 text-xs font-semibold text-amber-700">Featured</p> : null}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">{event.eventType}</td>
              <td className="px-4 py-4"><EventStatusBadge status={event.status} /></td>
              <td className="px-4 py-4">{event.startDate}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Link href={`/basecamp/events/${event.id}`}>
                    <Button variant="secondary" size="sm">Edit</Button>
                  </Link>
                  <BasecampActionMenu items={[{ label: "Preview", href: `/events/${event.slug}` }, { label: "Duplicate", disabled: true }, { label: "Archive", onClick: () => onArchive?.(event.id) }]} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

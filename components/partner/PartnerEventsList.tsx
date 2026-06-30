import type { Event } from "@/types/Event";

interface PartnerEventsListProps {
  events: Event[];
}

export function PartnerEventsList({ events }: PartnerEventsListProps) {
  const upcomingEvents = events.filter((event) => event.endDate >= new Date().toISOString().slice(0, 10));
  const pastEvents = events.filter((event) => event.endDate < new Date().toISOString().slice(0, 10));

  return (
    <section className="space-y-6 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Owner events</h2>
        <button type="button" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700">Submit event (placeholder)</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Upcoming events</h3>
          <ul className="mt-3 space-y-2">
            {upcomingEvents.length ? upcomingEvents.map((event) => (
              <li key={event.id} className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] px-4 py-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{event.title}</p>
                <p className="mt-1 text-xs text-slate-500">{event.startDate} to {event.endDate}</p>
              </li>
            )) : <li className="text-sm text-slate-500">No upcoming events.</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Past events</h3>
          <ul className="mt-3 space-y-2">
            {pastEvents.length ? pastEvents.map((event) => (
              <li key={event.id} className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] px-4 py-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{event.title}</p>
                <p className="mt-1 text-xs text-slate-500">Ended {event.endDate}</p>
              </li>
            )) : <li className="text-sm text-slate-500">No past events.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

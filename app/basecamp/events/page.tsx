"use client";

import { useEffect, useMemo, useState } from "react";
import { BasecampEmptyState, BasecampPageHeader, BasecampToolbar, EventFilters, EventTable } from "@/components/basecamp";
import { archiveEvent, getEvents } from "@/repositories/EventRepository";
import type { Event, EventStatus, EventType } from "@/types/Event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EventStatus | "All">("All");
  const [eventType, setEventType] = useState<EventType | "All">("All");
  const [sort, setSort] = useState<"date-asc" | "date-desc">("date-asc");

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    }

    loadEvents();
  }, []);

  const visibleEvents = useMemo(() => {
    const filtered = events.filter((event) => {
      const query = `${event.title} ${event.city} ${event.description} ${event.tags.join(" ")}`.toLowerCase();
      const matchesSearch = query.includes(search.toLowerCase());
      const matchesStatus = status === "All" || event.status === status;
      const matchesType = eventType === "All" || event.eventType === eventType;
      return matchesSearch && matchesStatus && matchesType;
    });

    return [...filtered].sort((a, b) => {
      const left = `${a.startDate}T${a.startTime}`;
      const right = `${b.startDate}T${b.startTime}`;
      return sort === "date-asc" ? left.localeCompare(right) : right.localeCompare(left);
    });
  }, [events, search, status, eventType, sort]);

  const handleArchive = async (id: string) => {
    await archiveEvent(id);
    const refreshed = await getEvents();
    setEvents(refreshed);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Events management"
            description="Manage the Southern Vermont event calendar with editorial statuses and publishing controls."
            primaryAction={{ label: "+ Add Event", href: "/basecamp/events/new" }}
          />

          <BasecampToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search events"
            filters={<EventFilters search={search} status={status} eventType={eventType} sort={sort} onSearchChange={setSearch} onStatusChange={setStatus} onEventTypeChange={setEventType} onSortChange={setSort} />}
            sortLabel="Sort"
            viewLabel="View"
            bulkLabel="Bulk"
          />

          {visibleEvents.length === 0 ? (
            <BasecampEmptyState
              title="No events found"
              description="Adjust filters or add a new event to the calendar."
              ctaLabel="Add Event"
              ctaHref="/basecamp/events/new"
            />
          ) : (
            <EventTable events={visibleEvents} onArchive={handleArchive} />
          )}
        </div>
      </div>
    </div>
  );
}

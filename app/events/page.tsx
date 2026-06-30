import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { EventCard } from "@/components/public/EventCard";
import { createPageMetadata } from "@/lib/seo";
import { getPublishedEvents } from "@/repositories/EventRepository";

interface EventsPageProps {
  searchParams: Promise<{ q?: string; type?: string; town?: string }>;
}

export const metadata: Metadata = createPageMetadata({
  title: "Southern Vermont Events",
  description: "Browse upcoming and featured events across Southern Vermont.",
  path: "/events",
});

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const search = params.q?.trim().toLowerCase() ?? "";
  const type = params.type?.trim().toLowerCase() || "all";
  const town = params.town?.trim().toLowerCase() || "all";

  const loadedEvents = await getPublishedEvents();
  const events = Array.isArray(loadedEvents) ? loadedEvents : [];
  const upcomingEvents = events.filter((event) => event.status === "published");
  const featuredEvents = upcomingEvents.filter((event) => event.featured).slice(0, 3);

  const eventTypes = [...new Set(upcomingEvents.map((event) => event.eventType))].sort((a, b) => a.localeCompare(b));
  const towns = [...new Set(upcomingEvents.map((event) => event.city))].sort((a, b) => a.localeCompare(b));

  const filtered = upcomingEvents.filter((event) => {
    const haystack = `${event.title} ${event.description} ${event.city} ${event.eventType} ${(Array.isArray(event.tags) ? event.tags : []).join(" ")}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const matchesType = type === "all" || event.eventType.toLowerCase() === type;
    const matchesTown = town === "all" || event.city.toLowerCase() === town;
    return matchesSearch && matchesType && matchesTown;
  });

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-gradient-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">SouthernVT Events</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Upcoming events in Southern Vermont.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">Find markets, music, and weekend festivals with quick filters by type and town.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <form className="grid gap-4 rounded-[24px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm md:grid-cols-3">
          <input name="q" defaultValue={params.q ?? ""} placeholder="Search events" className="h-12 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none" />
          <select name="type" defaultValue={params.type ?? "all"} className="h-12 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none">
            <option value="all">All event types</option>
            {eventTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select name="town" defaultValue={params.town ?? "all"} className="h-12 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none">
            <option value="all">All towns</option>
            {towns.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="submit" className="md:col-span-3 rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">Apply filters</button>
        </form>

        {featuredEvents.length ? (
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-pine)">Featured events</p>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredEvents.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-2">
            <h2 className="text-3xl font-semibold text-slate-900">Upcoming events grid</h2>
            <p className="text-sm text-slate-600">{filtered.length} result{filtered.length === 1 ? "" : "s"}</p>
          </div>

          {filtered.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#e8dfc8] bg-white p-6 text-sm leading-7 text-slate-700 shadow-sm">No published events match this filter set yet.</div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
}

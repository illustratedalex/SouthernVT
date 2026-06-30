"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ActivityFeed, BasecampPageHeader, BasecampSection } from "@/components/basecamp";
import { getSessionActivityEvents, subscribeToSessionEvents } from "@/lib/basecamp/sessionEvents";
import { getActivity } from "@/lib/repositories/ActivityRepository";
import type { Activity, ActivityContentType, ActivityType } from "@/types/Activity";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Articles", href: "/basecamp/articles" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity", active: true },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
  { label: "Reviews", href: "/basecamp/reviews" },
  { label: "Analytics", href: "/basecamp/analytics" },
  { label: "Passport", href: "/basecamp/passport" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
];

const contentTypes: Array<ActivityContentType | "all"> = ["all", "place", "collection", "media", "relationship", "workflow", "user", "system"];
const activityTypes: Array<ActivityType | "all"> = ["all", "created", "updated", "published", "archived", "uploaded", "related", "commented", "status_changed"];

export default function ActivityPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");
  const [contentType, setContentType] = useState<ActivityContentType | "all">("all");
  const [activityType, setActivityType] = useState<ActivityType | "all">("all");

  useEffect(() => {
    async function load() {
      const persisted = await getActivity();
      const sessionEvents = getSessionActivityEvents();

      const merged = [...sessionEvents, ...persisted].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setItems(merged);
    }

    void load();

    const unsubscribe = subscribeToSessionEvents(() => {
      void load();
    });

    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !q ||
        `${item.title} ${item.description} ${item.actor} ${item.contentType} ${item.type}`
          .toLowerCase()
          .includes(q);
      const matchesContentType = contentType === "all" || item.contentType === contentType;
      const matchesActivityType = activityType === "all" || item.type === activityType;
      return matchesSearch && matchesContentType && matchesActivityType;
    });
  }, [items, search, contentType, activityType]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <aside className="w-full rounded-[30px] border border-white/10 bg-[#12261d] p-5 text-[#f7efe0] shadow-[0_24px_90px_rgba(10,18,15,0.28)] lg:sticky lg:top-6 lg:w-72 lg:shrink-0 lg:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d8b15d]">Basecamp</p>
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  item.active ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 space-y-6">
          <BasecampPageHeader
            eyebrow="Activity"
            title="Activity Log"
            description="Track editorial and system actions across the Trailhead CMS workspace."
            primaryAction={{ label: "Dashboard", href: "/basecamp" }}
            secondaryAction={{ label: "Feature flags", href: "/basecamp/settings/features" }}
          />

          <BasecampSection title="Filter activity" eyebrow="Basecamp" className="p-6">
            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search activity"
                aria-label="Search activity"
                className="h-11 rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
              />

              <select
                value={contentType}
                onChange={(event) => setContentType(event.target.value as ActivityContentType | "all")}
                className="h-11 rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
                aria-label="Filter by content type"
              >
                {contentTypes.map((value) => (
                  <option key={value} value={value}>
                    {value === "all" ? "All content types" : value}
                  </option>
                ))}
              </select>

              <select
                value={activityType}
                onChange={(event) => setActivityType(event.target.value as ActivityType | "all")}
                className="h-11 rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
                aria-label="Filter by activity type"
              >
                {activityTypes.map((value) => (
                  <option key={value} value={value}>
                    {value === "all" ? "All activity types" : value}
                  </option>
                ))}
              </select>
            </div>
          </BasecampSection>

          <BasecampSection title="Activity feed" eyebrow="Basecamp" className="p-6">
            <ActivityFeed
              items={filtered}
              emptyTitle="No activity matches this filter"
              emptyDescription="Try clearing filters to see recent editorial and system actions."
            />
          </BasecampSection>
        </main>
      </div>
    </div>
  );
}

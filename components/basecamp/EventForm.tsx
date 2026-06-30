"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Input, useToasts } from "@/components/ui";
import { EventStatusBadge } from "@/components/basecamp/EventStatusBadge";
import { SaveStatus } from "@/components/basecamp/SaveStatus";
import { useSaveState } from "@/hooks/useSaveState";
import { validateEventForm } from "@/lib/validation/basecampForms";
import type { Event, EventStatus, EventType } from "@/types/Event";
import { BasecampPageHeader } from "./BasecampPageHeader";
import { BasecampPreviewPanel } from "./BasecampPreviewPanel";
import { BasecampTabs } from "./BasecampTabs";

interface EventFormProps {
  initialEvent?: Event;
}

type TabKey = "basic" | "date" | "location" | "media" | "details" | "seo" | "preview";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "basic", label: "Basic" },
  { key: "date", label: "Date & Time" },
  { key: "location", label: "Location" },
  { key: "media", label: "Media" },
  { key: "details", label: "Details" },
  { key: "seo", label: "SEO" },
  { key: "preview", label: "Preview" },
];

const eventTypes: EventType[] = ["market", "festival", "music", "walk", "craft", "community"];
const statusOptions: EventStatus[] = ["draft", "review", "scheduled", "published", "archived"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createEmptyEvent(): Event {
  const now = new Date().toISOString();
  return {
    id: "",
    slug: "",
    title: "",
    description: "",
    eventType: "community",
    status: "draft",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    venuePlaceId: "",
    address: "",
    city: "",
    state: "VT",
    zip: "",
    latitude: 43,
    longitude: -72.5,
    featuredImage: "",
    gallery: [],
    organizerName: "",
    organizerEmail: "",
    organizerWebsite: "",
    cost: "",
    ticketUrl: "",
    categories: [],
    tags: [],
    featured: false,
    seoTitle: "",
    seoDescription: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function EventForm({ initialEvent }: EventFormProps) {
  const [event, setEvent] = useState<Event>(initialEvent ?? createEmptyEvent());
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialEvent?.slug));
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const saveState = useSaveState();
  const { pushToast } = useToasts();

  useEffect(() => {
    if (initialEvent) {
      // Safe local state hydration when editing an existing record.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEvent(initialEvent);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlugTouched(Boolean(initialEvent.slug));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDirty(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({});
      saveState.reset();
    }
  }, [initialEvent]);

  const generatedSlug = useMemo(() => slugify(event.title), [event.title]);
  const displaySlug = event.slug || generatedSlug;

  const markDirty = () => {
    setIsDirty(true);
    if (saveState.status !== "saving") {
      saveState.reset();
    }
  };

  const updateField = <K extends keyof Event>(key: K, value: Event[K]) => {
    markDirty();
    setEvent((current) => ({ ...current, [key]: value }));
  };

  const sleep = (durationMs: number) => new Promise((resolve) => setTimeout(resolve, durationMs));

  const handleSave = async () => {
    const validationErrors = validateEventForm(event);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      saveState.markError("Please fix the highlighted fields.");
      pushToast({ tone: "warning", title: "Event validation failed", description: "Complete required fields before saving." });
      return;
    }

    saveState.startSaving();
    try {
      // TODO(v0.4-write-path): replace optimistic save with repository write + retry queue.
      await sleep(650);
      setEvent((current) => ({ ...current, updatedAt: new Date().toISOString() }));
      setIsDirty(false);
      saveState.markSaved();
      pushToast({ tone: "success", title: "Event saved", description: "Draft changes are up to date." });
    } catch {
      saveState.markError("Unable to save event right now.");
      pushToast({ tone: "error", title: "Save failed", description: "Unable to save event right now." });
    }
  };

  return (
    <div className="space-y-6">
      <BasecampPageHeader
        eyebrow="Basecamp"
        title={initialEvent ? "Edit event" : "Create an event"}
        description="Create and manage seasonal events for the Southern Vermont calendar."
        statusPill={event.status}
        meta={`Last updated ${new Date(event.updatedAt).toLocaleDateString()}`}
        primaryAction={{ label: "Save draft", onClick: handleSave }}
        secondaryAction={{ label: "Back to events", href: "/basecamp/events", variant: "ghost" }}
      />

      <BasecampTabs tabs={tabs} activeKey={activeTab} onChange={(key) => setActiveTab(key as TabKey)} />

      <form className="space-y-6">
        {activeTab === "basic" ? (
          <section className="grid gap-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                <Input
                  value={event.title}
                  onChange={(inputEvent) => {
                    const value = inputEvent.target.value;
                    setEvent((current) => ({
                      ...current,
                      title: value,
                      slug: slugTouched ? current.slug : slugify(value),
                    }));
                    markDirty();
                  }}
                />
                {errors.title ? <p className="mt-1 text-xs text-rose-700">{errors.title}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
                <Input
                  value={displaySlug}
                  onChange={(inputEvent) => {
                    setSlugTouched(true);
                    updateField("slug", inputEvent.target.value);
                  }}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  rows={6}
                  value={event.description}
                  onChange={(inputEvent) => updateField("description", inputEvent.target.value)}
                  className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-base text-(--color-slate) outline-none"
                />
              </div>
            </div>

            <div className="space-y-5 rounded-3xl border border-[#f2e6cb] bg-[#fcfaf6] p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Event Type</label>
                <select value={event.eventType} onChange={(e) => updateField("eventType", e.target.value as EventType)} className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate)">
                  {eventTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
                <select value={event.status} onChange={(e) => updateField("status", e.target.value as EventStatus)} className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate)">
                  {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-full border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={event.featured} onChange={(e) => updateField("featured", e.target.checked)} />
                Featured event
              </label>
            </div>
          </section>
        ) : null}

        {activeTab === "date" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Start date</label>
              <Input type="date" value={event.startDate} onChange={(e) => updateField("startDate", e.target.value)} />
              {errors.startDate ? <p className="mt-1 text-xs text-rose-700">{errors.startDate}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">End date</label>
              <Input type="date" value={event.endDate} onChange={(e) => updateField("endDate", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Start time</label>
              <Input type="time" value={event.startTime} onChange={(e) => updateField("startTime", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">End time</label>
              <Input type="time" value={event.endTime} onChange={(e) => updateField("endTime", e.target.value)} />
            </div>
          </section>
        ) : null}

        {activeTab === "location" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Venue place id</label>
              <Input value={event.venuePlaceId} onChange={(e) => updateField("venuePlaceId", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
              <Input value={event.address} onChange={(e) => updateField("address", e.target.value)} />
              {errors.address ? <p className="mt-1 text-xs text-rose-700">{errors.address}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">City</label>
              <Input value={event.city} onChange={(e) => updateField("city", e.target.value)} />
              {errors.city ? <p className="mt-1 text-xs text-rose-700">{errors.city}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">State</label>
              <Input value={event.state} onChange={(e) => updateField("state", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">ZIP</label>
              <Input value={event.zip} onChange={(e) => updateField("zip", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Latitude</label>
              <Input type="number" value={event.latitude} onChange={(e) => updateField("latitude", Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Longitude</label>
              <Input type="number" value={event.longitude} onChange={(e) => updateField("longitude", Number(e.target.value))} />
            </div>
          </section>
        ) : null}

        {activeTab === "media" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Featured image</label>
              <Input value={event.featuredImage} onChange={(e) => updateField("featuredImage", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Gallery</label>
              <Input value={event.gallery.join(", ")} onChange={(e) => updateField("gallery", parseList(e.target.value))} />
            </div>
          </section>
        ) : null}

        {activeTab === "details" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Organizer name</label>
              <Input value={event.organizerName} onChange={(e) => updateField("organizerName", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Organizer email</label>
              <Input value={event.organizerEmail} onChange={(e) => updateField("organizerEmail", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Organizer website</label>
              <Input value={event.organizerWebsite} onChange={(e) => updateField("organizerWebsite", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Cost</label>
              <Input value={event.cost} onChange={(e) => updateField("cost", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Ticket URL</label>
              <Input value={event.ticketUrl} onChange={(e) => updateField("ticketUrl", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Categories</label>
              <Input value={event.categories.join(", ")} onChange={(e) => updateField("categories", parseList(e.target.value))} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Tags</label>
              <Input value={event.tags.join(", ")} onChange={(e) => updateField("tags", parseList(e.target.value))} />
            </div>
          </section>
        ) : null}

        {activeTab === "seo" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">SEO title</label>
              <Input value={event.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">SEO description</label>
              <Input value={event.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} />
            </div>
          </section>
        ) : null}

        {activeTab === "preview" ? (
          <BasecampPreviewPanel
            heroTitle={event.title || "Untitled event"}
            heroDescription={event.description || "No description yet."}
            badges={[event.eventType, event.status, event.city || "Southern Vermont"]}
            seoSnippet={event.seoDescription || event.description || "No SEO description yet."}
            relatedPlaceholder={event.venuePlaceId ? "Related places are connected through the venue relationship." : "Related places and deals will appear here once connected."}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <SaveStatus status={saveState.status} isDirty={isDirty} errorMessage={saveState.errorMessage} />

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={handleSave} disabled={saveState.status === "saving"}>
              {saveState.status === "saving" ? "Saving..." : "Save"}
            </Button>
            <Link href="/basecamp/events">
              <Button type="button" variant="ghost">Back to events</Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

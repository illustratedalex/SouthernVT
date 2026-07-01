"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Input, useToasts } from "@/components/ui";
import { AutosaveIndicator } from "@/components/basecamp/AutosaveIndicator";
import { PublishConfirmDialog, type PublishActionType } from "@/components/basecamp/PublishConfirmDialog";
import { SaveStatus } from "@/components/basecamp/SaveStatus";
import { useAutosave } from "@/hooks/useAutosave";
import { useSaveState } from "@/hooks/useSaveState";
import { addSessionActivityEvent, addSessionWorkflowEvent } from "@/lib/basecamp/sessionEvents";
import { placeRepository } from "@/lib/repositories/placeRepository";
import { executeWriteWithQueueFallback } from "@/lib/services";
import { validatePlaceForm } from "@/lib/validation/basecampForms";
import type { Place, PlaceMetadata, PlaceStatus, PlaceType } from "@/types/Place";
import type { ContentStatus } from "@/types/Workflow";
import { PlaceGallery } from "./PlaceGallery";
import { PlacePreview } from "./PlacePreview";
import { PlaceStatusBadge } from "./PlaceStatusBadge";
import { PlaceTypeBadge } from "./PlaceTypeBadge";
import { BasecampPageHeader } from "./BasecampPageHeader";
import { BasecampPreviewPanel } from "./BasecampPreviewPanel";
import { BasecampTabs } from "./BasecampTabs";

interface PlaceFormProps {
  initialPlace?: Place;
}

type TabKey = "basic" | "location" | "media" | "categories" | "details" | "knowledge" | "seo" | "preview";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "basic", label: "Basic" },
  { key: "location", label: "Location" },
  { key: "media", label: "Media" },
  { key: "categories", label: "Categories" },
  { key: "details", label: "Details" },
  { key: "knowledge", label: "Knowledge Graph" },
  { key: "seo", label: "SEO" },
  { key: "preview", label: "Preview" },
];

const placeTypes: PlaceType[] = [
  "Restaurant",
  "Waterfall",
  "Brewery",
  "Hotel",
  "Trail",
  "Covered Bridge",
  "Maker Studio",
  "Farm Stand",
  "Scenic Overlook",
  "Shop",
];

const statusOptions: PlaceStatus[] = ["draft", "review", "scheduled", "published", "archived"];

const workflowTransitions: Record<PlaceStatus, PlaceStatus[]> = {
  draft: ["review", "archived"],
  review: ["scheduled", "published"],
  scheduled: ["published"],
  published: ["archived"],
  archived: [],
};

const actionTarget: Record<PublishActionType, PlaceStatus> = {
  review: "review",
  schedule: "scheduled",
  publish: "published",
  archive: "archived",
};

const actionNote: Record<PublishActionType, string> = {
  review: "Moved to editorial review.",
  schedule: "Scheduled for publication.",
  publish: "Published and ready for public visibility.",
  archive: "Archived from active publishing.",
};

const dynamicFieldConfig: Record<
  PlaceType,
  Array<{
    key: string;
    label: string;
    type: "text" | "checkbox";
  }>
> = {
  Restaurant: [
    { key: "cuisine", label: "Cuisine", type: "text" },
    { key: "reservations", label: "Reservations", type: "checkbox" },
    { key: "outdoorSeating", label: "Outdoor Seating", type: "checkbox" },
  ],
  Waterfall: [
    { key: "height", label: "Height", type: "text" },
    { key: "swimming", label: "Swimming", type: "checkbox" },
    { key: "trailDistance", label: "Trail Distance", type: "text" },
    { key: "difficulty", label: "Difficulty", type: "text" },
  ],
  Brewery: [
    { key: "cuisine", label: "Cuisine / Food Pairings", type: "text" },
    { key: "reservations", label: "Reservations", type: "checkbox" },
    { key: "outdoorSeating", label: "Outdoor Seating", type: "checkbox" },
  ],
  Hotel: [
    { key: "rooms", label: "Rooms", type: "text" },
    { key: "checkIn", label: "Check-in", type: "text" },
    { key: "petFriendly", label: "Pet Friendly", type: "checkbox" },
  ],
  Trail: [
    { key: "distance", label: "Distance", type: "text" },
    { key: "elevationGain", label: "Elevation Gain", type: "text" },
    { key: "loop", label: "Loop", type: "checkbox" },
    { key: "dogsAllowed", label: "Dogs Allowed", type: "checkbox" },
  ],
  "Covered Bridge": [],
  "Maker Studio": [],
  "Farm Stand": [],
  "Scenic Overlook": [],
  Shop: [
    { key: "products", label: "Products", type: "text" },
    { key: "localMade", label: "Local Made", type: "checkbox" },
    { key: "shippingAvailable", label: "Shipping Available", type: "checkbox" },
  ],
};

function createEmptyPlace(): Place {
  return {
    id: "",
    slug: "",
    name: "",
    description: "",
    placeType: "Restaurant",
    categories: [],
    tags: [],
    address: "",
    city: "",
    state: "VT",
    zip: "",
    latitude: 43.0,
    longitude: -72.5,
    phone: "",
    email: "",
    website: "",
    hours: "",
    featuredImage: "",
    gallery: [],
    amenities: [],
    featured: false,
    status: "draft",
    metadata: {},
    relatedPlaces: [],
    seoTitle: "",
    seoDescription: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

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

function getSectionMetadata(place: Place) {
  return place.metadata[place.placeType as keyof PlaceMetadata] ?? {};
}

export function PlaceForm({ initialPlace }: PlaceFormProps) {
  const [place, setPlace] = useState<Place>(initialPlace ?? createEmptyPlace());
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [slugTouched, setSlugTouched] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSaveAction, setActiveSaveAction] = useState<"draft" | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PublishActionType>("publish");
  const saveState = useSaveState();
  const { pushToast } = useToasts();

  useEffect(() => {
    if (initialPlace) {
      // Safe local state hydration when switching edited place records.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlace(initialPlace);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlugTouched(Boolean(initialPlace.slug));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDirty(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({});
      saveState.reset();
    }
  }, [initialPlace]);

  const generatedSlug = useMemo(() => slugify(place.name), [place.name]);
  const displaySlug = place.slug || generatedSlug;
  const metadataFields = dynamicFieldConfig[place.placeType];
  const metadataValues = getSectionMetadata(place) as Record<string, string | boolean | undefined>;

  const markDirty = () => {
    setIsDirty(true);
    if (saveState.status !== "saving") {
      saveState.reset();
    }
  };

  const updateField = <K extends keyof Place>(key: K, value: Place[K]) => {
    markDirty();
    setPlace((current) => ({ ...current, [key]: value }));
  };

  const updateMetadataField = (key: string, value: string | boolean) => {
    markDirty();
    const section = place.placeType as keyof PlaceMetadata;
    setPlace((current) => ({
      ...current,
      metadata: {
        ...current.metadata,
        [section]: {
          ...(current.metadata[section] as Record<string, string | boolean> | undefined),
          [key]: value,
        },
      },
    }));
  };

  const handleNameChange = (value: string) => {
    markDirty();
    setPlace((current) => ({
      ...current,
      name: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  };

  const sleep = (durationMs: number) => new Promise((resolve) => setTimeout(resolve, durationMs));

  const toPlaceInput = (value: Place): Omit<Place, "id" | "createdAt" | "updatedAt"> => {
    const { id, createdAt, updatedAt, ...input } = value;
    return input;
  };

  const persistPlace = async (nextStatus: PlaceStatus) => {
    const draft = { ...place, status: nextStatus };
    const payload = toPlaceInput(draft);

    if (place.id) {
      return executeWriteWithQueueFallback("place.update", { id: place.id, updates: payload }, async () => {
        const updated = await placeRepository.update(place.id, payload);
        if (!updated) {
          throw new Error("Place update returned no record.");
        }
        return updated;
      });
    }

    return executeWriteWithQueueFallback("place.create", payload, () => placeRepository.create(payload));
  };

  const autosaveEnabled = place.status === "draft";

  const autosave = useAutosave({
    enabled: autosaveEnabled,
    data: place,
    delayMs: 1200,
    onSave: useCallback(async () => {
      await sleep(550);
      setPlace((current) => ({ ...current, updatedAt: new Date().toISOString() }));
      setIsDirty(false);
    }, []),
  });

  const canTransition = (fromStatus: PlaceStatus, toStatus: PlaceStatus) => workflowTransitions[fromStatus].includes(toStatus);

  const beginTransition = (action: PublishActionType) => {
    const target = actionTarget[action];
    if (!canTransition(place.status, target)) {
      return;
    }

    setPendingAction(action);
    setIsConfirmOpen(true);
  };

  const completeTransition = async () => {
    const target = actionTarget[pendingAction];
    const fromStatus = place.status;

    if (!canTransition(fromStatus, target)) {
      setIsConfirmOpen(false);
      return;
    }

    saveState.startSaving();

    try {
      const persisted = await persistPlace(target);
      setPlace(persisted);

      addSessionWorkflowEvent({
        contentType: "place",
        contentId: persisted.id || place.id || displaySlug || "new-place",
        fromStatus: fromStatus as ContentStatus,
        toStatus: target as ContentStatus,
        note: actionNote[pendingAction],
        createdBy: "Alex",
      });

      addSessionActivityEvent({
        type: target === "published" ? "published" : target === "archived" ? "archived" : "status_changed",
        contentType: "place",
        contentId: persisted.id || place.id || displaySlug || "new-place",
        title: `${persisted.name || place.name || "Untitled place"} ${target}`,
        description: `${fromStatus} to ${target}. ${actionNote[pendingAction]}`,
        actor: "Alex",
        metadata: { fromStatus, toStatus: target },
      });

      setIsDirty(false);
      saveState.markSaved();
    } catch {
      saveState.markError("Unable to apply workflow transition.");
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const handleSimulatedSave = async (nextStatus: PlaceStatus, action: "draft") => {
    const validationErrors = validatePlaceForm(place);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      saveState.markError("Please fix the highlighted fields.");
      pushToast({ tone: "warning", title: "Place validation failed", description: "Complete required fields before saving." });
      return;
    }

    saveState.startSaving();
    setActiveSaveAction(action);

    try {
      const persisted = await persistPlace(nextStatus);
      setPlace(persisted);
      setIsDirty(false);
      saveState.markSaved();
      pushToast({ tone: "success", title: "Place saved", description: "Draft changes are up to date." });
    } catch {
      saveState.markError("Unable to save place right now.");
      pushToast({ tone: "error", title: "Save failed", description: "Unable to save place right now." });
    } finally {
      setActiveSaveAction(null);
    }
  };

  const title = initialPlace ? "Edit place" : "Create a new place";

  return (
    <div className="space-y-6">
      <BasecampPageHeader
        eyebrow="Basecamp"
        title={title}
        description="Manage a single Southern Vermont place with flexible content, metadata, and a preview that matches the public experience."
        statusPill={place.status}
        meta={`Last updated ${new Date(place.updatedAt).toLocaleDateString()}`}
        primaryAction={{ label: "Save draft", onClick: () => handleSimulatedSave("draft", "draft") }}
        secondaryAction={{ label: "Back to places", href: "/basecamp/places", variant: "ghost" }}
      />

      <div className="flex items-center gap-3">
        <AutosaveIndicator enabled={autosaveEnabled} isAutosaving={autosave.isAutosaving} lastSavedAt={autosave.lastSavedAt} />
        <PlaceTypeBadge placeType={place.placeType} />
        <PlaceStatusBadge status={place.status} />
      </div>

      <BasecampTabs tabs={tabs} activeKey={activeTab} onChange={(key) => setActiveTab(key as TabKey)} />

      <form className="space-y-6">
        {activeTab === "basic" ? (
          <section className="grid gap-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
                <Input value={place.name} onChange={(event) => handleNameChange(event.target.value)} />
                {errors.name ? <p className="mt-1 text-xs text-rose-700">{errors.name}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
                <Input
                  value={displaySlug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    updateField("slug", event.target.value);
                  }}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  rows={6}
                  value={place.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
                />
                {errors.description ? <p className="mt-1 text-xs text-rose-700">{errors.description}</p> : null}
              </div>
            </div>

            <div className="space-y-5 rounded-3xl border border-[#f2e6cb] bg-[#fcfaf6] p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Place Type</label>
                <select
                  value={place.placeType}
                  onChange={(event) => {
                    const nextType = event.target.value as PlaceType;
                    updateField("placeType", nextType);
                    if (!place.metadata[nextType as keyof PlaceMetadata]) {
                      setPlace((current) => ({ ...current, metadata: { ...current.metadata, [nextType]: {} } }));
                    }
                  }}
                  className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
                >
                  {placeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-full border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={place.featured} onChange={(event) => updateField("featured", event.target.checked)} />
                Featured place
              </label>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
                <select
                  value={place.status}
                  onChange={(event) => {
                    const nextStatus = event.target.value as PlaceStatus;
                    if (nextStatus === place.status || canTransition(place.status, nextStatus)) {
                      updateField("status", nextStatus);
                    }
                  }}
                  className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} disabled={status !== place.status && !canTransition(place.status, status)}>
                      {status}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">Workflow transitions control which statuses are available.</p>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "location" ? (
          <section className="space-y-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
                <Input value={place.address} onChange={(event) => updateField("address", event.target.value)} />
                {errors.address ? <p className="mt-1 text-xs text-rose-700">{errors.address}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">City</label>
                <Input value={place.city} onChange={(event) => updateField("city", event.target.value)} />
                {errors.city ? <p className="mt-1 text-xs text-rose-700">{errors.city}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">State</label>
                <Input value={place.state} onChange={(event) => updateField("state", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">ZIP</label>
                <Input value={place.zip} onChange={(event) => updateField("zip", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Latitude</label>
                <Input type="number" value={place.latitude} onChange={(event) => updateField("latitude", Number(event.target.value))} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Longitude</label>
                <Input type="number" value={place.longitude} onChange={(event) => updateField("longitude", Number(event.target.value))} />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
                <Input value={place.phone} onChange={(event) => updateField("phone", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <Input value={place.email} onChange={(event) => updateField("email", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Website</label>
                <Input value={place.website} onChange={(event) => updateField("website", event.target.value)} />
              </div>
              <div className="md:col-span-2 xl:col-span-3">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Hours</label>
                <Input value={place.hours} onChange={(event) => updateField("hours", event.target.value)} />
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "media" ? (
          <section className="space-y-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Featured Image</label>
                <Input value={place.featuredImage} onChange={(event) => updateField("featuredImage", event.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Gallery</label>
                <Input value={place.gallery.join(", ")} onChange={(event) => updateField("gallery", parseList(event.target.value))} placeholder="Comma separated image URLs" />
              </div>
            </div>
            <PlaceGallery images={place.gallery} />
          </section>
        ) : null}

        {activeTab === "categories" ? (
          <section className="space-y-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Categories</label>
                <Input value={place.categories.join(", ")} onChange={(event) => updateField("categories", parseList(event.target.value))} placeholder="Shopping, Dining, Scenic" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tags</label>
                <Input value={place.tags.join(", ")} onChange={(event) => updateField("tags", parseList(event.target.value))} placeholder="family-friendly, local-made" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Amenities</label>
              <textarea
                rows={4}
                value={place.amenities.join(", ")}
                onChange={(event) => updateField("amenities", parseList(event.target.value))}
                className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Related Places</label>
              <Input value={place.relatedPlaces.join(", ")} onChange={(event) => updateField("relatedPlaces", parseList(event.target.value))} placeholder="place-hamilton-falls, place-putney-mountain" />
            </div>
          </section>
        ) : null}

        {activeTab === "details" ? (
          <section className="space-y-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <div className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
              <h3 className="text-lg font-semibold text-slate-900">Type-specific metadata</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Fields below change automatically for the selected place type.</p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {metadataFields.length ? (
                  metadataFields.map((field) => (
                    <div key={field.key}>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</label>
                      {field.type === "checkbox" ? (
                        <label className="flex items-center gap-3 rounded-full border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={Boolean(metadataValues[field.key])}
                            onChange={(event) => updateMetadataField(field.key, event.target.checked)}
                          />
                          {field.label}
                        </label>
                      ) : (
                        <Input
                          value={String(metadataValues[field.key] ?? "")}
                          onChange={(event) => updateMetadataField(field.key, event.target.value)}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">This place type does not need extra metadata fields.</p>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "knowledge" ? (
          <section className="grid gap-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Knowledge Graph</p>
              <h2 className="text-2xl font-semibold text-slate-900">Node wiring for this place</h2>
              <p className="text-sm leading-7 text-slate-600">
                This tab tracks how this place connects to collections, guides, events, deals, media, and stories in the Compass graph.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Graph node id</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{`place:${place.id || displaySlug || "new"}`}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Direct place links</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{place.relatedPlaces.length}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-[#f2e6cb] bg-[#fcfaf6] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Connection signals</h3>
              <p className="text-sm text-slate-600">Tags, categories, and explicit relationships all contribute to recommendation weight.</p>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Tags</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {place.tags.length ? (
                    place.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#d8c6a6] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No tags set yet.</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Categories</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {place.categories.length ? (
                    place.categories.map((category) => (
                      <span key={category} className="rounded-full border border-[#d8c6a6] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No categories set yet.</span>
                  )}
                </div>
              </div>

              <Link
                href={`/basecamp/graph?node=${encodeURIComponent(`place:${place.id || displaySlug || "new"}`)}`}
                className="inline-flex rounded-full bg-[#1f3b2f] px-4 py-2 text-xs font-semibold text-[#f8f2e4]"
              >
                Open full graph explorer
              </Link>
            </div>
          </section>
        ) : null}

        {activeTab === "seo" ? (
          <section className="space-y-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">SEO Title</label>
                <Input value={place.seoTitle} onChange={(event) => updateField("seoTitle", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">SEO Description</label>
                <Input value={place.seoDescription} onChange={(event) => updateField("seoDescription", event.target.value)} />
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "preview" ? (
          <BasecampPreviewPanel
            heroTitle={place.name || "Untitled place"}
            heroDescription={place.description || "No description yet."}
            badges={[place.placeType, place.status, place.featured ? "Featured" : "Guide stop"]}
            seoSnippet={place.seoDescription || place.description || "No SEO description yet."}
            relatedPlaceholder={place.relatedPlaces.length ? "Related places and collections are connected through the relationship tools." : "Nearby places, collections, guides, events, and deals will appear here once connected."}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <SaveStatus status={saveState.status} isDirty={isDirty} errorMessage={saveState.errorMessage} />

          <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSimulatedSave("draft", "draft")}
            disabled={saveState.status === "saving"}
          >
            {saveState.status === "saving" && activeSaveAction === "draft" ? "Saving..." : "Save Draft"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => beginTransition("review")} disabled={!canTransition(place.status, "review") || saveState.status === "saving"}>
            Move to Review
          </Button>
          <Button type="button" variant="ghost" onClick={() => beginTransition("schedule")} disabled={!canTransition(place.status, "scheduled") || saveState.status === "saving"}>
            Schedule
          </Button>
          <Button type="button" variant="primary" onClick={() => beginTransition("publish")} disabled={!canTransition(place.status, "published") || saveState.status === "saving"}>
            Publish
          </Button>
          <Button type="button" variant="ghost" onClick={() => beginTransition("archive")} disabled={!canTransition(place.status, "archived") || saveState.status === "saving"}>
            Archive
          </Button>
          <Link href="/basecamp/places">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          </div>
        </div>
      </form>

      <PublishConfirmDialog
        open={isConfirmOpen}
        action={pendingAction}
        contentLabel={place.name || "Untitled place"}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={completeTransition}
      />
    </div>
  );
}

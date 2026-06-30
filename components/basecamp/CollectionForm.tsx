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
import { validateCollectionForm } from "@/lib/validation/basecampForms";
import type { Collection, CollectionAudience, CollectionSeason, CollectionStatus } from "@/types/Collection";
import type { Place } from "@/types/Place";
import type { ContentStatus } from "@/types/Workflow";
import { CollectionPreview } from "./CollectionPreview";
import { SelectedPlacesList } from "./SelectedPlacesList";
import { CollectionStatusBadge } from "./CollectionStatusBadge";
import { BasecampPageHeader } from "./BasecampPageHeader";
import { BasecampPreviewPanel } from "./BasecampPreviewPanel";
import { BasecampTabs } from "./BasecampTabs";

interface CollectionFormProps {
  initialCollection?: Collection;
}

type TabKey = "basic" | "places" | "media" | "audience" | "seo" | "preview";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "basic", label: "Basic" },
  { key: "places", label: "Places" },
  { key: "media", label: "Media" },
  { key: "audience", label: "Audience" },
  { key: "seo", label: "SEO" },
  { key: "preview", label: "Preview" },
];

const seasons: CollectionSeason[] = ["Spring", "Summer", "Fall", "Winter", "Year-Round"];
const audiences: CollectionAudience[] = ["Families", "Couples", "Road Trippers", "Food Lovers", "Outdoor Explorers", "Local Explorers"];
const statusOptions: CollectionStatus[] = ["draft", "review", "scheduled", "published", "archived"];

const workflowTransitions: Record<CollectionStatus, CollectionStatus[]> = {
  draft: ["review", "archived"],
  review: ["scheduled", "published"],
  scheduled: ["published"],
  published: ["archived"],
  archived: [],
};

const actionTarget: Record<PublishActionType, CollectionStatus> = {
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

function createEmptyCollection(): Collection {
  return {
    id: "",
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    featuredImage: "",
    gallery: [],
    places: [],
    tags: [],
    season: "Year-Round",
    audience: "Local Explorers",
    status: "draft",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function CollectionForm({ initialCollection }: CollectionFormProps) {
  const [collection, setCollection] = useState<Collection>(() => initialCollection ?? createEmptyCollection());
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(initialCollection?.slug));
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [pendingAction, setPendingAction] = useState<PublishActionType>("review");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeSaveAction, setActiveSaveAction] = useState<"draft" | null>(null);

  const saveState = useSaveState();
  const { pushToast } = useToasts();

  useEffect(() => {
    async function loadPlaces() {
      const places = await placeRepository.getAll();
      setAvailablePlaces(places);
    }

    loadPlaces();
  }, []);

  useEffect(() => {
    if (initialCollection) {
      // Safe local state hydration when editing an existing record.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollection(initialCollection);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlugTouched(Boolean(initialCollection.slug));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDirty(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({});
      saveState.reset();
    }
  }, [initialCollection]);

  const generatedSlug = useMemo(() => slugify(collection.title), [collection.title]);
  const displaySlug = collection.slug || generatedSlug;

  const selectedPlaces = useMemo(
    () => collection.places.map((id) => availablePlaces.find((place) => place.id === id)).filter(Boolean) as Place[],
    [availablePlaces, collection.places],
  );

  const markDirty = () => {
    setIsDirty(true);
    if (saveState.status !== "saving") {
      saveState.reset();
    }
  };

  const updateField = <K extends keyof Collection>(key: K, value: Collection[K]) => {
    markDirty();
    setCollection((current) => ({ ...current, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    markDirty();
    setCollection((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  };

  const togglePlace = (placeId: string) => {
    markDirty();
    setCollection((current) => ({
      ...current,
      places: current.places.includes(placeId) ? current.places.filter((id) => id !== placeId) : [...current.places, placeId],
    }));
  };

  const movePlace = (placeId: string, direction: -1 | 1) => {
    markDirty();
    setCollection((current) => {
      const index = current.places.indexOf(placeId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.places.length) {
        return current;
      }

      const nextPlaces = [...current.places];
      [nextPlaces[index], nextPlaces[nextIndex]] = [nextPlaces[nextIndex], nextPlaces[index]];
      return { ...current, places: nextPlaces };
    });
  };

  const removePlace = (placeId: string) => {
    markDirty();
    setCollection((current) => ({ ...current, places: current.places.filter((id) => id !== placeId) }));
  };

  const sleep = (durationMs: number) => new Promise((resolve) => setTimeout(resolve, durationMs));

  const autosaveEnabled = collection.status === "draft";

  const autosave = useAutosave({
    enabled: autosaveEnabled,
    data: collection,
    delayMs: 1200,
    onSave: useCallback(async () => {
      await sleep(550);
      setCollection((current) => ({ ...current, updatedAt: new Date().toISOString() }));
      setIsDirty(false);
    }, []),
  });

  const canTransition = (fromStatus: CollectionStatus, toStatus: CollectionStatus) => workflowTransitions[fromStatus].includes(toStatus);

  const beginTransition = (action: PublishActionType) => {
    const target = actionTarget[action];
    if (!canTransition(collection.status, target)) {
      return;
    }

    setPendingAction(action);
    setIsConfirmOpen(true);
  };

  const completeTransition = async () => {
    const target = actionTarget[pendingAction];
    const fromStatus = collection.status;

    if (!canTransition(fromStatus, target)) {
      setIsConfirmOpen(false);
      return;
    }

    saveState.startSaving();

    try {
      // TODO(v0.4-write-path): replace optimistic status transition with repository write + retry queue.
      setCollection((current) => ({ ...current, status: target }));
      await sleep(700);
      setCollection((current) => ({ ...current, updatedAt: new Date().toISOString() }));

      addSessionWorkflowEvent({
        contentType: "collection",
        contentId: collection.id || displaySlug || "new-collection",
        fromStatus: fromStatus as ContentStatus,
        toStatus: target as ContentStatus,
        note: actionNote[pendingAction],
        createdBy: "Alex",
      });

      addSessionActivityEvent({
        type: target === "published" ? "published" : target === "archived" ? "archived" : "status_changed",
        contentType: "collection",
        contentId: collection.id || displaySlug || "new-collection",
        title: `${collection.title || "Untitled collection"} ${target}`,
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

  const handleSimulatedSave = async (nextStatus: CollectionStatus, action: "draft") => {
    const validationErrors = validateCollectionForm(collection);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      saveState.markError("Please fix the highlighted fields.");
      pushToast({ tone: "warning", title: "Collection validation failed", description: "Complete required fields before saving." });
      return;
    }

    saveState.startSaving();
    setActiveSaveAction(action);

    try {
      setCollection((current) => ({ ...current, status: nextStatus }));

      // TODO(v0.4-write-path): replace simulated save delay with repository write + retry queue.
      await sleep(700);

      setCollection((current) => ({ ...current, updatedAt: new Date().toISOString() }));
      setIsDirty(false);
      saveState.markSaved();
      pushToast({ tone: "success", title: "Collection saved", description: "Draft changes are up to date." });
    } catch {
      saveState.markError("Unable to save collection right now.");
      pushToast({ tone: "error", title: "Save failed", description: "Unable to save collection right now." });
    } finally {
      setActiveSaveAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <BasecampPageHeader
        eyebrow="Basecamp"
        title={initialCollection ? "Edit collection" : "Create a collection"}
        description="Curate a guide by combining existing Southern Vermont places into a polished editorial collection."
        statusPill={collection.status}
        meta={`Last updated ${new Date(collection.updatedAt).toLocaleDateString()}`}
        primaryAction={{ label: "Save draft", onClick: () => handleSimulatedSave("draft", "draft") }}
        secondaryAction={{ label: "Back to collections", href: "/basecamp/collections", variant: "ghost" }}
      />

      <div className="flex items-center gap-3">
        <AutosaveIndicator enabled={autosaveEnabled} isAutosaving={autosave.isAutosaving} lastSavedAt={autosave.lastSavedAt} />
        <CollectionStatusBadge status={collection.status} />
        {collection.featured ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">Featured</span> : null}
      </div>

      <BasecampTabs tabs={tabs} activeKey={activeTab} onChange={(key) => setActiveTab(key as TabKey)} />

      <form className="space-y-6">
        {activeTab === "basic" ? (
          <section className="grid gap-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                <Input value={collection.title} onChange={(event) => handleTitleChange(event.target.value)} />
                {errors.title ? <p className="mt-1 text-xs text-rose-700">{errors.title}</p> : null}
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">Subtitle</label>
                <Input value={collection.subtitle} onChange={(event) => updateField("subtitle", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  rows={6}
                  value={collection.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
                />
                {errors.description ? <p className="mt-1 text-xs text-rose-700">{errors.description}</p> : null}
              </div>
            </div>

            <div className="space-y-5 rounded-3xl border border-[#f2e6cb] bg-[#fcfaf6] p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Season</label>
                <select
                  value={collection.season}
                  onChange={(event) => updateField("season", event.target.value as CollectionSeason)}
                  className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Audience</label>
                <select
                  value={collection.audience}
                  onChange={(event) => updateField("audience", event.target.value as CollectionAudience)}
                  className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
                >
                  {audiences.map((audience) => (
                    <option key={audience} value={audience}>
                      {audience}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
                <select
                  value={collection.status}
                  onChange={(event) => {
                    const nextStatus = event.target.value as CollectionStatus;
                    if (nextStatus === collection.status || canTransition(collection.status, nextStatus)) {
                      updateField("status", nextStatus);
                    }
                  }}
                  className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} disabled={status !== collection.status && !canTransition(collection.status, status)}>
                      {status}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">Workflow transitions control which statuses are available.</p>
              </div>
              <label className="flex items-center gap-3 rounded-full border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={collection.featured} onChange={(event) => updateField("featured", event.target.checked)} />
                Featured collection
              </label>
            </div>
          </section>
        ) : null}

        {activeTab === "places" ? (
          <section className="grid gap-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Available Places</h3>
                <p className="mt-1 text-sm text-slate-600">Choose places from the mock library to build this guide.</p>
              </div>
              <div className="grid gap-3">
                {availablePlaces.map((place) => {
                  const selected = collection.places.includes(place.id);
                  return (
                    <label key={place.id} className="flex items-start gap-3 rounded-[22px] border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-4">
                      <input type="checkbox" checked={selected} onChange={() => togglePlace(place.id)} className="mt-1" />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{place.name}</p>
                        <p className="text-sm text-slate-600">{place.placeType} · {place.city}, {place.state}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{place.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-[#f2e6cb] bg-[#fcfaf6] p-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Selected Places</h3>
                <p className="mt-1 text-sm text-slate-600">Reorder the guide to shape the story and flow.</p>
              </div>
              <SelectedPlacesList places={selectedPlaces} onMoveUp={(id) => movePlace(id, -1)} onMoveDown={(id) => movePlace(id, 1)} onRemove={removePlace} />
            </div>
          </section>
        ) : null}

        {activeTab === "media" ? (
          <section className="space-y-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Featured Image</label>
                <Input value={collection.featuredImage} onChange={(event) => updateField("featuredImage", event.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Gallery</label>
                <Input value={collection.gallery.join(", ")} onChange={(event) => updateField("gallery", parseList(event.target.value))} placeholder="Comma separated image URLs" />
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "audience" ? (
          <section className="space-y-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Tags</label>
              <Input value={collection.tags.join(", ")} onChange={(event) => updateField("tags", parseList(event.target.value))} placeholder="family, summer, scenic" />
            </div>
          </section>
        ) : null}

        {activeTab === "seo" ? (
          <section className="space-y-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">SEO Title</label>
                <Input value={collection.seoTitle} onChange={(event) => updateField("seoTitle", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">SEO Description</label>
                <Input value={collection.seoDescription} onChange={(event) => updateField("seoDescription", event.target.value)} />
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "preview" ? (
          <BasecampPreviewPanel
            heroTitle={collection.title || "Untitled collection"}
            heroDescription={collection.subtitle || collection.description || "No description yet."}
            badges={[collection.season, collection.audience, collection.status]}
            seoSnippet={collection.seoDescription || collection.description || "No SEO description yet."}
            relatedPlaceholder={selectedPlaces.length ? "Places connected to this collection will appear in the relationships section." : "Related places, guides, and events will appear here once selected."}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <SaveStatus status={saveState.status} isDirty={isDirty} errorMessage={saveState.errorMessage} />

          <div className="flex flex-wrap gap-3">
          {displaySlug ? (
            <Link href={`/collections/${displaySlug}`} target="_blank" rel="noreferrer">
              <Button type="button" variant="ghost">
                Preview
              </Button>
            </Link>
          ) : (
            <Button type="button" variant="ghost" disabled>
              Preview
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSimulatedSave("draft", "draft")}
            disabled={saveState.status === "saving"}
          >
            {saveState.status === "saving" && activeSaveAction === "draft" ? "Saving..." : "Save Draft"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => beginTransition("review")} disabled={!canTransition(collection.status, "review") || saveState.status === "saving"}>
            Move to Review
          </Button>
          <Button type="button" variant="ghost" onClick={() => beginTransition("schedule")} disabled={!canTransition(collection.status, "scheduled") || saveState.status === "saving"}>
            Schedule
          </Button>
          <Button type="button" variant="primary" onClick={() => beginTransition("publish")} disabled={!canTransition(collection.status, "published") || saveState.status === "saving"}>
            Publish
          </Button>
          <Button type="button" variant="ghost" onClick={() => beginTransition("archive")} disabled={!canTransition(collection.status, "archived") || saveState.status === "saving"}>
            Archive
          </Button>
          <Link href="/basecamp/collections">
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
        contentLabel={collection.title || "Untitled collection"}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={completeTransition}
      />
    </div>
  );
}

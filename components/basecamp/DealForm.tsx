"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Input, useToasts } from "@/components/ui";
import { DealStatusBadge } from "@/components/basecamp/DealStatusBadge";
import { SaveStatus } from "@/components/basecamp/SaveStatus";
import { useSaveState } from "@/hooks/useSaveState";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { placeRepository } from "@/lib/repositories/placeRepository";
import { validateDealForm } from "@/lib/validation/basecampForms";
import type { Collection } from "@/types/Collection";
import type { Deal, DealRedemptionMethod, DealStatus, DealType } from "@/types/Deal";
import type { Place } from "@/types/Place";
import { BasecampPageHeader } from "./BasecampPageHeader";
import { BasecampPreviewPanel } from "./BasecampPreviewPanel";
import { BasecampTabs } from "./BasecampTabs";

interface DealFormProps {
  initialDeal?: Deal;
}

type TabKey = "basic" | "offer" | "place" | "media" | "seo" | "preview";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "basic", label: "Basic" },
  { key: "offer", label: "Offer" },
  { key: "place", label: "Place" },
  { key: "media", label: "Media" },
  { key: "seo", label: "SEO" },
  { key: "preview", label: "Preview" },
];

const statuses: DealStatus[] = ["draft", "review", "scheduled", "published", "archived"];
const dealTypes: DealType[] = ["discount", "freebie", "package", "seasonal", "event", "member_only"];
const redemptionMethods: DealRedemptionMethod[] = ["show_phone", "code", "qr", "link", "in_person"];

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

function createEmptyDeal(): Deal {
  const now = new Date().toISOString();
  return {
    id: "",
    slug: "",
    title: "",
    description: "",
    shortDescription: "",
    status: "draft",
    dealType: "discount",
    placeId: "",
    collectionId: "",
    code: "",
    terms: "",
    startDate: "",
    endDate: "",
    redemptionMethod: "show_phone",
    redemptionUrl: "",
    featuredImage: "",
    featured: false,
    categories: [],
    tags: [],
    seoTitle: "",
    seoDescription: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function DealForm({ initialDeal }: DealFormProps) {
  const [deal, setDeal] = useState<Deal>(initialDeal ?? createEmptyDeal());
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialDeal?.slug));
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [places, setPlaces] = useState<Place[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const saveState = useSaveState();
  const { pushToast } = useToasts();

  useEffect(() => {
    async function loadDependencies() {
      const [loadedPlaces, loadedCollections] = await Promise.all([placeRepository.getAll(), getCollections()]);
      setPlaces(loadedPlaces);
      setCollections(loadedCollections.filter((collection) => collection.status === "published"));
    }

    loadDependencies();
  }, []);

  useEffect(() => {
    if (initialDeal) {
      // Safe local state hydration when editing an existing record.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeal(initialDeal);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlugTouched(Boolean(initialDeal.slug));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDirty(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({});
      saveState.reset();
    }
  }, [initialDeal]);

  const generatedSlug = useMemo(() => slugify(deal.title), [deal.title]);
  const displaySlug = deal.slug || generatedSlug;

  const markDirty = () => {
    setIsDirty(true);
    if (saveState.status !== "saving") {
      saveState.reset();
    }
  };

  const updateField = <K extends keyof Deal>(key: K, value: Deal[K]) => {
    markDirty();
    setDeal((current) => ({ ...current, [key]: value }));
  };

  const sleep = (durationMs: number) => new Promise((resolve) => setTimeout(resolve, durationMs));

  const handleSave = async () => {
    const validationErrors = validateDealForm(deal);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      saveState.markError("Please fix the highlighted fields.");
      pushToast({ tone: "warning", title: "Deal validation failed", description: "Complete required fields before saving." });
      return;
    }

    saveState.startSaving();
    try {
      // TODO(v0.4-write-path): replace simulated save delay with repository write + retry queue.
      await sleep(650);
      setDeal((current) => ({ ...current, updatedAt: new Date().toISOString() }));
      setIsDirty(false);
      saveState.markSaved();
      pushToast({ tone: "success", title: "Deal saved", description: "Draft changes are up to date." });
    } catch {
      saveState.markError("Unable to save deal right now.");
      pushToast({ tone: "error", title: "Save failed", description: "Unable to save deal right now." });
    }
  };

  return (
    <div className="space-y-6">
      <BasecampPageHeader
        eyebrow="Basecamp"
        title={initialDeal ? "Edit deal" : "Create a deal"}
        description="Create and manage partner offers for Southern Vermont visitors."
        statusPill={deal.status}
        meta={`Last updated ${new Date(deal.updatedAt).toLocaleDateString()}`}
        primaryAction={{ label: "Save draft", onClick: handleSave }}
        secondaryAction={{ label: "Back to deals", href: "/basecamp/deals", variant: "ghost" }}
      />

      <BasecampTabs tabs={tabs} activeKey={activeTab} onChange={(key) => setActiveTab(key as TabKey)} />

      <form className="space-y-6">
        {activeTab === "basic" ? (
          <section className="grid gap-6 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                <Input
                  value={deal.title}
                  onChange={(inputEvent) => {
                    const value = inputEvent.target.value;
                    setDeal((current) => ({
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">Short description</label>
                <Input value={deal.shortDescription} onChange={(inputEvent) => updateField("shortDescription", inputEvent.target.value)} />
                {errors.shortDescription ? <p className="mt-1 text-xs text-rose-700">{errors.shortDescription}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  rows={6}
                  value={deal.description}
                  onChange={(inputEvent) => updateField("description", inputEvent.target.value)}
                  className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-base text-(--color-slate) outline-none"
                />
              </div>
            </div>

            <div className="space-y-5 rounded-3xl border border-[#f2e6cb] bg-[#fcfaf6] p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Deal type</label>
                <select value={deal.dealType} onChange={(event) => updateField("dealType", event.target.value as DealType)} className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate)">
                  {dealTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
                <select value={deal.status} onChange={(event) => updateField("status", event.target.value as DealStatus)} className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate)">
                  {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-full border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={deal.featured} onChange={(event) => updateField("featured", event.target.checked)} />
                Featured deal
              </label>
            </div>
          </section>
        ) : null}

        {activeTab === "offer" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Code</label>
              <Input value={deal.code ?? ""} onChange={(event) => updateField("code", event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Redemption method</label>
              <select value={deal.redemptionMethod} onChange={(event) => updateField("redemptionMethod", event.target.value as DealRedemptionMethod)} className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate)">
                {redemptionMethods.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Redemption URL</label>
              <Input value={deal.redemptionUrl ?? ""} onChange={(event) => updateField("redemptionUrl", event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Start date</label>
              <Input type="date" value={deal.startDate} onChange={(event) => updateField("startDate", event.target.value)} />
              {errors.startDate ? <p className="mt-1 text-xs text-rose-700">{errors.startDate}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">End date</label>
              <Input type="date" value={deal.endDate} onChange={(event) => updateField("endDate", event.target.value)} />
              {errors.endDate ? <p className="mt-1 text-xs text-rose-700">{errors.endDate}</p> : null}
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Terms</label>
              <textarea rows={5} value={deal.terms} onChange={(event) => updateField("terms", event.target.value)} className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-base text-(--color-slate) outline-none" />
            </div>
          </section>
        ) : null}

        {activeTab === "place" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Related place</label>
              <select value={deal.placeId} onChange={(event) => updateField("placeId", event.target.value)} className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate)">
                <option value="">Select place</option>
                {places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
              </select>
              {errors.placeId ? <p className="mt-1 text-xs text-rose-700">{errors.placeId}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Related collection (optional)</label>
              <select value={deal.collectionId ?? ""} onChange={(event) => updateField("collectionId", event.target.value)} className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate)">
                <option value="">None</option>
                {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.title}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Categories</label>
              <Input value={deal.categories.join(", ")} onChange={(event) => updateField("categories", parseList(event.target.value))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Tags</label>
              <Input value={deal.tags.join(", ")} onChange={(event) => updateField("tags", parseList(event.target.value))} />
            </div>
          </section>
        ) : null}

        {activeTab === "media" ? (
          <section className="rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Featured image</label>
            <Input value={deal.featuredImage} onChange={(event) => updateField("featuredImage", event.target.value)} />
          </section>
        ) : null}

        {activeTab === "seo" ? (
          <section className="grid gap-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">SEO title</label>
              <Input value={deal.seoTitle} onChange={(event) => updateField("seoTitle", event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">SEO description</label>
              <Input value={deal.seoDescription} onChange={(event) => updateField("seoDescription", event.target.value)} />
            </div>
          </section>
        ) : null}

        {activeTab === "preview" ? (
          <BasecampPreviewPanel
            heroTitle={deal.title || "Untitled deal"}
            heroDescription={deal.shortDescription || deal.description || "No description yet."}
            badges={[deal.dealType, deal.status, deal.redemptionMethod]}
            seoSnippet={deal.seoDescription || deal.shortDescription || "No SEO description yet."}
            relatedPlaceholder={deal.placeId ? "Related place and collection links will show here once connected." : "Related place, nearby places, and collections will appear once relationships are added."}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <SaveStatus status={saveState.status} isDirty={isDirty} errorMessage={saveState.errorMessage} />

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={handleSave} disabled={saveState.status === "saving"}>
              {saveState.status === "saving" ? "Saving..." : "Save"}
            </Button>
            <Link href="/basecamp/deals">
              <Button type="button" variant="ghost">Back to deals</Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

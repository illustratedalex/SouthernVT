"use client";

import { useMemo, useState } from "react";
import { MediaAssetCard } from "@/components/basecamp/MediaAssetCard";
import { MediaAssetTable } from "@/components/basecamp/MediaAssetTable";
import { BasecampEmptyState, BasecampPageHeader, BasecampToolbar } from "@/components/basecamp";
import { MediaBulkToolbar } from "@/components/basecamp/MediaBulkToolbar";
import { MediaDetailsDrawer } from "@/components/basecamp/MediaDetailsDrawer";
import { MediaFilters } from "@/components/basecamp/MediaFilters";
import { MediaUploadModal, type MediaUploadFormValues } from "@/components/basecamp/MediaUploadModal";
import { MediaUploadZone } from "@/components/basecamp/MediaUploadZone";
import { useToasts } from "@/components/ui";
import { useSaveState } from "@/hooks/useSaveState";
import { validateMediaUploadForm } from "@/lib/validation/basecampForms";
import type { MediaAsset, MediaAssetType } from "@/types/MediaAsset";

type MediaLibraryClientProps = {
  initialAssets: MediaAsset[];
};

const initialUploadState: MediaUploadFormValues = {
  title: "",
  altText: "",
  mediaType: "image",
  tags: "",
  attachedTo: "",
  credit: "",
  license: "",
  notes: "",
};

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sleep(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

export function MediaLibraryClient({ initialAssets }: MediaLibraryClientProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState<MediaUploadFormValues>(initialUploadState);
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState<MediaAssetType | "all">("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [attachedFilter, setAttachedFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [bulkTagValue, setBulkTagValue] = useState("");
  const [bulkAttachValue, setBulkAttachValue] = useState("");
  const [dropNotice, setDropNotice] = useState<string | null>(null);
  const saveState = useSaveState();
  const { pushToast } = useToasts();

  const availableTags = useMemo(() => [...new Set(assets.flatMap((asset) => asset.tags))].sort(), [assets]);
  const availableAttachedTo = useMemo(() => [...new Set(assets.flatMap((asset) => asset.attachedTo))].sort(), [assets]);

  const visibleAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assets
      .filter((asset) => asset.status !== "archived")
      .filter((asset) => {
        const matchesSearch =
          !query ||
          `${asset.title} ${asset.altText} ${asset.tags.join(" ")} ${asset.attachedTo.join(" ")}`
            .toLowerCase()
            .includes(query);
        const matchesType = mediaType === "all" || asset.type === mediaType;
        const matchesTag = tagFilter === "all" || asset.tags.includes(tagFilter);
        const matchesAttached = attachedFilter === "all" || asset.attachedTo.includes(attachedFilter);
        return matchesSearch && matchesType && matchesTag && matchesAttached;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [assets, search, mediaType, tagFilter, attachedFilter]);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedAssetId) ?? null,
    [assets, selectedAssetId],
  );

  const openUploadPanel = () => {
    setIsUploadOpen(true);
    setUploadForm(initialUploadState);
    setIsDirty(false);
    saveState.reset();
  };

  const closeUploadPanel = () => {
    setIsUploadOpen(false);
    setUploadForm(initialUploadState);
    setUploadErrors({});
    setIsDirty(false);
    setDropNotice(null);
    saveState.reset();
  };

  const updateUploadField = <K extends keyof MediaUploadFormValues>(key: K, value: MediaUploadFormValues[K]) => {
    setUploadForm((current) => ({ ...current, [key]: value }));
    setUploadErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const next = { ...current };
      delete next[key];
      return next;
    });
    setIsDirty(true);
    if (saveState.status !== "saving") {
      saveState.reset();
    }
  };

  const handleMockUpload = async () => {
    const errors = validateMediaUploadForm(uploadForm);
    setUploadErrors(errors);
    if (Object.keys(errors).length) {
      pushToast({ tone: "warning", title: "Missing required fields", description: "Provide a title and alt text before saving." });
      return;
    }

    saveState.startSaving();

    try {
      // TODO(v0.4-write-path): replace optimistic media insert with repository write + retry queue.
      const now = new Date().toISOString();
      const nextAsset: MediaAsset = {
        id: `media-local-${Date.now().toString(36)}`,
        title: uploadForm.title || "Untitled Asset",
        altText: uploadForm.altText || "Uploaded media",
        type: uploadForm.mediaType,
        url: "https://placehold.co/1200x800?text=Uploaded+Media",
        thumbnailUrl: "https://placehold.co/600x400?text=Uploaded+Media",
        tags: parseList(uploadForm.tags),
        attachedTo: parseList(uploadForm.attachedTo),
        credit: uploadForm.credit || undefined,
        license: uploadForm.license || undefined,
        notes: uploadForm.notes || undefined,
        fileSize: 850000,
        width: uploadForm.mediaType === "image" ? 1600 : undefined,
        height: uploadForm.mediaType === "image" ? 1066 : undefined,
        usageCount: 0,
        status: "active",
        createdAt: now,
      };

      setAssets((current) => [nextAsset, ...current]);
      await sleep(700);
      setIsDirty(false);
      saveState.markSaved();
      pushToast({ tone: "success", title: "Media saved", description: `${nextAsset.title} is now available in the library.` });
    } catch {
      saveState.markError("Unable to upload media right now.");
      pushToast({ tone: "error", title: "Upload failed", description: "Please try again." });
    }
  };

  const handleSelectAsset = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const archiveAssetById = (id: string) => {
    setAssets((current) => current.map((asset) => (asset.id === id ? { ...asset, status: "archived" } : asset)));
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    if (selectedAssetId === id) {
      setSelectedAssetId(null);
    }
  };

  const applyBulkAddTag = () => {
    const tag = bulkTagValue.trim();
    if (!tag || !selectedIds.size) {
      return;
    }

    setAssets((current) =>
      current.map((asset) =>
        selectedIds.has(asset.id) && !asset.tags.includes(tag)
          ? { ...asset, tags: [...asset.tags, tag] }
          : asset,
      ),
    );
    setBulkTagValue("");
  };

  const applyBulkAttach = () => {
    const attachValue = bulkAttachValue.trim();
    if (!attachValue || !selectedIds.size) {
      return;
    }

    setAssets((current) =>
      current.map((asset) =>
        selectedIds.has(asset.id) && !asset.attachedTo.includes(attachValue)
          ? { ...asset, attachedTo: [...asset.attachedTo, attachValue] }
          : asset,
      ),
    );
    setBulkAttachValue("");
  };

  const applyBulkArchive = () => {
    if (!selectedIds.size) {
      return;
    }

    setAssets((current) =>
      current.map((asset) => (selectedIds.has(asset.id) ? { ...asset, status: "archived" } : asset)),
    );
    setSelectedIds(new Set());
    if (selectedAssetId && selectedIds.has(selectedAssetId)) {
      setSelectedAssetId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(31,77,58,0.08),transparent_28%),linear-gradient(135deg,#f8f5ee_0%,#fcfaf6_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Media Library"
            description="Upload once, reuse everywhere: places, articles, collections, events, homepage features, and newsletters."
            primaryAction={{ label: "+ Upload Media", onClick: openUploadPanel }}
          />
        </div>

        <div className="space-y-4">
          <MediaUploadZone
            onOpenUpload={openUploadPanel}
            onDropFiles={(fileCount) => {
              if (fileCount > 0) {
                setDropNotice(`${fileCount} file(s) dropped. Complete metadata in the upload modal.`);
              }
            }}
          />

          {dropNotice ? <p className="text-sm text-slate-600">{dropNotice}</p> : null}

          <BasecampToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search media"
            filters={null}
            sortLabel="Sort"
            viewLabel="View"
            bulkLabel="Bulk"
          />

          <MediaFilters
            search={search}
            mediaType={mediaType}
            tag={tagFilter}
            attachedTo={attachedFilter}
            tags={availableTags}
            attachedOptions={availableAttachedTo}
            viewMode={viewMode}
            bulkMode={bulkMode}
            onSearchChange={setSearch}
            onMediaTypeChange={setMediaType}
            onTagChange={setTagFilter}
            onAttachedToChange={setAttachedFilter}
            onViewModeChange={setViewMode}
            onBulkModeToggle={() => {
              setBulkMode((current) => !current);
              setSelectedIds(new Set());
            }}
          />

          <MediaBulkToolbar
            selectedCount={selectedIds.size}
            addTagValue={bulkTagValue}
            attachValue={bulkAttachValue}
            onAddTagValueChange={setBulkTagValue}
            onAttachValueChange={setBulkAttachValue}
            onAddTag={applyBulkAddTag}
            onAttach={applyBulkAttach}
            onArchiveSelected={applyBulkArchive}
            onClearSelection={() => setSelectedIds(new Set())}
          />

          {visibleAssets.length === 0 ? (
            <BasecampEmptyState
              title="No assets found"
              description="Try clearing filters or upload a new asset."
              ctaLabel="Upload media"
              ctaHref="/basecamp/media"
            />
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visibleAssets.map((asset) => (
                <MediaAssetCard
                  key={asset.id}
                  asset={asset}
                  bulkMode={bulkMode}
                  selected={selectedIds.has(asset.id)}
                  onSelect={handleSelectAsset}
                  onOpenDetails={setSelectedAssetId}
                  onArchive={archiveAssetById}
                />
              ))}
            </div>
          ) : (
            <MediaAssetTable
              assets={visibleAssets}
              bulkMode={bulkMode}
              selectedIds={selectedIds}
              onSelect={handleSelectAsset}
              onOpenDetails={setSelectedAssetId}
              onArchive={archiveAssetById}
            />
          )}
        </div>
      </section>

      <MediaUploadModal
        open={isUploadOpen}
        values={uploadForm}
        errors={uploadErrors}
        saveStatus={saveState.status}
        isDirty={isDirty}
        errorMessage={saveState.errorMessage}
        onChange={(key, value) => updateUploadField(key, value)}
        onClose={closeUploadPanel}
        onSave={handleMockUpload}
      />

      <MediaDetailsDrawer asset={selectedAsset} onClose={() => setSelectedAssetId(null)} onArchive={archiveAssetById} />
    </main>
  );
}

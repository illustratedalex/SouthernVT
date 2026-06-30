"use client";

import type { MediaAssetType } from "@/types/MediaAsset";

interface MediaFiltersProps {
  search: string;
  mediaType: MediaAssetType | "all";
  tag: string;
  attachedTo: string;
  tags: string[];
  attachedOptions: string[];
  viewMode: "grid" | "list";
  bulkMode: boolean;
  onSearchChange: (value: string) => void;
  onMediaTypeChange: (value: MediaAssetType | "all") => void;
  onTagChange: (value: string) => void;
  onAttachedToChange: (value: string) => void;
  onViewModeChange: (value: "grid" | "list") => void;
  onBulkModeToggle: () => void;
}

export function MediaFilters({
  search,
  mediaType,
  tag,
  attachedTo,
  tags,
  attachedOptions,
  viewMode,
  bulkMode,
  onSearchChange,
  onMediaTypeChange,
  onTagChange,
  onAttachedToChange,
  onViewModeChange,
  onBulkModeToggle,
}: MediaFiltersProps) {
  return (
    <div className="grid gap-3 rounded-3xl border border-[#e8dfc8] bg-white/80 p-4 md:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr_auto_auto]">
      <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search assets" className="h-11 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm" />

      <select value={mediaType} onChange={(event) => onMediaTypeChange(event.target.value as MediaAssetType | "all")} className="h-11 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm">
        <option value="all">All types</option>
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="document">Document</option>
      </select>

      <select value={tag} onChange={(event) => onTagChange(event.target.value)} className="h-11 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm">
        <option value="all">All tags</option>
        {tags.map((tagOption) => (
          <option key={tagOption} value={tagOption}>{tagOption}</option>
        ))}
      </select>

      <select value={attachedTo} onChange={(event) => onAttachedToChange(event.target.value)} className="h-11 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm">
        <option value="all">All attached</option>
        {attachedOptions.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <button type="button" onClick={() => onViewModeChange(viewMode === "grid" ? "list" : "grid")} className="h-11 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm font-semibold text-slate-700">
        {viewMode === "grid" ? "Grid" : "List"}
      </button>

      <button type="button" onClick={onBulkModeToggle} className={`h-11 rounded-full px-4 text-sm font-semibold ${bulkMode ? "bg-[#1f4d3a] text-white" : "border border-[#d7cbb3] bg-white text-slate-700"}`}>
        Bulk mode
      </button>
    </div>
  );
}

"use client";

import type { MediaAsset } from "@/types/MediaAsset";
import { BasecampActionMenu } from "./BasecampActionMenu";

interface MediaAssetCardProps {
  asset: MediaAsset;
  bulkMode: boolean;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onOpenDetails: (id: string) => void;
  onArchive?: (id: string) => void;
}

export function MediaAssetCard({ asset, bulkMode, selected, onSelect, onOpenDetails, onArchive }: MediaAssetCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_12px_30px_rgba(31,59,47,0.08)]">
      <div className="relative h-44 overflow-hidden bg-stone-200">
        <img src={asset.thumbnailUrl} alt={asset.altText} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1f4d3a]">
          {asset.type}
        </span>
        <div className="absolute right-3 top-3">
          <BasecampActionMenu
            items={[
              { label: "Preview", onClick: () => onOpenDetails(asset.id) },
              { label: "Duplicate", disabled: true },
              { label: "Archive", onClick: () => onArchive?.(asset.id) },
            ]}
          />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">{asset.title}</h3>
            <p className="text-xs text-slate-500">{asset.usageCount ?? 0} uses</p>
          </div>
          {bulkMode ? (
            <input
              type="checkbox"
              checked={selected}
              onChange={(event) => onSelect(asset.id, event.target.checked)}
              className="mt-1 h-4 w-4"
            />
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {asset.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <button type="button" onClick={() => onOpenDetails(asset.id)} className="text-sm font-semibold text-[#1f4d3a]">
          View details
        </button>
      </div>
    </article>
  );
}

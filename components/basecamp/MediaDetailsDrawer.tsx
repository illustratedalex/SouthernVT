"use client";

import type { MediaAsset } from "@/types/MediaAsset";

interface MediaDetailsDrawerProps {
  asset: MediaAsset | null;
  onClose: () => void;
  onArchive: (id: string) => void;
}

export function MediaDetailsDrawer({ asset, onClose, onArchive }: MediaDetailsDrawerProps) {
  if (!asset) {
    return null;
  }

  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-md border-l border-[#e8dfc8] bg-white p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Asset details</h2>
        <button type="button" onClick={onClose} className="rounded-full border border-[#d7cbb3] px-3 py-1 text-xs font-semibold text-slate-700">
          Close
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e8dfc8] bg-[#f6f6f6]">
        <img src={asset.thumbnailUrl} alt={asset.altText} className="h-56 w-full object-cover" />
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <p><span className="font-semibold text-slate-900">Title:</span> {asset.title}</p>
        <p><span className="font-semibold text-slate-900">Alt text:</span> {asset.altText}</p>
        <p><span className="font-semibold text-slate-900">Tags:</span> {asset.tags.join(", ") || "-"}</p>
        <p><span className="font-semibold text-slate-900">Attached content:</span> {asset.attachedTo.join(", ") || "-"}</p>
        <p><span className="font-semibold text-slate-900">Usage count:</span> {asset.usageCount ?? 0}</p>
        <p><span className="font-semibold text-slate-900">Credit:</span> {asset.credit || "-"}</p>
        <p><span className="font-semibold text-slate-900">License:</span> {asset.license || "-"}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className="rounded-full border border-[#d7cbb3] px-4 py-2 text-sm font-semibold text-slate-700">
          Copy URL (placeholder)
        </button>
        <button type="button" onClick={() => onArchive(asset.id)} className="rounded-full bg-[#1f4d3a] px-4 py-2 text-sm font-semibold text-white">
          Archive
        </button>
      </div>
    </aside>
  );
}

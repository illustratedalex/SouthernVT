"use client";

import type { MediaAsset } from "@/types/MediaAsset";
import { BasecampActionMenu } from "./BasecampActionMenu";

interface MediaAssetTableProps {
  assets: MediaAsset[];
  bulkMode: boolean;
  selectedIds: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  onOpenDetails: (id: string) => void;
  onArchive?: (id: string) => void;
}

export function MediaAssetTable({ assets, bulkMode, selectedIds, onSelect, onOpenDetails, onArchive }: MediaAssetTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.18em] text-slate-600">
          <tr>
            {bulkMode ? <th className="px-4 py-3">Select</th> : null}
            <th className="px-4 py-3">Asset</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Tags</th>
            <th className="px-4 py-3">Attached to</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {assets.map((asset) => (
            <tr key={asset.id} className="text-sm text-slate-700 hover:bg-[#fdfaf4]">
              {bulkMode ? (
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(asset.id)}
                    onChange={(event) => onSelect(asset.id, event.target.checked)}
                    className="h-4 w-4"
                  />
                </td>
              ) : null}
              <td className="px-4 py-4">
                <button type="button" onClick={() => onOpenDetails(asset.id)} className="font-semibold text-slate-900 hover:text-[#1f4d3a]">
                  {asset.title}
                </button>
              </td>
              <td className="px-4 py-4 uppercase">{asset.type}</td>
              <td className="px-4 py-4">{asset.tags.join(", ") || "-"}</td>
              <td className="px-4 py-4">{asset.attachedTo.join(", ") || "-"}</td>
              <td className="px-4 py-4">{asset.status}</td>
              <td className="px-4 py-4">
                <BasecampActionMenu
                  items={[
                    { label: "Preview", onClick: () => onOpenDetails(asset.id) },
                    { label: "Duplicate", disabled: true },
                    { label: "Archive", onClick: () => onArchive?.(asset.id) },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

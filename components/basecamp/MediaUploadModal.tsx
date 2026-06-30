"use client";

import { SaveStatus } from "@/components/basecamp/SaveStatus";
import type { SavePhase } from "@/hooks/useSaveState";
import type { MediaAssetType } from "@/types/MediaAsset";

export interface MediaUploadFormValues {
  title: string;
  altText: string;
  mediaType: MediaAssetType;
  tags: string;
  attachedTo: string;
  credit: string;
  license: string;
  notes: string;
}

interface MediaUploadModalProps {
  open: boolean;
  values: MediaUploadFormValues;
  errors: Record<string, string>;
  saveStatus: SavePhase;
  isDirty: boolean;
  errorMessage?: string | null;
  onChange: (key: keyof MediaUploadFormValues, value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function MediaUploadModal({
  open,
  values,
  errors,
  saveStatus,
  isDirty,
  errorMessage,
  onChange,
  onClose,
  onSave,
}: MediaUploadModalProps) {
  if (!open) {
    return null;
  }

  const isSaving = saveStatus === "saving";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-2xl rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-6 shadow-[0_20px_80px_rgba(31,59,47,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Upload asset</h2>
            <p className="mt-1 text-sm text-slate-600">Simulated upload and metadata capture.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-xs font-semibold text-slate-600"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Title
            <input value={values.title} onChange={(event) => onChange("title", event.target.value)} className="rounded-xl border border-[#d7cbb3] bg-white px-3 py-2 text-sm outline-none" />
            {errors.title ? <span className="text-xs text-rose-700">{errors.title}</span> : null}
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Alt Text
            <input value={values.altText} onChange={(event) => onChange("altText", event.target.value)} className="rounded-xl border border-[#d7cbb3] bg-white px-3 py-2 text-sm outline-none" />
            {errors.altText ? <span className="text-xs text-rose-700">{errors.altText}</span> : null}
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Media Type
            <select value={values.mediaType} onChange={(event) => onChange("mediaType", event.target.value)} className="rounded-xl border border-[#d7cbb3] bg-white px-3 py-2 text-sm outline-none">
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Tags
            <input value={values.tags} onChange={(event) => onChange("tags", event.target.value)} placeholder="waterfall, homepage" className="rounded-xl border border-[#d7cbb3] bg-white px-3 py-2 text-sm outline-none" />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Attached To
            <input value={values.attachedTo} onChange={(event) => onChange("attachedTo", event.target.value)} placeholder="Hamilton Falls" className="rounded-xl border border-[#d7cbb3] bg-white px-3 py-2 text-sm outline-none" />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Credit
            <input value={values.credit} onChange={(event) => onChange("credit", event.target.value)} className="rounded-xl border border-[#d7cbb3] bg-white px-3 py-2 text-sm outline-none" />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            License
            <input value={values.license} onChange={(event) => onChange("license", event.target.value)} className="rounded-xl border border-[#d7cbb3] bg-white px-3 py-2 text-sm outline-none" />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
            Notes
            <textarea value={values.notes} onChange={(event) => onChange("notes", event.target.value)} rows={4} className="rounded-xl border border-[#d7cbb3] bg-white px-3 py-2 text-sm outline-none" />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e8dfc8] pt-4">
          <SaveStatus status={saveStatus} isDirty={isDirty} errorMessage={errorMessage} />

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="rounded-full bg-[#1f4d3a] px-5 py-2 text-sm font-semibold text-white disabled:opacity-65"
            >
              {isSaving ? "Saving..." : "Save Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

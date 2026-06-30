"use client";

interface MediaUploadZoneProps {
  onOpenUpload: () => void;
  onDropFiles?: (fileCount: number) => void;
}

export function MediaUploadZone({ onOpenUpload, onDropFiles }: MediaUploadZoneProps) {
  return (
    <button
      type="button"
      onClick={onOpenUpload}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        const fileCount = event.dataTransfer?.files?.length ?? 0;
        onDropFiles?.(fileCount);
        onOpenUpload();
      }}
      className="flex min-h-40 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-[#cdbd99] bg-[#fff9eb] p-6 text-center transition hover:bg-[#fff5df]"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f4d3a]">Drag and drop upload zone</p>
      <p className="mt-2 text-base font-semibold text-slate-900">Drop assets here or click to open upload modal</p>
      <p className="mt-2 text-sm text-slate-600">No real upload yet. Metadata is saved in local state only.</p>
    </button>
  );
}

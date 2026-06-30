"use client";

interface MediaBulkToolbarProps {
  selectedCount: number;
  addTagValue: string;
  attachValue: string;
  onAddTagValueChange: (value: string) => void;
  onAttachValueChange: (value: string) => void;
  onAddTag: () => void;
  onAttach: () => void;
  onArchiveSelected: () => void;
  onClearSelection: () => void;
}

export function MediaBulkToolbar({
  selectedCount,
  addTagValue,
  attachValue,
  onAddTagValueChange,
  onAttachValueChange,
  onAddTag,
  onAttach,
  onArchiveSelected,
  onClearSelection,
}: MediaBulkToolbarProps) {
  if (!selectedCount) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-[#d7cbb3] bg-[#fff7e4] p-4">
      <p className="text-sm font-semibold text-slate-800">{selectedCount} selected</p>

      <div className="flex gap-2">
        <input
          value={addTagValue}
          onChange={(event) => onAddTagValueChange(event.target.value)}
          placeholder="Add tag"
          className="h-10 rounded-full border border-[#d7cbb3] bg-white px-3 text-sm"
        />
        <button type="button" onClick={onAddTag} className="rounded-full border border-[#d7cbb3] bg-white px-3 text-sm font-semibold text-slate-700">
          Add tag
        </button>
      </div>

      <div className="flex gap-2">
        <input
          value={attachValue}
          onChange={(event) => onAttachValueChange(event.target.value)}
          placeholder="Attach to content"
          className="h-10 rounded-full border border-[#d7cbb3] bg-white px-3 text-sm"
        />
        <button type="button" onClick={onAttach} className="rounded-full border border-[#d7cbb3] bg-white px-3 text-sm font-semibold text-slate-700">
          Attach
        </button>
      </div>

      <button type="button" onClick={onArchiveSelected} className="rounded-full bg-[#1f4d3a] px-4 py-2 text-sm font-semibold text-white">
        Archive selected
      </button>

      <button type="button" onClick={onClearSelection} className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-700">
        Clear
      </button>
    </div>
  );
}

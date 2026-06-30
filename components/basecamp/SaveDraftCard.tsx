interface SaveDraftCardProps {
  placeName: string;
  placeType: string;
  coordinatesLabel: string;
  photoCount: number;
  isSaving: boolean;
  error: string | null;
  success: string | null;
  onSaveDraft: () => void;
}

export function SaveDraftCard({
  placeName,
  placeType,
  coordinatesLabel,
  photoCount,
  isSaving,
  error,
  success,
  onSaveDraft,
}: SaveDraftCardProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Step 5</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Save draft</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">Creates a draft Place in the current mock repository for later editing.</p>
      </div>

      <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 text-sm text-slate-700">
        <p><span className="font-semibold text-slate-900">Name:</span> {placeName || "Untitled field draft"}</p>
        <p className="mt-1"><span className="font-semibold text-slate-900">Type:</span> {placeType}</p>
        <p className="mt-1"><span className="font-semibold text-slate-900">Coordinates:</span> {coordinatesLabel}</p>
        <p className="mt-1"><span className="font-semibold text-slate-900">Photos:</span> {photoCount}</p>
      </div>

      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSaving}
        className="min-h-14 w-full rounded-2xl bg-[#1f3b2f] px-6 text-base font-semibold text-[#f8f2e4] transition hover:bg-[#2b493a] disabled:opacity-60"
      >
        {isSaving ? "Saving draft..." : "Create draft Place"}
      </button>

      {error ? <p className="rounded-2xl border border-[#e7c7c7] bg-[#fff5f5] px-4 py-3 text-sm text-[#922]">{error}</p> : null}
      {success ? <p className="rounded-2xl border border-[#cfe7cf] bg-[#f5fff5] px-4 py-3 text-sm text-[#245b24]">{success}</p> : null}
    </section>
  );
}

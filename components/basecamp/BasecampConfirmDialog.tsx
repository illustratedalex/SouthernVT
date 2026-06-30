interface BasecampConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BasecampConfirmDialog({ open, title, description, confirmLabel, cancelLabel = "Cancel", onConfirm, onCancel }: BasecampConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-[0_20px_80px_rgba(31,59,47,0.2)]">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#fcfaf6]">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="rounded-full bg-[#1f3b2f] px-4 py-2 text-sm font-semibold text-[#f8f2e4] transition hover:bg-[#274737]">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
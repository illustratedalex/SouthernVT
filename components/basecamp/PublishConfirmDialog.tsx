"use client";

import { useState } from "react";

export type PublishActionType = "publish" | "review" | "schedule" | "archive";

type PublishConfirmDialogProps = {
  open: boolean;
  action: PublishActionType;
  contentLabel: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

const dialogLabels: Record<
  PublishActionType,
  {
    title: string;
    description: string;
    confirm: string;
    toneClass: string;
  }
> = {
  publish: {
    title: "Publish content",
    description: "This will make the content publicly available in the publishing workflow.",
    confirm: "Confirm Publish",
    toneClass: "bg-emerald-700 hover:bg-emerald-800",
  },
  review: {
    title: "Move to review",
    description: "This sends the draft into editorial review status.",
    confirm: "Move to Review",
    toneClass: "bg-violet-700 hover:bg-violet-800",
  },
  schedule: {
    title: "Schedule content",
    description: "This marks the content as scheduled for upcoming publication.",
    confirm: "Schedule",
    toneClass: "bg-blue-700 hover:bg-blue-800",
  },
  archive: {
    title: "Archive content",
    description: "Archived content is removed from active editorial workflows.",
    confirm: "Confirm Archive",
    toneClass: "bg-slate-700 hover:bg-slate-800",
  },
};

export function PublishConfirmDialog({ open, action, contentLabel, onCancel, onConfirm }: PublishConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const copy = dialogLabels[action];

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-[0_20px_80px_rgba(31,59,47,0.2)]">
        <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">{copy.description}</p>
        <p className="mt-2 text-sm font-semibold text-slate-700">Item: {contentLabel}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${copy.toneClass}`}
          >
            {isSubmitting ? "Working..." : copy.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

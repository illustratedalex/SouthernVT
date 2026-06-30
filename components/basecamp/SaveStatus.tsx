"use client";

import type { SavePhase } from "@/hooks/useSaveState";

type SaveStatusProps = {
  status: SavePhase;
  isDirty?: boolean;
  errorMessage?: string | null;
};

export function SaveStatus({ status, isDirty = false, errorMessage = null }: SaveStatusProps) {
  if (status === "saving") {
    return <p className="text-sm font-medium text-slate-600">Saving...</p>;
  }

  if (status === "saved") {
    return <p className="text-sm font-medium text-emerald-700">Saved</p>;
  }

  if (status === "error") {
    return <p className="text-sm font-medium text-rose-700">{errorMessage ?? "Unable to save right now."}</p>;
  }

  if (isDirty) {
    return <p className="text-sm font-medium text-amber-700">Unsaved changes</p>;
  }

  return <p className="text-sm font-medium text-slate-500">No pending changes</p>;
}

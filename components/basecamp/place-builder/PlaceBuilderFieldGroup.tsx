import type { ReactNode } from "react";

interface PlaceBuilderFieldGroupProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function PlaceBuilderFieldGroup({ label, required, hint, error, children }: PlaceBuilderFieldGroupProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="ml-1 text-rose-600" aria-hidden="true">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">{error}</p> : null}
    </div>
  );
}

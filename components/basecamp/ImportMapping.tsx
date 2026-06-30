"use client";

import { REQUIRED_PLACE_IMPORT_FIELDS, type PlaceImportField } from "@/lib/import/validatePlaceImport";

type ImportMappingValue = Record<PlaceImportField, string>;

type ImportMappingProps = {
  headers: string[];
  mapping: ImportMappingValue;
  onChange: (next: ImportMappingValue) => void;
};

export function ImportMapping({ headers, mapping, onChange }: ImportMappingProps) {
  return (
    <section className="rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Map fields</h2>
      <p className="mt-2 text-sm text-slate-600">Map your file columns to required Place fields.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {REQUIRED_PLACE_IMPORT_FIELDS.map((field) => (
          <label key={field} className="rounded-2xl border border-[#e7dcc3] bg-[#fcfaf6] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{field}</p>
            <select
              value={mapping[field]}
              onChange={(event) => onChange({ ...mapping, [field]: event.target.value })}
              className="mt-2 h-11 w-full rounded-xl border border-[#d7cbb3] bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#1f3b2f]"
            >
              <option value="">Select a column</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
}

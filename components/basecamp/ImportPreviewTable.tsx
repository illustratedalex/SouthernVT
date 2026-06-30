"use client";

import type { PlaceImportValidationRow } from "@/lib/import/validatePlaceImport";

type ImportPreviewTableProps = {
  rows: PlaceImportValidationRow[];
};

const columns: Array<keyof PlaceImportValidationRow["values"]> = ["name", "placeType", "city", "state", "description", "status"];

export function ImportPreviewTable({ rows }: ImportPreviewTableProps) {
  if (rows.length === 0) {
    return (
      <section className="rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Preview</h2>
        <p className="mt-2 text-sm text-slate-600">No parsed rows available yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Preview</h2>
      <p className="mt-2 text-sm text-slate-600">Rows with missing required values are highlighted.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-[#e7dcc3] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Row</th>
              {columns.map((column) => (
                <th key={column} className="border-b border-[#e7dcc3] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {column}
                </th>
              ))}
              <th className="border-b border-[#e7dcc3] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Issues</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`row-${row.rowNumber}`} className="align-top">
                <td className="border-b border-[#f0e8d7] px-3 py-2 text-sm text-slate-700">{row.rowNumber}</td>
                {columns.map((column) => {
                  const value = row.values[column];
                  const isMissing = value.trim().length === 0;
                  return (
                    <td
                      key={`${row.rowNumber}-${column}`}
                      className={`border-b border-[#f0e8d7] px-3 py-2 text-sm ${
                        isMissing ? "bg-[#fff2f0] text-[#8b2e1f]" : "text-slate-700"
                      }`}
                    >
                      {value || "Missing"}
                    </td>
                  );
                })}
                <td className="border-b border-[#f0e8d7] px-3 py-2 text-sm">
                  {row.errors.length === 0 && row.warnings.length === 0 ? (
                    <span className="font-medium text-[#1f3b2f]">Ready</span>
                  ) : (
                    <div className="space-y-1">
                      {row.errors.map((error) => (
                        <p key={`${row.rowNumber}-${error}`} className="text-[#8b2e1f]">
                          {error}
                        </p>
                      ))}
                      {row.warnings.map((warning) => (
                        <p key={`${row.rowNumber}-${warning}`} className="text-[#8b5f1f]">
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

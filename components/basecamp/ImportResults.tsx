"use client";

type ImportResultsProps = {
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  duplicateWarnings: string[];
};

export function ImportResults({ importedCount, skippedCount, errorCount, duplicateWarnings }: ImportResultsProps) {
  return (
    <section className="rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Import results</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#dbe9df] bg-[#f4fbf7] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Imported</p>
          <p className="mt-2 text-3xl font-semibold text-[#1f3b2f]">{importedCount}</p>
        </div>
        <div className="rounded-2xl border border-[#ece2ca] bg-[#fffaf0] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a5124]">Skipped</p>
          <p className="mt-2 text-3xl font-semibold text-[#6a5124]">{skippedCount}</p>
        </div>
        <div className="rounded-2xl border border-[#f0d7d2] bg-[#fff2f0] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b2e1f]">Errors</p>
          <p className="mt-2 text-3xl font-semibold text-[#8b2e1f]">{errorCount}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#e7dcc3] bg-[#fcfaf6] p-4">
        <p className="text-sm font-semibold text-slate-900">Duplicate warnings</p>
        {duplicateWarnings.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No duplicate slug warnings.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-[#8b5f1f]">
            {duplicateWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

import type { SearchMetric } from "@/types/Analytics";

interface SearchMetricsTableProps {
  searches: SearchMetric[];
}

export function SearchMetricsTable({ searches }: SearchMetricsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.18em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Query</th>
            <th className="px-4 py-3">Results</th>
            <th className="px-4 py-3">Clicks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {searches.map((search) => (
            <tr key={search.id} className="text-sm text-slate-700">
              <td className="px-4 py-4 font-semibold text-slate-900">{search.query}</td>
              <td className="px-4 py-4">{search.resultCount}</td>
              <td className="px-4 py-4">{search.clicks.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

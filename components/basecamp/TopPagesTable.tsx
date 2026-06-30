import type { PageViewMetric } from "@/types/Analytics";

interface TopPagesTableProps {
  pages: PageViewMetric[];
}

export function TopPagesTable({ pages }: TopPagesTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.18em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Content</th>
            <th className="px-4 py-3">Path</th>
            <th className="px-4 py-3">Views</th>
            <th className="px-4 py-3">Unique visitors</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {pages.map((page) => (
            <tr key={page.id} className="text-sm text-slate-700">
              <td className="px-4 py-4 font-semibold text-slate-900">{page.title}</td>
              <td className="px-4 py-4">{page.path}</td>
              <td className="px-4 py-4">{page.views.toLocaleString()}</td>
              <td className="px-4 py-4">{page.uniqueVisitors.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

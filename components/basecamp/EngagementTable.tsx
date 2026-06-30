import type { EngagementMetric } from "@/types/Analytics";

interface EngagementTableProps {
  metrics: EngagementMetric[];
}

export function EngagementTable({ metrics }: EngagementTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.18em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Content</th>
            <th className="px-4 py-3">Saves</th>
            <th className="px-4 py-3">Shares</th>
            <th className="px-4 py-3">Reviews</th>
            <th className="px-4 py-3">Passport check-ins</th>
            <th className="px-4 py-3">Deal redemptions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {metrics.map((metric) => (
            <tr key={metric.id} className="text-sm text-slate-700">
              <td className="px-4 py-4 font-semibold text-slate-900">{metric.title}</td>
              <td className="px-4 py-4">{metric.saves}</td>
              <td className="px-4 py-4">{metric.shares}</td>
              <td className="px-4 py-4">{metric.reviews}</td>
              <td className="px-4 py-4">{metric.passportCheckIns}</td>
              <td className="px-4 py-4">{metric.dealRedemptions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

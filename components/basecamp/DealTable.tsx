import Link from "next/link";
import { Button } from "@/components/ui";
import type { Deal } from "@/types/Deal";
import { BasecampActionMenu } from "./BasecampActionMenu";
import { DealStatusBadge } from "@/components/basecamp/DealStatusBadge";

interface DealTableProps {
  deals: Deal[];
  placeNamesById: Map<string, string>;
  onArchive?: (id: string) => void;
}

export function DealTable({ deals, placeNamesById, onArchive }: DealTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.2em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Deal</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date range</th>
            <th className="px-4 py-3">Related place</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {deals.map((deal) => (
            <tr key={deal.id} className="text-sm text-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img src={deal.featuredImage} alt={deal.title} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900">{deal.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{deal.shortDescription}</p>
                    {deal.featured ? <p className="mt-1 text-xs font-semibold text-amber-700">Featured</p> : null}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">{deal.dealType}</td>
              <td className="px-4 py-4"><DealStatusBadge status={deal.status} /></td>
              <td className="px-4 py-4">{deal.startDate} to {deal.endDate}</td>
              <td className="px-4 py-4">{placeNamesById.get(deal.placeId) ?? deal.placeId}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Link href={`/basecamp/deals/${deal.id}`}>
                    <Button variant="secondary" size="sm">Edit</Button>
                  </Link>
                  <BasecampActionMenu items={[{ label: "Preview", href: `/deals/${deal.slug}` }, { label: "Duplicate", disabled: true }, { label: "Archive", onClick: () => onArchive?.(deal.id) }]} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

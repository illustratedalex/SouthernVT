import { Button } from "@/components/ui";
import type { Review } from "@/types/Review";
import { BasecampActionMenu } from "./BasecampActionMenu";
import { ReviewStatusBadge } from "./ReviewStatusBadge";

interface ReviewTableProps {
  reviews: Review[];
  placeNamesById: Map<string, string>;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onArchive?: (id: string) => void;
}

export function ReviewTable({ reviews, placeNamesById, onApprove, onReject, onArchive }: ReviewTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.2em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Reviewer</th>
            <th className="px-4 py-3">Place</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {reviews.map((review) => (
            <tr key={review.id} className="text-sm text-slate-700">
              <td className="px-4 py-4">
                <p className="font-semibold text-slate-900">{review.reviewerName}</p>
                <p className="mt-1 text-xs text-slate-500">{review.title}</p>
              </td>
              <td className="px-4 py-4">{placeNamesById.get(review.placeId) ?? review.placeId}</td>
              <td className="px-4 py-4">{review.rating}/5</td>
              <td className="px-4 py-4"><ReviewStatusBadge status={review.status} /></td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onApprove?.(review.id)} disabled={review.status === "approved"}>Approve</Button>
                  <Button variant="ghost" size="sm" onClick={() => onReject?.(review.id)} disabled={review.status === "rejected"}>Reject</Button>
                  <Button variant="ghost" size="sm" onClick={() => onArchive?.(review.id)} disabled={review.status === "archived"}>Archive</Button>
                  <BasecampActionMenu
                    items={[
                      { label: "Edit", disabled: true },
                      { label: "Preview", href: `/places/${review.placeId}` },
                      { label: "Duplicate", disabled: true },
                      { label: "Archive", onClick: () => onArchive?.(review.id) },
                    ]}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

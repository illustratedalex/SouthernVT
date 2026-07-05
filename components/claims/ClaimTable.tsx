import { Button } from "@/components/ui";
import type { BusinessClaim } from "@/types/Claim";
import { ClaimStatusBadge } from "./ClaimStatusBadge";

interface ClaimTableProps {
  claims: BusinessClaim[];
  onApprove: (id: string, reviewNotes?: string) => void;
  onReject: (id: string, reviewNotes?: string) => void;
  onView: (claim: BusinessClaim) => void;
}

function formatSubmitted(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ClaimTable({ claims, onApprove, onReject, onView }: ClaimTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.2em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Business</th>
            <th className="px-4 py-3">Place</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {claims.map((claim) => (
            <tr key={claim.id} className="text-sm text-slate-700">
              <td className="px-4 py-4">
                <p className="font-semibold text-slate-900">{claim.businessName}</p>
                <p className="mt-1 text-xs text-slate-500">{claim.contactName}</p>
              </td>
              <td className="px-4 py-4">{claim.businessSlug}</td>
              <td className="px-4 py-4">{formatSubmitted(claim.submittedAt)}</td>
              <td className="px-4 py-4"><ClaimStatusBadge status={claim.status} /></td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onApprove(claim.id)} disabled={claim.status === "approved"}>
                    Approve
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onReject(claim.id)} disabled={claim.status === "rejected"}>
                    Reject
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onView(claim)}>
                    View
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

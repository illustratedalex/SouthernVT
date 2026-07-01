import { ClaimStatusBadge } from "@/components/claims/ClaimStatusBadge";
import type { BusinessClaim } from "@/types/Claim";

interface ClaimDetailsDrawerProps {
  claim: BusinessClaim | null;
  onClose: () => void;
}

function relationshipLabel(value: BusinessClaim["relationship"]) {
  switch (value) {
    case "owner":
      return "Owner";
    case "manager":
      return "Manager";
    case "marketing":
      return "Marketing";
    case "other":
      return "Other";
    default:
      return value;
  }
}

export function ClaimDetailsDrawer({ claim, onClose }: ClaimDetailsDrawerProps) {
  if (!claim) {
    return null;
  }

  const workflowSteps = [
    { label: "Pending", active: true },
    { label: "Approved", active: claim.status === "approved" },
    { label: "Business Portal Enabled (Mock)", active: claim.status === "approved" },
  ];

  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-lg overflow-y-auto border-l border-[#e8dfc8] bg-white p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Claim details</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{claim.placeName}</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-[#d7cbb3] px-3 py-1 text-xs font-semibold text-slate-700">
          Close
        </button>
      </div>

      <div className="mt-4">
        <ClaimStatusBadge status={claim.status} />
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-700">
        <p><span className="font-semibold text-slate-900">Business:</span> {claim.businessName}</p>
        <p><span className="font-semibold text-slate-900">Contact:</span> {claim.contactName}</p>
        <p><span className="font-semibold text-slate-900">Email:</span> {claim.email}</p>
        <p><span className="font-semibold text-slate-900">Phone:</span> {claim.phone}</p>
        <p><span className="font-semibold text-slate-900">Relationship:</span> {relationshipLabel(claim.relationship)}</p>
        <p><span className="font-semibold text-slate-900">Submitted:</span> {new Date(claim.submittedAt).toLocaleString()}</p>
        <p><span className="font-semibold text-slate-900">Reviewed:</span> {claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleString() : "Not reviewed yet"}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 text-sm leading-7 text-slate-700">
        <p className="font-semibold text-slate-900">Message</p>
        <p className="mt-2">{claim.message || "No message provided."}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-[#e8dfc8] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Workflow</p>
        <ol className="mt-3 space-y-2 text-sm text-slate-700">
          {workflowSteps.map((step) => (
            <li key={step.label} className={`rounded-xl border px-3 py-2 ${step.active ? "border-[#cde8d6] bg-[#ecf8f0] text-[#1f5a3d]" : "border-[#e8dfc8] bg-[#fcfaf6]"}`}>
              {step.label}
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

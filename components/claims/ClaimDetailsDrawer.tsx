"use client";

import { useState } from "react";
import { ClaimStatusBadge } from "@/components/claims/ClaimStatusBadge";
import type { BusinessClaim } from "@/types/Claim";

interface ClaimDetailsDrawerProps {
  claim: BusinessClaim | null;
  onClose: () => void;
  onApprove: (id: string, reviewNotes?: string) => void;
  onReject: (id: string, reviewNotes?: string) => void;
}

function relationshipLabel(value: BusinessClaim["roleAtBusiness"]) {
  switch (value) {
    case "owner":
      return "Owner";
    case "manager":
      return "Manager";
    case "editor":
      return "Editor";
    case "other":
      return "Other";
    default:
      return value;
  }
}

export function ClaimDetailsDrawer({ claim, onClose, onApprove, onReject }: ClaimDetailsDrawerProps) {
  const [reviewNotes, setReviewNotes] = useState(claim?.reviewNotes ?? "");

  if (!claim) {
    return null;
  }

  const workflowSteps = [
    { label: "Pending", active: true },
    { label: "Approved", active: claim.status === "approved" },
    { label: "Owner access enabled", active: claim.status === "approved" },
  ];

  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-lg overflow-y-auto border-l border-[#e8dfc8] bg-white p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Claim details</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{claim.businessName}</h2>
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
        <p><span className="font-semibold text-slate-900">Claimant:</span> {claim.claimantName}</p>
        <p><span className="font-semibold text-slate-900">Email:</span> {claim.claimantEmail}</p>
        <p><span className="font-semibold text-slate-900">Phone:</span> {claim.claimantPhone}</p>
        <p><span className="font-semibold text-slate-900">Role:</span> {relationshipLabel(claim.roleAtBusiness)}</p>
        <p><span className="font-semibold text-slate-900">Listing slug:</span> {claim.businessSlug}</p>
        <p><span className="font-semibold text-slate-900">Submitted:</span> {new Date(claim.submittedAt).toLocaleString()}</p>
        <p><span className="font-semibold text-slate-900">Reviewed:</span> {claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleString() : "Not reviewed yet"}</p>
        <p><span className="font-semibold text-slate-900">Reviewed by:</span> {claim.reviewedBy ?? "Not reviewed yet"}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 text-sm leading-7 text-slate-700">
        <p className="font-semibold text-slate-900">Proof message</p>
        <p className="mt-2">{claim.proofMessage || "No proof message provided."}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-[#e8dfc8] bg-white p-4 text-sm leading-7 text-slate-700">
        <p className="font-semibold text-slate-900">Review notes</p>
        <textarea
          value={reviewNotes}
          onChange={(event) => setReviewNotes(event.target.value)}
          className="mt-2 min-h-28 w-full rounded-2xl border border-[#d7cbb3] px-4 py-3 text-sm text-slate-700"
          placeholder={claim.reviewNotes ?? "Add optional review notes"}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onApprove(claim.id, reviewNotes)}
            className="rounded-full bg-[#1f3b2f] px-4 py-2 text-xs font-semibold text-[#f8f2e4]"
            disabled={claim.status === "approved"}
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => onReject(claim.id, reviewNotes)}
            className="rounded-full border border-[#d7cbb3] px-4 py-2 text-xs font-semibold text-slate-700"
            disabled={claim.status === "rejected"}
          >
            Reject
          </button>
        </div>
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

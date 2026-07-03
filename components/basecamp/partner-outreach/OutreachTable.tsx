import type { OutreachBusiness, OutreachStatus } from "@/types/PartnerOutreach";
import { RelationshipBadge } from "./RelationshipBadge";

const statusLabel: Record<OutreachStatus, string> = {
  idea: "Idea",
  contacted: "Contacted",
  meeting_scheduled: "Meeting Scheduled",
  demo_given: "Demo Given",
  interested: "Interested",
  follow_up: "Follow-up",
  founding_partner: "Founding Partner",
  not_interested: "Not Interested",
};

const statusTone: Record<OutreachStatus, string> = {
  idea: "bg-slate-100 text-slate-700 border-slate-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  meeting_scheduled: "bg-cyan-100 text-cyan-800 border-cyan-200",
  demo_given: "bg-violet-100 text-violet-800 border-violet-200",
  interested: "bg-emerald-100 text-emerald-800 border-emerald-200",
  follow_up: "bg-amber-100 text-amber-800 border-amber-200",
  founding_partner: "bg-green-100 text-green-800 border-green-200",
  not_interested: "bg-rose-100 text-rose-800 border-rose-200",
};

export function OutreachTable({ businesses }: { businesses: OutreachBusiness[] }) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[#e8dfc8] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#eee3cd] text-left">
          <thead className="bg-[#fcfaf6]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Business</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Contact</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Relationship</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Last Contact</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Next Follow-up</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Potential Fit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2ead8]">
            {businesses.map((business) => (
              <tr key={business.id} className="align-top">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{business.businessName}</p>
                  <p className="mt-1 text-xs text-slate-500">{business.notes}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  <p>{business.contactName}</p>
                  <p className="text-xs text-slate-500">{business.phone}</p>
                  <p className="text-xs text-slate-500 break-all">{business.email}</p>
                </td>
                <td className="px-4 py-3"><RelationshipBadge strength={business.relationshipStrength} /></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusTone[business.status]}`}>
                    {statusLabel[business.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{new Date(business.lastContact).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{new Date(business.nextFollowUp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-4 py-3">
                  <p className="text-lg font-semibold text-slate-900">{business.potentialFitScore}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

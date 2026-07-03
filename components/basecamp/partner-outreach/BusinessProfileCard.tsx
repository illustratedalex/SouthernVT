import type { OutreachBusiness } from "@/types/PartnerOutreach";
import { RelationshipBadge } from "./RelationshipBadge";

export function BusinessProfileCard({ business }: { business: OutreachBusiness }) {
  return (
    <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Business Profile</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{business.businessName}</h3>
          <p className="mt-1 text-sm text-slate-600">{business.contactName}</p>
        </div>
        <RelationshipBadge strength={business.relationshipStrength} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Phone</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{business.phone}</p>
        </div>
        <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 break-all">{business.email}</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Requested Features</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {business.requestedFeatures.map((feature) => (
            <span key={feature} className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {feature}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

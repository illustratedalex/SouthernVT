import { FoundingPartnerStatusBadge } from "./FoundingPartnerStatusBadge";
import type { FoundingPartner } from "@/types/FoundingPartner";

type FoundingPartnerTableProps = {
  partners: FoundingPartner[];
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function FoundingPartnerTable({ partners }: FoundingPartnerTableProps) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[#e8dfc8] bg-white shadow-[0_18px_58px_rgba(31,59,47,0.07)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#eee3cd] text-left">
          <thead className="bg-[#fcfaf6]">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Business</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Contact</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Status</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Monthly support</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Next follow-up</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2ead8]">
            {partners.map((partner) => (
              <tr key={`${partner.businessName}-${partner.contactName}`} className="align-top">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">{partner.businessName}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{partner.contactName}</td>
                <td className="px-5 py-4">
                  <FoundingPartnerStatusBadge status={partner.status} />
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-800">{formatCurrency(partner.monthlySupport)}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{formatDate(partner.nextFollowUpDate)}</td>
                <td className="px-5 py-4 text-sm leading-7 text-slate-600">{partner.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
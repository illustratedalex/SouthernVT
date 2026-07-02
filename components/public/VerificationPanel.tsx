import { VerificationBadge } from "@/components/public/VerificationBadge";
import type { VerificationRecord } from "@/types/Verification";

type VerificationPanelProps = {
  record: VerificationRecord | null;
};

function formatDate(value?: string): string {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function VerificationPanel({ record }: VerificationPanelProps) {
  if (!record) {
    return (
      <section className="rounded-[26px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Verification</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">Details are being reviewed by SouthernVT.</p>
      </section>
    );
  }

  return (
    <section className="rounded-[26px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Verified by SouthernVT</p>
        <VerificationBadge status={record.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {record.levels.map((level) => (
          <VerificationBadge key={level} level={level} status={record.status} />
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Last Verified</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(record.verifiedAt)}</p>
        </div>
        <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Next Review</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(record.nextReviewAt)}</p>
        </div>
      </div>

      {record.notes ? <p className="mt-4 text-sm leading-7 text-slate-600">{record.notes}</p> : null}
    </section>
  );
}


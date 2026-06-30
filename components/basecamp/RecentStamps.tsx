import type { PassportStamp } from "@/types/Passport";

interface RecentStampsProps {
  stamps: PassportStamp[];
}

export function RecentStamps({ stamps }: RecentStampsProps) {
  return (
    <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Recent stamps</h2>
      <ul className="mt-4 space-y-3">
        {stamps.map((stamp) => (
          <li key={stamp.id} className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{stamp.placeName}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{stamp.stampType} · {new Date(stamp.earnedAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

import type { VerificationHistoryItem } from "@/types/Verification";

type VerificationHistoryProps = {
  history: VerificationHistoryItem[];
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function VerificationHistory({ history }: VerificationHistoryProps) {
  if (!history.length) {
    return <p className="text-sm text-slate-600">No verification history yet.</p>;
  }

  return (
    <div className="space-y-2">
      {history
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((entry) => (
          <article key={entry.id} className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1f3b2f]">{entry.action}</p>
            <p className="mt-1 text-sm text-slate-700">{entry.note}</p>
            <p className="mt-1 text-xs text-slate-500">
              {formatDate(entry.date)} · {entry.verifiedBy}
            </p>
          </article>
        ))}
    </div>
  );
}


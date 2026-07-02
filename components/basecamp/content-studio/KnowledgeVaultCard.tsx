import Link from "next/link";
import type { VaultEntry } from "@/lib/content/knowledgeVault";

type KnowledgeVaultCardProps = {
  entries: VaultEntry[];
};

export function KnowledgeVaultCard({ entries }: KnowledgeVaultCardProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Private Editorial</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Knowledge Vault</h2>
        </div>
        <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">
          {entries.length} {entries.length === 1 ? "file" : "files"}
        </span>
      </div>

      <p className="mt-2 text-sm leading-7 text-slate-600">
        Private research and field notes for flagship destinations. Never exposed on the public site.
      </p>

      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No vault entries yet. Add a <code className="rounded bg-[#f0e8d6] px-1.5 py-0.5 text-xs font-mono text-[#1f3b2f]">*.notes.md</code> file to{" "}
          <code className="rounded bg-[#f0e8d6] px-1.5 py-0.5 text-xs font-mono text-[#1f3b2f]">content/private/</code> to get started.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {entries.map((entry) => (
            <article
              key={entry.slug}
              className="flex items-start justify-between gap-4 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{entry.placeName}</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eef4f0] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1f3b2f]">
                    {entry.sectionCount} {entry.sectionCount === 1 ? "section" : "sections"}
                  </span>
                  {entry.pendingChecks > 0 && (
                    <span className="rounded-full bg-[#fff3d4] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7c5b13]">
                      {entry.pendingChecks} pending
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/basecamp/places/${entry.slug}`}
                className="shrink-0 rounded-full border border-[#d7cbb3] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#c7b38e] hover:bg-[#fcfaf6]"
              >
                Open Notes
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

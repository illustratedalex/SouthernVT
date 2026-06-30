import { Button } from "@/components/ui";
import type { ContentVersion } from "@/types/Workflow";

interface VersionHistoryProps {
  versions: ContentVersion[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function VersionHistory({ versions }: VersionHistoryProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Version history</h3>
      {versions.length ? (
        <div className="mt-4 space-y-3">
          {versions.map((version) => (
            <article key={version.id} className="rounded-2xl border border-[#efe7d3] bg-[#fcfaf6] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">Version {version.versionNumber}</p>
                {version.published ? (
                  <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-800">
                    Published
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-slate-700">{version.title}</p>
              <p className="mt-1 text-xs text-slate-500">{version.createdBy} · {formatDate(version.createdAt)}</p>
              <p className="mt-2 text-xs text-slate-600">{version.snapshot}</p>
              <div className="mt-3">
                <Button type="button" variant="ghost" size="sm">
                  Restore
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">No saved versions for this item yet.</p>
      )}
    </section>
  );
}

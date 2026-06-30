import { Button } from "@/components/ui";
import type { EditorialComment } from "@/types/Workflow";

interface EditorialCommentsProps {
  comments: EditorialComment[];
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

export function EditorialComments({ comments }: EditorialCommentsProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Editorial comments</h3>
      {comments.length ? (
        <div className="mt-4 space-y-3">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-2xl border border-[#efe7d3] bg-[#fcfaf6] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{comment.author}</p>
                {comment.resolved ? (
                  <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-800">
                    Resolved
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-700">{comment.body}</p>
              <p className="mt-2 text-xs text-slate-500">{formatDate(comment.createdAt)}</p>
              {!comment.resolved ? (
                <div className="mt-3">
                  <Button type="button" variant="ghost" size="sm">
                    Resolve
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">No comments yet. Editorial feedback will appear here.</p>
      )}
    </section>
  );
}

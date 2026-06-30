import { EmptyState } from "@/components/ui";

type ContentItem = {
  title: string;
  description: string;
  status: string;
};

type LatestContentPanelProps = {
  items: ContentItem[];
};

export function LatestContentPanel({ items }: LatestContentPanelProps) {
  return (
    <div className="rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-(--color-forest-green)">Latest content</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Recently prepared for publish</h2>
        </div>
        <a href="/basecamp" className="text-sm font-semibold text-(--color-forest-green)">
          View all
        </a>
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No content yet" description="Recently prepared posts, pages, and entries will appear here." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="rounded-3xl border border-[#f1e8d1] bg-[#fcfaf6] p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <span className="rounded-full border border-[#d9bf73] bg-[#fff7df] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6620]">
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { EmptyState } from "@/components/ui";

type ActivityItem = {
  title: string;
  time: string;
  category: string;
};

type ActivityPanelProps = {
  items: ActivityItem[];
};

export function ActivityPanel({ items }: ActivityPanelProps) {
  return (
    <div className="rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-(--color-forest-green)">Recent activity</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Fresh updates across the site</h2>
        </div>
        <a href="/basecamp/activity" className="text-sm font-semibold text-(--color-forest-green)">
          See all
        </a>
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No recent activity" description="Workflow updates across the site will appear here." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.title} className="flex items-center justify-between gap-3 rounded-[20px] border border-[#f1e8d1] bg-[#fcfaf6] px-4 py-4">
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.time}</p>
              </div>
              <span className="rounded-full border border-[#e2cc86] bg-[#fff7df] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6620]">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

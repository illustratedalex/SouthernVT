import Link from "next/link";

type ActionItem = {
  label: string;
  href: string;
};

type QuickActionsPanelProps = {
  actions: ActionItem[];
};

export function QuickActionsPanel({ actions }: QuickActionsPanelProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Quick Actions</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-4 text-center text-sm font-semibold text-slate-800 transition hover:border-[#c7b38e] hover:bg-white"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

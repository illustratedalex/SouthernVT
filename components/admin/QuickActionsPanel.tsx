type ActionItem = {
  label: string;
  href: string;
};

type QuickActionsPanelProps = {
  items: ActionItem[];
};

export function QuickActionsPanel({ items }: QuickActionsPanelProps) {
  return (
    <div className="rounded-[32px] border border-[#e8dfc8] bg-[#1f3b2f] p-6 text-[#f8f2e4] shadow-[0_20px_80px_rgba(31,59,47,0.16)]">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-maple-gold)]">Quick actions</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Start a new update</h2>
      <div className="mt-6 space-y-3">
        {items.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/15"
          >
            <span>{action.label}</span>
            <span aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}

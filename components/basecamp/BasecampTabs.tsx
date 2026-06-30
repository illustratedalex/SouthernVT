interface TabItem {
  key: string;
  label: string;
}

interface BasecampTabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function BasecampTabs({ tabs, activeKey, onChange }: BasecampTabsProps) {
  return (
    <div className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-4 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Basecamp content tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeKey === tab.key}
            onClick={() => onChange(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-(--color-maple-gold)/30 ${
              activeKey === tab.key ? "bg-[#1f3b2f] text-[#f8f2e4]" : "bg-[#fcfaf6] text-slate-600 hover:bg-[#f4ebd5]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import type { BasecampFeatureKey } from "@/lib/basecampFeatureFlags";

type SidebarItem = {
  label: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
  note?: string;
};

type SidebarProps = {
  items: SidebarItem[];
};

const alwaysVisibleItems: SidebarItem[] = [
  { label: "Founding Partners", href: "/basecamp/founding-partners" },
  { label: "Partner Outreach", href: "/basecamp/partner-outreach" },
];

const conditionalModuleMap: Array<{ label: string; href: string; flag: BasecampFeatureKey }> = [
  { label: "AI Planner", href: "/trips/new", flag: "aiPlanner" },
  { label: "Passport", href: "/passport", flag: "passport" },
  { label: "Weather", href: "/basecamp/weather", flag: "weather" },
  { label: "Analytics", href: "/basecamp/analytics", flag: "analytics" },
  { label: "Partner Portal", href: "/basecamp/partner-portal", flag: "partnerPortal" },
  { label: "Business Claims", href: "/basecamp/claims", flag: "businessClaims" },
  { label: "Mapbox Features", href: "/map", flag: "mapbox" },
];

export function Sidebar({ items }: SidebarProps) {
  const { featureFlags } = useFeatureFlags();

  const conditionalItems: SidebarItem[] = conditionalModuleMap.map((moduleItem) => {
    const enabled = featureFlags[moduleItem.flag];
    return {
      label: moduleItem.label,
      href: moduleItem.href,
      disabled: !enabled,
      note: enabled ? "ON" : "DISABLED",
    };
  });

  const allItems = [...items];
  for (const conditionalItem of conditionalItems) {
    const exists = allItems.some((item) => item.href === conditionalItem.href || item.label === conditionalItem.label);
    if (!exists) {
      allItems.push(conditionalItem);
    }
  }

  for (const fixedItem of alwaysVisibleItems) {
    const exists = allItems.some((item) => item.href === fixedItem.href || item.label === fixedItem.label);
    if (!exists) {
      allItems.push(fixedItem);
    }
  }

  return (
    <aside className="w-full rounded-[30px] border border-white/10 bg-[#12261d] p-5 text-[#f7efe0] shadow-[0_24px_90px_rgba(10,18,15,0.28)] lg:sticky lg:top-6 lg:w-72 lg:shrink-0 lg:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-maple-gold) text-sm font-semibold uppercase tracking-[0.24em] text-[#12261d]">
          SV
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">SouthernVT</p>
          <p className="text-sm text-slate-300">Basecamp</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1.5">
        {allItems.map((item) => (
          item.disabled ? (
            <div
              key={item.label}
              className="flex cursor-not-allowed items-center justify-between rounded-2xl border border-white/8 px-4 py-3 text-sm font-medium text-slate-500"
            >
              <span>{item.label}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{item.note ?? "DISABLED"}</span>
            </div>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                item.active
                  ? "bg-white/12 text-white shadow-lg"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">{item.note ?? "ON"}</span>
            </Link>
          )
        ))}
      </nav>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/8 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--color-maple-gold)">Publishing status</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          Keep the destination calendar aligned with seasonal plans and new editorial stories.
        </p>
      </div>
    </aside>
  );
}

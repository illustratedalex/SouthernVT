import Link from "next/link";
import type { ReactNode } from "react";

interface PartnerShellProps {
  title: string;
  description: string;
  previewMode: boolean;
  active: "dashboard" | "place" | "deals" | "events" | "insights";
  children: ReactNode;
}

const tabs: Array<{ key: PartnerShellProps["active"]; label: string; href: string }> = [
  { key: "dashboard", label: "Dashboard", href: "/partner-portal/dashboard" },
  { key: "place", label: "Place", href: "/partner-portal/place" },
  { key: "deals", label: "Deals", href: "/partner-portal/deals" },
  { key: "events", label: "Events", href: "/partner-portal/events" },
  { key: "insights", label: "Insights", href: "/partner-portal/insights" },
];

export function PartnerShell({ title, description, previewMode, active, children }: PartnerShellProps) {
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
      {previewMode ? (
        <div className="rounded-2xl border border-[#d7cbb3] bg-[#fff7e4] p-4 text-sm font-medium text-[#6b5a30]">
          Partner Portal is in preview mode.
        </div>
      ) : null}

      <header className="rounded-4xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Partner portal</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      </header>

      <nav className="flex flex-wrap gap-2 rounded-3xl border border-[#e8dfc8] bg-white p-3 shadow-sm">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab.key === active ? "bg-[#1f3b2f] text-[#f8f2e4]" : "bg-[#fcfaf6] text-slate-600 hover:bg-[#f4ebd5]"}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </section>
  );
}

import Link from "next/link";

interface SettingsSidebarProps {
  active: "general" | "features" | "integrations" | "api";
}

export function SettingsSidebar({ active }: SettingsSidebarProps) {
  const items = [
    { label: "General", href: "/basecamp/settings", key: "general" as const },
    { label: "Feature Flags", href: "/basecamp/settings/features", key: "features" as const },
    { label: "Integrations", href: "/basecamp/settings/integrations", key: "integrations" as const },
    { label: "API Status", href: "/basecamp/settings/api", key: "api" as const },
  ];

  return (
    <nav className="w-full space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 px-3 py-2">Settings</p>
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`block px-3 py-2 rounded-lg text-sm font-semibold transition ${
            active === item.key
              ? "bg-[#1f3b2f] text-white"
              : "text-slate-700 hover:bg-[#fcfaf6]"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

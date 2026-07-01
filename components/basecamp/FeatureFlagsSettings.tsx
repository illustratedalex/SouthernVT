"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SaveStatus } from "@/components/basecamp/SaveStatus";
import { useSaveState } from "@/hooks/useSaveState";
import { updateFeatureFlag } from "@/lib/featureFlags";
import { executeWriteWithQueueFallback } from "@/lib/services";
import type { FeatureFlag } from "@/types/FeatureFlag";

type FeatureFlagsSettingsProps = {
  initialFlags: FeatureFlag[];
};

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Import", href: "/basecamp/import" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Articles", href: "/basecamp/articles" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Feature Flags", href: "/basecamp/settings/features", active: true },
];

function FeatureFlagRow({
  flag,
  onToggle,
}: {
  flag: FeatureFlag;
  onToggle: (nextEnabled: boolean) => Promise<void>;
}) {
  const [isDirty, setIsDirty] = useState(false);
  const saveState = useSaveState();

  const handleToggle = async () => {
    const nextEnabled = !flag.enabled;
    setIsDirty(true);
    saveState.startSaving();

    try {
      await onToggle(nextEnabled);
      setIsDirty(false);
      saveState.markSaved();
    } catch {
      saveState.markError("Unable to update this flag.");
    }
  };

  return (
    <article className="rounded-[22px] border border-[#e8dfc8] bg-[#fcfaf6] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{flag.label}</h2>
          <p className="mt-1 text-sm text-slate-600">{flag.description}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
            Environment: {flag.environment}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                flag.enabled ? "bg-[#e8f2ec] text-[#1f5a3d]" : "bg-[#f4ebeb] text-[#8a3636]"
              }`}
            >
              {flag.enabled ? "Enabled" : "Disabled"}
            </span>
            <button
              type="button"
              onClick={handleToggle}
              disabled={saveState.status === "saving"}
              className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-[#f8f2e4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveState.status === "saving" ? "Saving..." : "Toggle"}
            </button>
          </div>
          <SaveStatus status={saveState.status} isDirty={isDirty} errorMessage={saveState.errorMessage} />
        </div>
      </div>
    </article>
  );
}

export function FeatureFlagsSettings({ initialFlags }: FeatureFlagsSettingsProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags);
  const sortedFlags = useMemo(() => [...flags].sort((a, b) => a.label.localeCompare(b.label)), [flags]);

  const handleToggle = async (flagKey: FeatureFlag["key"], nextEnabled: boolean) => {
    const updated = await executeWriteWithQueueFallback(
      "featureFlag.update",
      { key: flagKey, enabled: nextEnabled },
      () => updateFeatureFlag(flagKey, nextEnabled),
    );

    if (!updated) {
      throw new Error("Unable to update this flag.");
    }

    setFlags((current) => current.map((item) => (item.key === flagKey ? updated : item)));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <aside className="w-full rounded-[30px] border border-white/10 bg-[#12261d] p-5 text-[#f7efe0] shadow-[0_24px_90px_rgba(10,18,15,0.28)] lg:sticky lg:top-6 lg:w-72 lg:shrink-0 lg:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d8b15d]">Basecamp</p>
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  item.active ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <section className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f3b2f]">Feature Flags</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Feature Flags</h1>
            <p className="mt-2 max-w-3xl text-base leading-8 text-slate-600">
              Control which Trailhead CMS features are visible while the platform grows.
            </p>

            <div className="mt-8 space-y-3">
              {sortedFlags.map((flag) => (
                <FeatureFlagRow
                  key={flag.key}
                  flag={flag}
                  onToggle={(nextEnabled) => handleToggle(flag.key, nextEnabled)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { FeatureFlag } from "@/types/FeatureFlag";

interface FeatureDisabledCardProps {
  feature: FeatureFlag;
  explanation?: string;
}

export function FeatureDisabledCard({ feature, explanation }: FeatureDisabledCardProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a3636]">Feature unavailable</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{feature.label}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {explanation ?? feature.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#f4ebeb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a3636]">
          Disabled
        </span>
        <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
          {feature.environment}
        </span>
      </div>

      <Link
        href="/basecamp/settings/features"
        className="mt-5 inline-flex rounded-full bg-[#1f3b2f] px-4 py-2 text-xs font-semibold text-[#f8f2e4] transition hover:bg-[#3e5b4a]"
      >
        Open Feature Flags
      </Link>
    </section>
  );
}

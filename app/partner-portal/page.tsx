import Link from "next/link";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Partner Portal",
  description: "Business owner tools for managing listings, deals, and events in Southern Vermont.",
  path: "/partner-portal",
});

const benefits = [
  "Manage your place listing updates",
  "Create and track promotional deals",
  "Submit and maintain upcoming events",
  "See activity and engagement snapshots",
];

export default async function PartnerPortalLandingPage() {
  const previewEnabled = await isFeatureEnabled("businessPortal");

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-6 py-14 sm:px-8 lg:px-10">
      {!previewEnabled ? (
        <div className="rounded-2xl border border-[#d7cbb3] bg-[#fff7e4] p-4 text-sm font-medium text-[#6b5a30]">
          Partner Portal is in preview mode.
        </div>
      ) : null}

      <header className="rounded-4xl border border-[#e8dfc8] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Business owner portal</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Grow your Southern Vermont presence</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          The Partner Portal gives local businesses a simple workspace for keeping listings accurate, launching offers, and sharing upcoming events.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/partner-portal/dashboard" className="rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">
            Enter portal preview
          </Link>
          <button type="button" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-5 py-3 text-sm font-semibold text-slate-700">
            Sign in (coming soon)
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {benefits.map((benefit) => (
          <article key={benefit} className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{benefit}</h2>
          </article>
        ))}
      </section>
    </section>
  );
}

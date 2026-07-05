import { Sidebar } from "@/components/admin";
import { BasecampPageHeader, BasecampSection } from "@/components/basecamp";
import { foundingPartners } from "@/data/foundingPartners";
import { billingPlans, getSquareBillingStatus } from "@/lib/billing/plans";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Newsroom", href: "/basecamp/content" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Businesses", href: "/basecamp/businesses" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Photo Desk", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Founding Partners", href: "/basecamp/founding-partners" },
  { label: "Subscriptions", href: "/basecamp/subscriptions", active: true },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function BasecampSubscriptionsPage() {
  const activeFoundingPartners = foundingPartners.filter((partner) => partner.status === "active");
  const mrrEstimate = activeFoundingPartners.reduce((sum, partner) => sum + partner.monthlySupport, 0);
  const squareStatus = getSquareBillingStatus();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Subscriptions"
            description="Track listing upgrade readiness, Founding Partner support, and manual subscription records. Billing provider: Square."
            statusPill={squareStatus.configured ? "Square configured" : "Manual records"}
            primaryAction={{ label: "Open upgrade page", href: "/businesses/grafton-inn/upgrade" }}
          />

          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">MRR estimate</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(mrrEstimate)}</p>
              <p className="mt-2 text-sm text-slate-600">Calculated from active Founding Partner records only.</p>
            </article>
            <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Founding Partner count</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{activeFoundingPartners.length}</p>
              <p className="mt-2 text-sm text-slate-600">Live support records in the manual CRM.</p>
            </article>
            <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Billing provider</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{squareStatus.configured ? "Square" : "Manual"}</p>
              <p className="mt-2 text-sm text-slate-600">
                {squareStatus.configured
                  ? `Square is configured (${squareStatus.environment}). Payment link creation is live.`
                  : "Square env vars are missing. Billing remains manual — contact partners@southernvt.com."}
              </p>
            </article>
          </section>

          <BasecampSection
            title="Billing plan readiness"
            eyebrow="Square / manual records"
            description="Square-backed billing is ready when SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, and catalog plan variation IDs are configured."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {billingPlans.map((plan) => (
                <article key={plan.id} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{plan.name}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                        <span className="text-sm font-medium text-slate-500">
                          {plan.interval === "monthly" ? "/month" : plan.interval === "yearly" ? "/year" : ""}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        plan.active ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      {plan.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{plan.description}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{plan.trustNote}</p>
                </article>
              ))}
            </div>
          </BasecampSection>
        </main>
      </div>
    </div>
  );
}

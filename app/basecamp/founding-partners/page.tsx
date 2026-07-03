import { Sidebar } from "@/components/admin";
import { BasecampPageHeader, BasecampSection } from "@/components/basecamp";
import { FoundingPartnerSlots, FoundingPartnerTable } from "@/components/founding-partners";
import { foundingPartnerInternalSlots, foundingPartners } from "@/data/foundingPartners";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content" },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Place Builder", href: "/basecamp/place-builder" },
  { label: "Import", href: "/basecamp/import" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Founding Partners", href: "/basecamp/founding-partners", active: true },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Hidden Gems", href: "/basecamp/hidden-gems" },
  { label: "Waterfalls", href: "/basecamp/waterfalls" },
  { label: "Restaurants", href: "/basecamp/restaurants" },
  { label: "Lodging", href: "/basecamp/lodging" },
  { label: "Articles", href: "/basecamp/articles" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
  { label: "Reviews", href: "/basecamp/reviews" },
  { label: "Analytics", href: "/basecamp/analytics" },
  { label: "Passport", href: "/basecamp/passport" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
  { label: "Users", href: "/basecamp/users" },
  { label: "Settings", href: "/basecamp/settings" },
];

const supportCounts = foundingPartners.reduce(
  (counts, partner) => ({
    active: partner.status === "active" ? counts.active + 1 : counts.active,
    interested: partner.status === "interested" ? counts.interested + 1 : counts.interested,
    invited: partner.status === "invited" ? counts.invited + 1 : counts.invited,
    declined: partner.status === "declined" ? counts.declined + 1 : counts.declined,
  }),
  { active: 0, interested: 0, invited: 0, declined: 0 },
);

export default function BasecampFoundingPartnersPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Founding Partners"
            description="Track early local businesses invited into the SouthernVT founding support program."
            meta={`Slots used: ${foundingPartnerInternalSlots.filled} / ${foundingPartnerInternalSlots.total}`}
            statusPill="Mock CRM"
            primaryAction={{ label: "Open public page", href: "/founding-partners" }}
            secondaryAction={{ label: "Contact Alex", href: "/contact", variant: "ghost" }}
          />

          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Active", value: String(supportCounts.active) },
              { label: "Interested", value: String(supportCounts.interested) },
              { label: "Invited", value: String(supportCounts.invited) },
              { label: "Declined", value: String(supportCounts.declined) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[30px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </section>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="h-fit rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm lg:sticky lg:top-6">
              <FoundingPartnerSlots
                filled={foundingPartnerInternalSlots.filled}
                total={foundingPartnerInternalSlots.total}
                label="slots used"
                caption="Mock internal pipeline for early local business outreach."
              />
            </div>

            <BasecampSection
              title="Partner list"
              eyebrow="Founding Partners"
              description="Track invitations, interest, active support, and follow-up timing in one place."
              className="p-6"
            >
              <FoundingPartnerTable partners={foundingPartners} />
            </BasecampSection>
          </div>
        </main>
      </div>
    </div>
  );
}
import { Sidebar } from "@/components/admin";
import { BasecampPageHeader, BasecampStatCard } from "@/components/basecamp";
import {
  BusinessProfileCard,
  ConversationTimeline,
  FollowUpPanel,
  OutreachTable,
} from "@/components/basecamp/partner-outreach";
import { outreachBusinesses, outreachConversationTimeline } from "@/data/partnerOutreach";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content" },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Partner Outreach", href: "/basecamp/partner-outreach", active: true },
  { label: "Founding Partners", href: "/basecamp/founding-partners" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
  { label: "Settings", href: "/basecamp/settings" },
];

const today = new Date("2026-07-03T00:00:00.000Z");
const weekAhead = new Date("2026-07-10T23:59:59.000Z");

const todaysFollowUps = outreachBusinesses.filter((business) => new Date(business.nextFollowUp).toDateString() === today.toDateString()).length;
const meetingsThisWeek = outreachBusinesses.filter((business) => {
  const statusMeeting = business.status === "meeting_scheduled" || business.status === "demo_given";
  const followUpDate = new Date(business.nextFollowUp).getTime();
  return statusMeeting && followUpDate >= today.getTime() && followUpDate <= weekAhead.getTime();
}).length;
const interestedBusinesses = outreachBusinesses.filter((business) => business.status === "interested" || business.status === "follow_up").length;
const foundingPartners = outreachBusinesses.filter((business) => business.status === "founding_partner").length;

export default function PartnerOutreachPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <BasecampPageHeader
            eyebrow="Partner Outreach"
            title="Founding Partner CRM"
            description="Track conversations with potential Founding Partners through a simple, editorial-aligned outreach workflow."
            statusPill="Mock CRM"
            meta="No integrations · No payments"
            primaryAction={{ label: "Open Founding Partners", href: "/basecamp/founding-partners" }}
            secondaryAction={{ label: "Back to Dashboard", href: "/basecamp", variant: "ghost" }}
          />

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <BasecampStatCard label="Today&apos;s Follow-ups" value={String(todaysFollowUps)} detail="Businesses due for contact today." />
            <BasecampStatCard label="Meetings This Week" value={String(meetingsThisWeek)} detail="Scheduled meetings and demos in the next 7 days." />
            <BasecampStatCard label="Interested Businesses" value={String(interestedBusinesses)} detail="Warm prospects requiring ongoing follow-up." />
            <BasecampStatCard label="Founding Partners" value={String(foundingPartners)} detail="Converted businesses in the current outreach cycle." />
          </section>

          <OutreachTable businesses={outreachBusinesses} />

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr_0.95fr]">
            <ConversationTimeline events={outreachConversationTimeline} businesses={outreachBusinesses} />
            <FollowUpPanel businesses={outreachBusinesses} />
            <BusinessProfileCard business={outreachBusinesses[0]} />
          </section>
        </main>
      </div>
    </div>
  );
}

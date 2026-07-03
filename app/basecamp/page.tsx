import Link from "next/link";
import { Sidebar } from "@/components/admin";
import { BasecampPageHeader, BasecampStatCard } from "@/components/basecamp";
import { MorningBriefingNote } from "@/components/basecamp/MorningBriefingNote";
import { foundingPartners } from "@/data/foundingPartners";
import {
  copyDeskStories,
  morningPriorities,
  morningQuoteOfTheDay,
  photoDeskNeeds,
  publishTodayItems,
  verificationDeskRecords,
  weatherPlaceholder,
} from "@/data/morningBriefing";
import { weeklyIssue } from "@/data/weeklyIssue";

const navItems = [
  { label: "Dashboard", href: "/basecamp", active: true },
  { label: "Newsroom", href: "/basecamp/content" },
  { label: "Editorial Studio", href: "/basecamp/content" },
  { label: "Editorial Issue", href: "/basecamp/editorial-issue" },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Content Report", href: "/basecamp/content/report" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Photo Desk", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Founding Partners", href: "/basecamp/founding-partners" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function progressStats() {
  return [
    { label: "Stories", current: 4, total: 6 },
    { label: "Photos", current: 9, total: 15 },
    { label: "Collections", current: 2, total: 3 },
    { label: "Verification", current: 6, total: 9 },
  ];
}

const statusTone: Record<string, string> = {
  Complete: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "In Review": "bg-blue-100 text-blue-800 border-blue-200",
  "Needs Review": "bg-amber-100 text-amber-800 border-amber-200",
};

const verificationTone: Record<string, string> = {
  needs_review: "bg-amber-100 text-amber-800 border-amber-200",
  expiring: "bg-rose-100 text-rose-800 border-rose-200",
  newly_verified: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const verificationLabel: Record<string, string> = {
  needs_review: "Needs review",
  expiring: "Expiring",
  newly_verified: "Newly verified",
};

const partnerFollowUps = foundingPartners
  .filter((partner) => partner.status === "invited" || partner.status === "interested")
  .slice(0, 3);

const upcomingMeetings = [
  { business: "Grafton Inn", date: "2026-07-08", topic: "Summer package review" },
  { business: "Vermont Country Store", date: "2026-07-09", topic: "Founding partner Q&A" },
  { business: "Bellows Falls business placeholder", date: "2026-07-11", topic: "Editorial visibility walkthrough" },
];

export default function BasecampMorningBriefingPage() {
  const now = new Date();
  const readyToPublishCount = copyDeskStories.filter((story) => story.readyToPublish).length;
  const claimsOpen = 7;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.14),transparent_34%),linear-gradient(140deg,#f7efe1_0%,#fcfaf6_46%,#fffdf9_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <BasecampPageHeader
            eyebrow="Morning Briefing"
            title="Good Morning, Alex"
            description="A calm, editorial-first briefing for today&apos;s newsroom workflow."
            meta={`${formatDate(now)} · Current issue: ${weeklyIssue.title}`}
            statusPill="Newsroom homepage"
            primaryAction={{ label: "Open Editorial Issue", href: "/basecamp/editorial-issue" }}
            secondaryAction={{ label: "Open Content Studio", href: "/basecamp/content", variant: "ghost" }}
          />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-[28px] border border-[#e8dfc8] bg-white/90 p-5 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Weather</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{weatherPlaceholder}</p>
            </article>
            <article className="rounded-[28px] border border-[#e8dfc8] bg-white/90 p-5 shadow-sm backdrop-blur md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Editorial quote of the day</p>
              <p className="mt-2 text-lg leading-8 text-slate-700">&ldquo;{morningQuoteOfTheDay}&rdquo;</p>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Today&apos;s Priorities</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Top 5 assignments</h2>
              <div className="mt-5 space-y-3">
                {morningPriorities.map((item) => (
                  <Link key={item.place} href={item.href} className="flex items-center justify-between gap-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3 transition hover:bg-white hover:border-[#d7cbb3]">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{item.place}</p>
                      <p className="text-sm text-slate-600">{item.task}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${item.priority === "urgent" ? "border-rose-200 bg-rose-100 text-rose-800" : "border-amber-200 bg-amber-100 text-amber-800"}`}>
                      {item.priority}
                    </span>
                  </Link>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Editorial Issue</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{weeklyIssue.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{weeklyIssue.theme}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cover Story</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{weeklyIssue.coverStory.title}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Deadline</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatShortDate(weeklyIssue.publicationDate)}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Completion</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{weeklyIssue.completionPercent}%</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b15d,#1f5a3d)]" style={{ width: `${weeklyIssue.completionPercent}%` }} />
                </div>
              </div>

              <Link href="/basecamp/editorial-issue" className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#1f3b2f] px-5 text-sm font-semibold text-white transition hover:bg-[#2a4a3f]">
                Open Issue
              </Link>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Copy Desk</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Stories awaiting review</h2>
              <div className="mt-5 space-y-3">
                {copyDeskStories.map((story) => (
                  <Link key={story.title} href={story.href} className="block rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4 transition hover:bg-white hover:border-[#d7cbb3]">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-semibold text-slate-900">{story.title}</p>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusTone[story.verification]}`}>
                        {story.verification}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-4 text-xs">
                      <div>
                        <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">Story Health</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{story.storyHealth}%</p>
                      </div>
                      <div>
                        <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">SEO</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{story.seo}%</p>
                      </div>
                      <div>
                        <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">Verification</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{story.verification}</p>
                      </div>
                      <div>
                        <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">Ready</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{story.readyToPublish ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Photo Desk</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Photos still needed</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {photoDeskNeeds.map((need) => (
                  <div key={need} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <p className="text-sm font-semibold text-slate-900">{need}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Verification Desk</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Places needing review</h2>
              <div className="mt-5 space-y-3">
                {verificationDeskRecords.map((record) => (
                  <Link key={record.place} href={record.href} className="block rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4 transition hover:bg-white hover:border-[#d7cbb3]">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-semibold text-slate-900">{record.place}</p>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${verificationTone[record.status]}`}>
                        {verificationLabel[record.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{record.detail}</p>
                  </Link>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Partner Desk</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Claims and follow-ups</h2>

              <div className="mt-4 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Business claims</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{claimsOpen} open</p>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Founding Partner follow-ups</p>
                {partnerFollowUps.map((partner) => (
                  <div key={partner.businessName} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">{partner.businessName}</p>
                    <p className="text-xs text-slate-600">Follow-up {formatShortDate(partner.nextFollowUpDate)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Upcoming meetings</p>
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.business} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">{meeting.business}</p>
                    <p className="text-xs text-slate-600">{formatShortDate(meeting.date)} · {meeting.topic}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Publish Today</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ready-to-publish</h2>
              <p className="mt-1 text-sm text-slate-600">{readyToPublishCount} copy-desk stories ready now.</p>
              <div className="mt-5 space-y-3">
                {publishTodayItems.map((item) => (
                  <Link key={item.title} href={item.href} className="flex items-center justify-between gap-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3 transition hover:bg-white hover:border-[#d7cbb3]">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-[0.14em]">{item.type}</p>
                    </div>
                    <span className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                      Open
                    </span>
                  </Link>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">This Week</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Progress</h2>
              <div className="mt-5 space-y-4">
                {progressStats().map((entry) => {
                  const percent = Math.round((entry.current / entry.total) * 100);
                  return (
                    <div key={entry.label}>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>{entry.label}</span>
                        <span>{entry.current}/{entry.total}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b15d,#1f5a3d)]" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <MorningBriefingNote />
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <BasecampStatCard label="Stories in progress" value={String(weeklyIssue.metrics.storiesInProgress)} detail="Issue package work currently in motion." />
            <BasecampStatCard label="Stories published" value={String(weeklyIssue.metrics.storiesPublished)} detail="Already complete in this cycle." />
            <BasecampStatCard label="Photos outstanding" value={String(weeklyIssue.metrics.photosOutstanding)} detail="Still needed from the photo desk." />
            <BasecampStatCard label="Verification outstanding" value={String(weeklyIssue.metrics.verificationOutstanding)} detail="Final checks before publish." />
          </section>
        </main>
      </div>
    </div>
  );
}

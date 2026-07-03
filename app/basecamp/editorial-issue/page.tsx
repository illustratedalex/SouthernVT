import Link from "next/link";
import { Sidebar } from "@/components/admin";
import { BasecampPageHeader, BasecampSection, BasecampStatCard } from "@/components/basecamp";
import { Badge, Prose } from "@/components/ui";
import { weeklyIssue } from "@/data/weeklyIssue";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Newsroom", href: "/basecamp/content" },
  { label: "Editorial Studio", href: "/basecamp/content" },
  { label: "Editorial Issue", href: "/basecamp/editorial-issue", active: true },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Content Report", href: "/basecamp/content/report" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Import", href: "/basecamp/import" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Photo Desk", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Founding Partners", href: "/basecamp/founding-partners" },
];

const statusTone: Record<string, string> = {
  Idea: "border-slate-200 bg-slate-100 text-slate-700",
  Assigned: "border-blue-200 bg-blue-100 text-blue-800",
  Draft: "border-violet-200 bg-violet-100 text-violet-800",
  "Copy Desk": "border-amber-200 bg-amber-100 text-amber-800",
  "Photo Desk": "border-cyan-200 bg-cyan-100 text-cyan-800",
  Ready: "border-emerald-200 bg-emerald-100 text-emerald-800",
  Published: "border-green-200 bg-green-100 text-green-800",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function EditorialIssuePlannerPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <BasecampPageHeader
            eyebrow="Editorial Management"
            title={`Issue #${weeklyIssue.issueNumber} · ${weeklyIssue.title}`}
            description="SouthernVT is centered on one weekly editorial issue that moves from idea to publication through a single newsroom workflow."
            meta={`Publication date ${formatDate(weeklyIssue.publicationDate)}`}
            statusPill={weeklyIssue.currentStage}
            primaryAction={{ label: "Open Newsroom", href: "/basecamp/content" }}
            secondaryAction={{ label: "Read the feature", href: weeklyIssue.coverStory.href }}
          />

          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Stories in progress", value: String(weeklyIssue.metrics.storiesInProgress), detail: "Supporting stories moving through the newsroom." },
              { label: "Stories published", value: String(weeklyIssue.metrics.storiesPublished), detail: "Pieces already ready for readers." },
              { label: "Average Content Health", value: `${weeklyIssue.metrics.averageContentHealth}%`, detail: "Mock editorial quality average for the issue." },
              { label: "Assignments complete", value: String(weeklyIssue.metrics.assignmentsComplete), detail: "Tasks checked off in the weekly workflow." },
            ].map((stat) => (
              <BasecampStatCard key={stat.label} label={stat.label} value={stat.value} detail={stat.detail} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <BasecampSection
              eyebrow="Publication Status"
              title="Issue flow"
              description="Issue #1 moves through the weekly publication pipeline in order."
              className="p-6"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {weeklyIssue.publicationStages.map((stage) => (
                  <div
                    key={stage.label}
                    className={`rounded-2xl border px-3 py-4 text-center ${
                      stage.complete ? "border-[#cde8d6] bg-[#ecf8f0]" : "border-[#ece3cf] bg-[#fcfaf6]"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{stage.label}</p>
                    <div
                      className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                        stage.label === weeklyIssue.currentStage ? "border-[#1f5a3d] bg-[#1f5a3d] text-white" : stage.complete ? "border-[#1f5a3d] bg-white text-[#1f5a3d]" : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {stage.label === weeklyIssue.currentStage ? "Current" : stage.complete ? "Complete" : "Queued"}
                    </div>
                  </div>
                ))}
              </div>
            </BasecampSection>

            <BasecampSection
              eyebrow="Cover Story"
              title={weeklyIssue.coverStory.title}
              description={weeklyIssue.coverStory.summary}
              className="p-6"
            >
              <div className="overflow-hidden rounded-[28px] border border-[#e8dfc8] bg-[#10261e] text-[#f8f2e4]">
                <div className="bg-[linear-gradient(135deg,rgba(20,49,38,0.84),rgba(216,177,93,0.36)),radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%)] p-6">
                  <Badge variant="featured" className="w-fit text-[10px] tracking-[0.18em]">
                    Lead photo placeholder
                  </Badge>
                  <div className="mt-6 flex min-h-48 flex-col justify-end">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d8b15d]">Hamilton Falls</p>
                    <h3 className="mt-2 text-3xl font-semibold text-[#fff9ee]">{weeklyIssue.coverStory.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#efe4d1]">{weeklyIssue.coverStory.summary}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Editorial summary</p>
                  <Prose size="sm" className="mt-2 text-slate-600">
                    <p>{weeklyIssue.editorialNotes}</p>
                  </Prose>
                </article>
                <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Completion</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{weeklyIssue.completionPercent}%</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b15d,#1f5a3d)]" style={{ width: `${weeklyIssue.completionPercent}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">The issue is in copy desk with photography and verification still moving.</p>
                </article>
              </div>
            </BasecampSection>
          </section>

          <BasecampSection
            eyebrow="Supporting Stories"
            title="Companion pieces inside the issue"
            description="Each story supports the cooling-off theme while adding a distinct place, route, or safety angle."
            className="p-6"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {weeklyIssue.supportingStories.map((story) => (
                <article key={story.title} className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{story.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{story.summary}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusTone[story.status]}`}>
                      {story.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Content health</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{story.contentHealth}%</p>
                  </div>

                  <Link href={story.href} className="mt-4 inline-flex text-sm font-semibold text-[#1f5a3d] underline underline-offset-4">
                    Open link
                  </Link>
                </article>
              ))}
            </div>
          </BasecampSection>

          <section className="grid gap-6 lg:grid-cols-2">
            <BasecampSection
              eyebrow="Featured Collections"
              title="Collections tied to the issue"
              description="Mock collection support for the weekly publication package."
              className="p-6"
            >
              <div className="space-y-3">
                {weeklyIssue.featuredCollections.map((collection) => (
                  <article key={collection.title} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <p className="text-lg font-semibold text-slate-900">{collection.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{collection.summary}</p>
                    <Link href={collection.href} className="mt-3 inline-flex text-sm font-semibold text-[#1f5a3d] underline underline-offset-4">
                      Open collection
                    </Link>
                  </article>
                ))}
              </div>
            </BasecampSection>

            <BasecampSection
              eyebrow="Photography Assignments"
              title="Photo desk checklist"
              description="The weekly issue needs a hero, gallery, drone, winter reference, and a short vertical reel."
              className="p-6"
            >
              <div className="space-y-3">
                {weeklyIssue.photographyAssignments.map((task) => (
                  <article key={task.title} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <p className="mt-1 text-sm leading-7 text-slate-600">{task.detail}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${task.status === "complete" ? "border-emerald-200 bg-emerald-100 text-emerald-800" : task.status === "in_progress" ? "border-amber-200 bg-amber-100 text-amber-800" : "border-slate-200 bg-slate-100 text-slate-700"}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </BasecampSection>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <BasecampSection
              eyebrow="Copy Desk"
              title="Readability, SEO, verification, and content health"
              description="The copy desk keeps the issue readable, searchable, and credible before publication."
              className="p-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Readability", value: "Easy", detail: "Straightforward summer language and short paragraphs." },
                  { label: "SEO", value: "88%", detail: "Strong swim-hole and waterfall search coverage." },
                  { label: "Verification", value: "79%", detail: "Safety notes and access details are still being checked." },
                  { label: "Content Health", value: "88%", detail: "The package is healthy across copy, links, and structure." },
                ].map((metric) => (
                  <article key={metric.label} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{metric.detail}</p>
                  </article>
                ))}
              </div>

              <article className="mt-4 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Editorial notes</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {weeklyIssue.editorialNotes} The copy desk is keeping a close eye on the balance between useful river safety guidance and the broader summer story package.
                </p>
              </article>
            </BasecampSection>

            <BasecampSection
              eyebrow="Verification Tasks"
              title="What still needs checking"
              description="A short list of the facts and safety details that should be confirmed before release."
              className="p-6"
            >
              <div className="space-y-3">
                {weeklyIssue.verificationTasks.map((task) => (
                  <article key={task.title} className="flex items-start justify-between gap-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">{task.detail}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${task.status === "complete" ? "border-emerald-200 bg-emerald-100 text-emerald-800" : task.status === "in_progress" ? "border-blue-200 bg-blue-100 text-blue-800" : "border-slate-200 bg-slate-100 text-slate-700"}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </article>
                ))}
              </div>
            </BasecampSection>
          </section>

          <BasecampSection
            eyebrow="Publication Checklist"
            title="Final readiness before publish"
            description="Use the checklist to keep the issue moving in a single, understandable workflow."
            className="p-6"
          >
            <div className="grid gap-3 md:grid-cols-2">
              {weeklyIssue.publicationChecklist.map((item) => (
                <article key={item.title} className={`rounded-2xl border p-4 ${item.complete ? "border-[#cde8d6] bg-[#ecf8f0]" : "border-[#ece3cf] bg-[#fcfaf6]"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.complete ? "✓" : "☐"}</span>
                    <div>
                      <p className={`font-semibold ${item.complete ? "text-[#1f5a3d]" : "text-slate-900"}`}>{item.title}</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">{item.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </BasecampSection>
        </main>
      </div>
    </div>
  );
}
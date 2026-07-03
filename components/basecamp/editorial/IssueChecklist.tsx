"use client";

import { EditorialIssue } from "@/types/EditorialIssue";

interface IssueChecklistProps {
  issue: EditorialIssue;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  description?: string;
}

export function IssueChecklist({ issue }: IssueChecklistProps) {
  const items: ChecklistItem[] = [
    {
      id: "cover-story",
      label: "Cover Story Assigned",
      completed: !!issue.coverStoryId,
      description: "Lead editorial narrative for this week",
    },
    {
      id: "places",
      label: "Featured Places (min 3)",
      completed: issue.featuredPlaces.length >= 3,
      description: `${issue.featuredPlaces.length} destinations selected`,
    },
    {
      id: "collections",
      label: "Collections (min 2)",
      completed: issue.featuredCollections.length >= 2,
      description: `${issue.featuredCollections.length} collections curated`,
    },
    {
      id: "assignments",
      label: "All Assignments Created",
      completed: issue.assignments.length > 0 && issue.assignments.every((a) => a.assignee),
      description: `${issue.assignments.filter((a) => a.assignee).length}/${issue.assignments.length} assigned`,
    },
    {
      id: "photography",
      label: "Photography Scheduled",
      completed: issue.assignments.some((a) => a.type === "photography" && a.status !== "idea"),
      description: "Photos assigned or submitted",
    },
    {
      id: "seo",
      label: "SEO Copy Complete",
      completed: issue.assignments.some((a) => a.type === "seo" && a.status === "complete"),
      description: "Titles, descriptions, metadata",
    },
    {
      id: "deals",
      label: "Partner Deals Confirmed",
      completed: issue.featuredDeals.length > 0,
      description: `${issue.featuredDeals.length} deals included`,
    },
    {
      id: "events",
      label: "Events Linked",
      completed: issue.featuredEvents.length > 0,
      description: `${issue.featuredEvents.length} events featured`,
    },
  ];

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Publication Readiness</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Pre-Publication Checklist</h2>
        <p className="mt-1 text-sm text-slate-600">Track completion status for this week&apos;s issue</p>
      </div>

      <div className="mb-6">
        <div className="w-full bg-slate-200 rounded-full h-3 border border-[#ece3cf]">
          <div
            className="bg-gradient-to-r from-[#1f3b2f] to-[#2a5a46] h-3 rounded-full transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        <p className="text-sm font-semibold text-slate-700 mt-2">
          {completedCount} of {totalCount} items complete ({percentComplete}%)
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg border border-[#ece3cf] transition ${
              item.completed ? "bg-green-50" : "bg-slate-50 hover:bg-white"
            }`}
          >
            <div className="flex-shrink-0 mt-1">
              <span className="text-2xl">{item.completed ? "✓" : "☐"}</span>
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${item.completed ? "text-green-800" : "text-slate-900"}`}>
                {item.label}
              </p>
              {item.description && <p className="text-xs text-slate-600 mt-1">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {percentComplete === 100 && (
        <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm font-semibold text-green-800">✨ Issue is ready to publish!</p>
        </div>
      )}
    </article>
  );
}

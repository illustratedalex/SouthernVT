"use client";

import { EditorialIssue, EditorialIssueStatus } from "@/types/EditorialIssue";

interface EditorialIssueHeaderProps {
  issue: EditorialIssue;
}

const statusLabels: Record<EditorialIssueStatus, string> = {
  planning: "📋 Planning",
  active: "🎯 Active",
  review: "👁️ In Review",
  published: "✓ Published",
  archived: "📦 Archived",
};

const statusColors: Record<EditorialIssueStatus, string> = {
  planning: "bg-slate-100 text-slate-800",
  active: "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-700",
};

export function EditorialIssueHeader({ issue }: EditorialIssueHeaderProps) {
  const weekOfDate = new Date(issue.weekOf);
  const weekEndDate = new Date(weekOfDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-7 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColors[issue.status]}`}>
              {statusLabels[issue.status]}
            </span>
            <span className="text-xs text-slate-500">
              Week of {weekOfDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
          <h1 className="text-4xl font-semibold text-slate-900">{issue.title}</h1>
          <p className="mt-2 text-lg text-slate-700">{issue.theme}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#e8dfc8]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f3b2f]">Featured Places</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{issue.featuredPlaces.length}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f3b2f]">Assignments</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{issue.assignments.length}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f3b2f]">Collections</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{issue.featuredCollections.length}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f3b2f]">Deals & Events</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {issue.featuredDeals.length + issue.featuredEvents.length}
          </p>
        </div>
      </div>
    </article>
  );
}

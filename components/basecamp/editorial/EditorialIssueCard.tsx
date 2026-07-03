"use client";

import { EditorialIssue } from "@/types/EditorialIssue";

interface EditorialIssueCardProps {
  issue: EditorialIssue;
  isActive?: boolean;
  onClick?: () => void;
}

const statusEmojis: Record<string, string> = {
  planning: "📋",
  active: "🎯",
  review: "👁️",
  published: "✓",
  archived: "📦",
};

export function EditorialIssueCard({ issue, isActive = false, onClick }: EditorialIssueCardProps) {
  const weekOfDate = new Date(issue.weekOf);
  const completedAssignments = issue.assignments.filter((a) => a.status === "complete").length;

  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl border-2 p-4 transition-all ${
        isActive
          ? "border-[#1f3b2f] bg-blue-50 shadow-md"
          : "border-[#ece3cf] bg-white hover:bg-[#fcfaf6] hover:border-[#d7cbb3]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm text-slate-900 flex-1">{issue.title}</h3>
        <span className="text-lg flex-shrink-0">{statusEmojis[issue.status]}</span>
      </div>

      <p className="text-xs text-slate-600 mb-3">
        Week of {weekOfDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>

      <p className="text-sm text-slate-700 mb-3 line-clamp-2">{issue.theme}</p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-3">
          <span>📍 {issue.featuredPlaces.length}</span>
          <span>📝 {issue.assignments.length}</span>
          <span>✓ {completedAssignments}</span>
        </div>
      </div>
    </button>
  );
}

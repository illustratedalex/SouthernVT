"use client";

import { EditorialIssueAssignment } from "@/types/EditorialIssue";

interface PhotoNeedsPanelProps {
  assignments: EditorialIssueAssignment[];
}

const statusIcons: Record<string, string> = {
  idea: "💡",
  assigned: "✋",
  in_progress: "⚡",
  submitted: "📦",
  review: "👁️",
  complete: "✓",
};

export function PhotoNeedsPanel({ assignments }: PhotoNeedsPanelProps) {
  const photoAssignments = assignments.filter((a) => a.type === "photography");
  const completeCount = photoAssignments.filter((a) => a.status === "complete").length;
  const submittedCount = photoAssignments.filter((a) => a.status === "submitted" || a.status === "review").length;

  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Photo Assignment</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Photo Desk Summary</h2>
        <p className="mt-1 text-sm text-slate-600">Photography assignments and status</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg bg-slate-50 p-3 border border-[#ece3cf]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f3b2f]">Total</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{photoAssignments.length}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-3 border border-green-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-800">Complete</p>
          <p className="mt-1 text-2xl font-bold text-green-800">{completeCount}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-800">Ready</p>
          <p className="mt-1 text-2xl font-bold text-blue-800">{submittedCount}</p>
        </div>
      </div>

      <div className="space-y-2">
        {photoAssignments.length === 0 ? (
          <p className="text-sm text-slate-600 italic">No photography assignments scheduled.</p>
        ) : (
          photoAssignments.map((assignment) => (
            <div key={assignment.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-[#ece3cf]">
              <span className="text-lg flex-shrink-0">{statusIcons[assignment.status] || "📸"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900">{assignment.title}</p>
                {assignment.assignee && <p className="text-xs text-slate-600 mt-0.5">👤 {assignment.assignee}</p>}
                {assignment.dueDate && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    📅 Due {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

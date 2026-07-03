"use client";

import { EditorialIssueAssignment } from "@/types/EditorialIssue";

interface AssignmentBoardProps {
  assignments: EditorialIssueAssignment[];
}

const statusOrder = ["idea", "assigned", "in_progress", "submitted", "review", "complete"];

const statusLabels: Record<string, string> = {
  idea: "Idea",
  assigned: "Assigned",
  in_progress: "In Progress",
  submitted: "Submitted",
  review: "Review",
  complete: "Complete",
};

const priorityColors: Record<string, string> = {
  low: "border-blue-200 bg-blue-50",
  medium: "border-yellow-200 bg-yellow-50",
  high: "border-orange-200 bg-orange-50",
  urgent: "border-red-200 bg-red-50",
};

const priorityIcons: Record<string, string> = {
  low: "🔵",
  medium: "🟡",
  high: "🟠",
  urgent: "🔴",
};

const typeIcons: Record<string, string> = {
  story: "📝",
  photography: "📸",
  research: "🔍",
  verification: "✓",
  seo: "🔎",
  outreach: "📞",
  collection: "🗂️",
};

export function AssignmentBoard({ assignments }: AssignmentBoardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Assignment Board</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Kanban View</h2>
        <p className="mt-1 text-sm text-slate-600">Track assignments through their workflow</p>
      </div>

      <div className="overflow-x-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${statusOrder.length}, 1fr)`, minWidth: "100%" }}>
          {statusOrder.map((status) => {
            const statusAssignments = assignments.filter((a) => a.status === status);

            return (
              <div key={status} className="flex flex-col">
                <div className="rounded-lg bg-slate-50 p-3 mb-3 border border-[#ece3cf]">
                  <h3 className="font-semibold text-sm text-slate-900">{statusLabels[status]}</h3>
                  <p className="text-xs text-slate-600 mt-1">{statusAssignments.length} items</p>
                </div>

                <div className="space-y-3 flex-1">
                  {statusAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`rounded-lg border-2 p-3 ${priorityColors[assignment.priority]} hover:shadow-md transition`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-lg flex-shrink-0">{typeIcons[assignment.type] || "📌"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 break-words">{assignment.title}</p>
                          {assignment.assignee && (
                            <p className="text-xs text-slate-600 mt-1">👤 {assignment.assignee}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg flex-shrink-0">{priorityIcons[assignment.priority]}</span>
                        {assignment.dueDate && (
                          <span className="text-xs text-slate-600">
                            📅 {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>

                      {assignment.notes && (
                        <p className="text-xs text-slate-700 mt-2 italic border-t border-current pt-2 opacity-75">
                          {assignment.notes.substring(0, 60)}
                          {assignment.notes.length > 60 ? "..." : ""}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

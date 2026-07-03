import Link from "next/link";
import { Assignment } from "@/types/Assignment";

interface AssignmentCardProps {
  assignment: Assignment;
  placeName?: string;
  placeSlug?: string;
}

const priorityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-800 border-red-300",
  High: "bg-orange-100 text-orange-800 border-orange-300",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Low: "bg-blue-100 text-blue-800 border-blue-300",
};

const statusColors: Record<string, string> = {
  Unassigned: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "In Review": "bg-purple-100 text-purple-700",
  Complete: "bg-green-100 text-green-700",
  "On Hold": "bg-gray-100 text-gray-700",
};

export function AssignmentCard({ assignment, placeName, placeSlug }: AssignmentCardProps) {
  const deadline = assignment.deadline ? new Date(assignment.deadline) : null;
  const isOverdue = deadline && deadline < new Date();

  return (
    <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4 hover:bg-white transition">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-slate-900 truncate">{assignment.title}</h4>
            {placeName && (
              <p className="text-xs text-slate-500 mt-1">📍 {placeName}</p>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-600 flex-shrink-0 whitespace-nowrap">
            {assignment.assignmentType}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${statusColors[assignment.status] || statusColors.Unassigned}`}>
            {assignment.status}
          </span>
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${priorityColors[assignment.priority] || priorityColors.Medium}`}>
            {assignment.priority}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600">
          {assignment.estimatedMinutes && (
            <div className="flex items-center gap-1">
              ⏱ {assignment.estimatedMinutes} min
            </div>
          )}
          {deadline && (
            <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
              Due {deadline.toLocaleDateString()}
            </span>
          )}
          {!deadline && <span>No deadline</span>}
        </div>

        <Link
          href={placeSlug ? `/basecamp/places/${placeSlug}` : "/basecamp"}
          className="w-full inline-block text-center rounded-lg border border-[#d7cbb3] bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-[#fcfaf6]"
        >
          Open →
        </Link>
      </div>
    </article>
  );
}

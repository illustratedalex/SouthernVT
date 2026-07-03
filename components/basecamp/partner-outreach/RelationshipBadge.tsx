import type { RelationshipStrength } from "@/types/PartnerOutreach";

const relationshipLabel: Record<RelationshipStrength, string> = {
  new: "New",
  know_them: "Know Them",
  friend: "Friend",
  existing_customer: "Existing Customer",
};

const relationshipTone: Record<RelationshipStrength, string> = {
  new: "bg-slate-100 text-slate-700 border-slate-200",
  know_them: "bg-blue-100 text-blue-800 border-blue-200",
  friend: "bg-amber-100 text-amber-800 border-amber-200",
  existing_customer: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function RelationshipBadge({ strength }: { strength: RelationshipStrength }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${relationshipTone[strength]}`}>
      {relationshipLabel[strength]}
    </span>
  );
}

"use client";

import type { TripBudget } from "@/types/Trip";

type BudgetPickerProps = {
  value: TripBudget;
  onChange: (value: TripBudget) => void;
};

const budgetOptions: Array<{ key: TripBudget; label: string; description: string }> = [
  {
    key: "low",
    label: "Low Key",
    description: "Free trails, market snacks, and easygoing local stops.",
  },
  {
    key: "medium",
    label: "Balanced",
    description: "A mix of paid attractions, meals out, and scenic drives.",
  },
  {
    key: "high",
    label: "Treat Trip",
    description: "Premium stays, curated dining, and signature experiences.",
  },
];

export function BudgetPicker({ value, onChange }: BudgetPickerProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {budgetOptions.map((option) => {
        const isActive = value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`rounded-3xl border p-4 text-left transition ${
              isActive
                ? "border-[#1f3b2f] bg-[#eef5f1]"
                : "border-[#d7cbb3] bg-[#fcfaf6] hover:border-[#bfa777]"
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{option.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p>
          </button>
        );
      })}
    </div>
  );
}

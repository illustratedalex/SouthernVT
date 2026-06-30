"use client";

import type { TripPace } from "@/types/Trip";

type TripPacePickerProps = {
  value: TripPace;
  onChange: (value: TripPace) => void;
};

const paceOptions: Array<{ key: TripPace; label: string; description: string }> = [
  {
    key: "relaxed",
    label: "Relaxed",
    description: "Fewer anchors each day with room for wandering.",
  },
  {
    key: "balanced",
    label: "Balanced",
    description: "A practical mix of planned highlights and free time.",
  },
  {
    key: "packed",
    label: "Packed",
    description: "Maximize coverage with a full day of curated stops.",
  },
];

export function TripPacePicker({ value, onChange }: TripPacePickerProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {paceOptions.map((option) => {
        const isActive = option.key === value;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`rounded-3xl border p-4 text-left transition ${
              isActive ? "border-[#1f3b2f] bg-[#eef5f1]" : "border-[#d7cbb3] bg-[#fcfaf6] hover:border-[#bfa777]"
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

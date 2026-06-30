"use client";

import type { ExplorerMood } from "@/types/Explorer";

const moodLabels: Record<ExplorerMood, string> = {
  relaxation: "Relaxation",
  adventure: "Adventure",
  food: "Food",
  family: "Family",
  photography: "Photography",
  dogs: "Dogs",
  swimming: "Swimming",
  scenic: "Scenic",
  quiet: "Quiet",
  shopping: "Shopping",
  history: "History",
  rainy_day: "Rainy Day",
  romantic: "Romantic",
  accessibility: "Accessibility",
};

type MoodPickerProps = {
  moods: ExplorerMood[];
  selectedMood: ExplorerMood | "any";
  onSelectMood: (mood: ExplorerMood | "any") => void;
};

export function MoodPicker({ moods, selectedMood, onSelectMood }: MoodPickerProps) {
  return (
    <section className="rounded-[26px] border border-[#e8dfc8] bg-white p-5 shadow-[0_16px_52px_rgba(31,59,47,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Choose your vibe</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectMood("any")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            selectedMood === "any" ? "bg-[#1f3b2f] text-[#f8f2e4]" : "border border-[#d7cbb3] bg-[#fcfaf6] text-slate-700"
          }`}
        >
          Surprise me
        </button>
        {moods.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => onSelectMood(mood)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedMood === mood ? "bg-[#1f3b2f] text-[#f8f2e4]" : "border border-[#d7cbb3] bg-[#fcfaf6] text-slate-700"
            }`}
          >
            {moodLabels[mood]}
          </button>
        ))}
      </div>
    </section>
  );
}

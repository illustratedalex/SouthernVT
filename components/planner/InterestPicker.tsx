"use client";

type InterestPickerProps = {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export function InterestPicker({ options, selected, onChange }: InterestPickerProps) {
  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      onChange(selected.filter((item) => item !== interest));
      return;
    }
    onChange([...selected, interest]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((interest) => {
        const isActive = selected.includes(interest);
        return (
          <button
            key={interest}
            type="button"
            onClick={() => toggleInterest(interest)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-[#1f3b2f] bg-[#1f3b2f] text-[#f8f2e4]"
                : "border-[#d7cbb3] bg-[#fcfaf6] text-slate-700 hover:bg-[#f4ebd5]"
            }`}
          >
            {interest}
          </button>
        );
      })}
    </div>
  );
}

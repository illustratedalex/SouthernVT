import Link from "next/link";
import { EditorialSection } from "@/components/ui";

type PickerOption = {
  value: string;
  label: string;
  href: string;
  active: boolean;
};

type MoodPickerProps = {
  options: PickerOption[];
};

export function MoodPicker({ options }: MoodPickerProps) {
  return (
    <EditorialSection
      eyebrow="Step 2"
      title="Mood"
      description="Choose the vibe that best matches your day."
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Link
            key={option.value}
            href={option.href}
            className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition ${
              option.active
                ? "border-(--color-forest-green) bg-(--color-forest-green) text-(--color-cream)"
                : "border-[#d7cbb3] bg-[#fcfaf6] text-slate-700 hover:bg-white"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </EditorialSection>
  );
}


import Link from "next/link";
import { EditorialSection } from "@/components/ui";

type PickerOption = {
  value: string;
  label: string;
  href: string;
  active: boolean;
};

type TimePickerProps = {
  options: PickerOption[];
};

export function TimePicker({ options }: TimePickerProps) {
  return (
    <EditorialSection
      eyebrow="Step 3"
      title="Time Available"
      description="Set your planning horizon so Concierge can pace the day."
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Link
            key={option.value}
            href={option.href}
            scroll={false}
            className={`inline-flex h-11 items-center rounded-full border px-4 text-sm font-semibold transition ${
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

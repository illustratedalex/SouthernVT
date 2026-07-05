import Link from "next/link";
import { EditorialSection } from "@/components/ui";

type PickerOption = {
  value: string;
  label: string;
  href: string;
  active: boolean;
};

type TravelStylePickerProps = {
  options: PickerOption[];
};

export function TravelStylePicker({ options }: TravelStylePickerProps) {
  return (
    <EditorialSection
      eyebrow="Step 4"
      title="Travel Style"
      description="Tell Concierge who the day is for."
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

import Link from "next/link";
import { EditorialSection } from "@/components/ui";

type PickerOption = {
  value: string;
  label: string;
  href: string;
  active: boolean;
};

type RadiusPickerProps = {
  options: PickerOption[];
};

export function RadiusPicker({ options }: RadiusPickerProps) {
  return (
    <EditorialSection
      eyebrow="Step 5"
      title="Driving Radius"
      description="Set how far you want to travel between stops."
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Link
            key={option.value}
            href={option.href}
            scroll={false}
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

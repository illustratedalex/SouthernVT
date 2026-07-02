import Link from "next/link";
import { EditorialSection } from "@/components/ui";
import type {
  ConciergeMood,
  ConciergeRadius,
  ConciergeTimeAvailable,
  ConciergeTravelStyle,
} from "@/types/Concierge";
import { MoodPicker } from "./MoodPicker";
import { RadiusPicker } from "./RadiusPicker";
import { TimePicker } from "./TimePicker";
import { TravelStylePicker } from "./TravelStylePicker";

type Option = {
  value: string;
  label: string;
};

type ConciergeWizardProps = {
  selectedMood?: ConciergeMood;
  selectedTime?: ConciergeTimeAvailable;
  selectedStyle?: ConciergeTravelStyle;
  selectedRadius?: ConciergeRadius;
  moodOptions: Option[];
  timeOptions: Option[];
  styleOptions: Option[];
  radiusOptions: Option[];
  buildHref: (updates: Record<string, string | undefined>) => string;
  allInputsSelected: boolean;
};

export function ConciergeWizard({
  selectedMood,
  selectedTime,
  selectedStyle,
  selectedRadius,
  moodOptions,
  timeOptions,
  styleOptions,
  radiusOptions,
  buildHref,
  allInputsSelected,
}: ConciergeWizardProps) {
  return (
    <>
      <MoodPicker
        options={moodOptions.map((option) => ({
          ...option,
          active: option.value === selectedMood,
          href: buildHref({ mood: option.value, generate: undefined }),
        }))}
      />

      <TimePicker
        options={timeOptions.map((option) => ({
          ...option,
          active: option.value === selectedTime,
          href: buildHref({ time: option.value, generate: undefined }),
        }))}
      />

      <TravelStylePicker
        options={styleOptions.map((option) => ({
          ...option,
          active: option.value === selectedStyle,
          href: buildHref({ style: option.value, generate: undefined }),
        }))}
      />

      <RadiusPicker
        options={radiusOptions.map((option) => ({
          ...option,
          active: option.value === selectedRadius,
          href: buildHref({ radius: option.value, generate: undefined }),
        }))}
      />

      <EditorialSection
        eyebrow="Step 6"
        title="Generate"
        description="Compass creates a Featured Place, Collection, Guide, Food Stop, optional Event and Deal, plus a suggested timeline."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={buildHref({ generate: "1" })}
            scroll={false}
            className="inline-flex h-12 items-center justify-center rounded-full bg-(--color-forest-green) px-6 text-sm font-semibold text-(--color-cream) motion-safe:transition motion-safe:hover:bg-(--color-pine)"
          >
            Generate Concierge Plan
          </Link>
          {!allInputsSelected ? (
            <p className="text-sm text-slate-600">Select mood, time, travel style, and radius first.</p>
          ) : null}
        </div>
      </EditorialSection>
    </>
  );
}

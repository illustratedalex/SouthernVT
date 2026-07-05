import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ConciergeHero } from "@/components/concierge/ConciergeHero";
import { ConciergeResults } from "@/components/concierge/ConciergeResults";
import { ConciergeWizard } from "@/components/concierge/ConciergeWizard";
import {
  conciergeMoodOptions,
  conciergeRadiusOptions,
  conciergeTimeOptions,
  conciergeTravelStyleOptions,
  generateConciergeTrip,
} from "@/lib/concierge/ConciergeService";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import type {
  ConciergeMood,
  ConciergePreferences,
  ConciergeRadius,
  ConciergeTimeAvailable,
  ConciergeTravelStyle,
} from "@/types/Concierge";

export const metadata: Metadata = createPageMetadata({
  title: "Compass Concierge | Guided Day Planning",
  description: "Use Compass Concierge to build a calm, guided day plan across Southern Vermont using verified local recommendations.",
  path: "/concierge",
});

interface ConciergePageProps {
  searchParams: Promise<{
    mood?: string;
    time?: string;
    style?: string;
    radius?: string;
    generate?: string;
  }>;
}

function isValidOption<T extends string>(value: string | undefined, options: Array<{ value: T }>): value is T {
  return Boolean(value && options.some((option) => option.value === value));
}

function buildHref(base: Record<string, string | undefined>, updates: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  const merged = { ...base, ...updates };
  Object.entries(merged).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  const query = params.toString();
  const basePath = query ? `/concierge?${query}` : "/concierge";
  return `${basePath}#concierge-wizard`;
}

export default async function ConciergePage({ searchParams }: ConciergePageProps) {
  const params = await searchParams;

  const selectedMood: ConciergeMood | undefined = isValidOption(params.mood, conciergeMoodOptions) ? params.mood : undefined;
  const selectedTime: ConciergeTimeAvailable | undefined = isValidOption(params.time, conciergeTimeOptions) ? params.time : undefined;
  const selectedStyle: ConciergeTravelStyle | undefined = isValidOption(params.style, conciergeTravelStyleOptions) ? params.style : undefined;
  const selectedRadius: ConciergeRadius | undefined = isValidOption(params.radius, conciergeRadiusOptions) ? params.radius : undefined;
  const shouldGenerate = params.generate === "1";

  const currentParams: Record<string, string | undefined> = {
    mood: selectedMood,
    time: selectedTime,
    style: selectedStyle,
    radius: selectedRadius,
  };

  const allInputsSelected = Boolean(selectedMood && selectedTime && selectedStyle && selectedRadius);
  const preferences: ConciergePreferences | null =
    allInputsSelected && selectedMood && selectedTime && selectedStyle && selectedRadius
      ? {
          mood: selectedMood,
          timeAvailable: selectedTime,
          travelStyle: selectedStyle,
          radius: selectedRadius,
        }
      : null;

  const [trip, aiConciergeEnabled] = await Promise.all([
    shouldGenerate && preferences ? generateConciergeTrip(preferences) : Promise.resolve(null),
    isFeatureEnabled("aiConcierge"),
  ]);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <ConciergeHero />

        <section id="concierge-wizard">
          <ConciergeWizard
            selectedMood={selectedMood}
            selectedTime={selectedTime}
            selectedStyle={selectedStyle}
            selectedRadius={selectedRadius}
            moodOptions={conciergeMoodOptions.map((option) => ({ value: option.value, label: option.label }))}
            timeOptions={conciergeTimeOptions.map((option) => ({ value: option.value, label: option.label }))}
            styleOptions={conciergeTravelStyleOptions.map((option) => ({ value: option.value, label: option.label }))}
            radiusOptions={conciergeRadiusOptions.map((option) => ({ value: option.value, label: option.label }))}
            buildHref={(updates) => buildHref(currentParams, updates)}
            allInputsSelected={allInputsSelected}
          />
        </section>

        {trip ? <ConciergeResults trip={trip} aiConciergeEnabled={aiConciergeEnabled} /> : null}
      </section>

      <Footer />
    </main>
  );
}

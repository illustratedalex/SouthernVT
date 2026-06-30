"use client";

import { useMemo, useState } from "react";
import { BudgetPicker } from "@/components/planner/BudgetPicker";
import { GeneratedTripPreview } from "@/components/planner/GeneratedTripPreview";
import { InterestPicker } from "@/components/planner/InterestPicker";
import { TripPacePicker } from "@/components/planner/TripPacePicker";
import { TripStep } from "@/components/planner/TripStep";
import { generateMockTrip } from "@/repositories/TripRepository";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import type { Trip, TripBudget, TripPace } from "@/types/Trip";

type TripWizardProps = {
  plannerEnabled: boolean;
  places: Place[];
  collections: Collection[];
  events: Event[];
  articles: Article[];
};

const interestOptions = [
  "Waterfalls",
  "Hiking",
  "Scenic Drives",
  "Family Friendly",
  "Food & Drink",
  "Shopping",
  "Local Culture",
  "Relaxed Pace",
];

export function TripWizard({ plannerEnabled, places, collections, events, articles }: TripWizardProps) {
  const [step, setStep] = useState(0);
  const [homeBase, setHomeBase] = useState("Brattleboro");
  const [numberOfDays, setNumberOfDays] = useState(2);
  const [travelers, setTravelers] = useState(2);
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<TripBudget>("medium");
  const [pace, setPace] = useState<TripPace>("balanced");

  const generatedTrip: Trip = useMemo(
    () =>
      generateMockTrip({
        homeBase,
        numberOfDays,
        travelers,
        interests,
        budget,
        pace,
      }),
    [homeBase, numberOfDays, travelers, interests, budget, pace],
  );

  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places]);
  const collectionsById = useMemo(() => new Map(collections.map((collection) => [collection.id, collection])), [collections]);
  const eventsById = useMemo(() => new Map(events.map((event) => [event.id, event])), [events]);
  const articlesById = useMemo(() => new Map(articles.map((article) => [article.id, article])), [articles]);

  const next = () => setStep((current) => Math.min(current + 1, 6));
  const prev = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <div className="space-y-6">
      <header className="rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f3b2f]">Trip Planner</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Build your Southern Vermont itinerary</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">Step {step + 1} of 7. Previews are generated from mock Places, Collections, Events, and Guides.</p>
        {!plannerEnabled ? (
          <p className="mt-3 rounded-2xl border border-[#d7cbb3] bg-[#fff7e4] px-4 py-3 text-sm font-medium text-[#6b5a30]">
            AI-powered planning coming soon. This preview uses curated SouthernVT data.
          </p>
        ) : null}
      </header>

      {step === 0 ? (
        <TripStep title="Home base town" description="Set your base town so the itinerary keeps drive-time reasonable.">
          <input
            value={homeBase}
            onChange={(event) => setHomeBase(event.target.value)}
            placeholder="Example: Brattleboro"
            className="h-12 w-full rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none"
          />
        </TripStep>
      ) : null}

      {step === 1 ? (
        <TripStep title="How many days?" description="Choose trip length. We’ll spread stops across each day.">
          <input
            type="number"
            min={1}
            max={7}
            value={numberOfDays}
            onChange={(event) => setNumberOfDays(Math.min(7, Math.max(1, Number(event.target.value) || 1)))}
            className="h-12 w-40 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none"
          />
        </TripStep>
      ) : null}

      {step === 2 ? (
        <TripStep title="Who is traveling?" description="Solo, couples, and groups can pace days differently.">
          <input
            type="number"
            min={1}
            max={12}
            value={travelers}
            onChange={(event) => setTravelers(Math.min(12, Math.max(1, Number(event.target.value) || 1)))}
            className="h-12 w-40 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none"
          />
        </TripStep>
      ) : null}

      {step === 3 ? (
        <TripStep title="What are you interested in?" description="Pick themes and we’ll prioritize matching places and collections.">
          <InterestPicker options={interestOptions} selected={interests} onChange={setInterests} />
        </TripStep>
      ) : null}

      {step === 4 ? (
        <TripStep title="Budget" description="Select your budget style to adjust recommendation mix.">
          <BudgetPicker value={budget} onChange={setBudget} />
        </TripStep>
      ) : null}

      {step === 5 ? (
        <TripStep title="Trip pace" description="Choose how full each day should feel.">
          <TripPacePicker value={pace} onChange={setPace} />
        </TripStep>
      ) : null}

      {step === 6 ? (
        <GeneratedTripPreview
          trip={generatedTrip}
          placesById={placesById}
          collectionsById={collectionsById}
          eventsById={eventsById}
          articlesById={articlesById}
          plannerEnabled={plannerEnabled}
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8dfc8] pt-4">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          Back
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <span key={index} className={`h-2.5 w-2.5 rounded-full ${index <= step ? "bg-[#1f3b2f]" : "bg-[#d7cbb3]"}`} />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          disabled={step === 6}
          className="rounded-full bg-[#1f3b2f] px-5 py-2 text-sm font-semibold text-[#f8f2e4] disabled:opacity-50"
        >
          {step === 5 ? "Generate Itinerary" : "Next"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { Collection } from "@/types/Collection";
import type { Place } from "@/types/Place";

interface HiddenGem {
  id: string;
  name: string;
  blurb: string;
  location: string;
}

interface TripBuilderProps {
  places: Place[];
  collections: Collection[];
  hiddenGems: HiddenGem[];
}

type TravelCompanion = "Kids" | "Dogs" | "Couple" | "Solo" | "Friends";
type Interest =
  | "Waterfalls"
  | "Food"
  | "Breweries"
  | "Shopping"
  | "Museums"
  | "Hiking"
  | "Fishing"
  | "Photography";
type Budget = "Low" | "Medium" | "High";

const companions: TravelCompanion[] = ["Kids", "Dogs", "Couple", "Solo", "Friends"];
const interestsCatalog: Interest[] = [
  "Waterfalls",
  "Food",
  "Breweries",
  "Shopping",
  "Museums",
  "Hiking",
  "Fishing",
  "Photography",
];
const budgets: Budget[] = ["Low", "Medium", "High"];

export function TripBuilder({ places, collections, hiddenGems }: TripBuilderProps) {
  const [stayLocation, setStayLocation] = useState("Brattleboro");
  const [days, setDays] = useState(3);
  const [travelingWith, setTravelingWith] = useState<TravelCompanion[]>(["Friends"]);
  const [interests, setInterests] = useState<Interest[]>(["Waterfalls", "Food", "Hiking"]);
  const [budget, setBudget] = useState<Budget>("Medium");
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const itinerary = useMemo(() => {
    const interestNeedles = interests.map((item) => item.toLowerCase());

    const scoredPlaces = places
      .map((place) => {
        const text = `${place.placeType} ${place.categories.join(" ")} ${place.tags.join(" ")} ${place.name}`.toLowerCase();
        const interestScore = interestNeedles.reduce((score, needle) => (text.includes(needle) ? score + 2 : score), 0);
        const companionBoost =
          (travelingWith.includes("Kids") && place.categories.some((category) => /family/i.test(category)) ? 2 : 0) +
          (travelingWith.includes("Dogs") && /dogs|trail|park/i.test(text) ? 1 : 0) +
          (travelingWith.includes("Couple") && /inn|brewery|overlook|scenic/i.test(text) ? 1 : 0);
        const budgetScore = budget === "Low" ? (/market|trail|waterfall|park/i.test(text) ? 2 : 0) : budget === "High" ? (/inn|hotel|brewery|shop/i.test(text) ? 1 : 0) : 1;
        return { place, score: interestScore + companionBoost + budgetScore + (place.featured ? 1 : 0) };
      })
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.place);

    const topStops = scoredPlaces.slice(0, Math.max(days * 3, 9));

    const restaurants = scoredPlaces
      .filter((place) => ["Restaurant", "Brewery", "Farm Stand", "Shop"].includes(place.placeType))
      .slice(0, Math.max(days, 3));

    const matchedCollections = collections
      .filter((collection) => {
        const haystack = `${collection.title} ${collection.subtitle} ${collection.tags.join(" ")} ${collection.audience}`.toLowerCase();
        return interestNeedles.some((needle) => haystack.includes(needle));
      })
      .slice(0, 3);

    const generatedDays = Array.from({ length: days }, (_, index) => {
      const morning = topStops[(index * 3) % topStops.length];
      const afternoon = topStops[(index * 3 + 1) % topStops.length];
      const evening = restaurants[index % Math.max(restaurants.length, 1)] ?? topStops[(index * 3 + 2) % topStops.length];

      return {
        day: index + 1,
        morning,
        afternoon,
        evening,
      };
    });

    return {
      topStops,
      generatedDays,
      restaurants,
      matchedCollections,
      hiddenGemPicks: hiddenGems.slice(0, 2),
    };
  }, [budget, collections, days, hiddenGems, interests, places, travelingWith]);

  return (
    <div className="grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="rounded-[30px] border border-[#e8dfc8] bg-white/90 p-6 shadow-[0_20px_70px_rgba(31,59,47,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Trip Builder</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create your custom route</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">Answer a few questions and generate a day-by-day Southern Vermont itinerary.</p>

        <div className="mt-6 space-y-5">
          <QuestionBlock label="Where are you staying?">
            <input
              value={stayLocation}
              onChange={(event) => setStayLocation(event.target.value)}
              className="h-12 w-full rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
            />
          </QuestionBlock>

          <QuestionBlock label="How many days?">
            <select
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className="h-12 w-full rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((dayCount) => (
                <option key={dayCount} value={dayCount}>
                  {dayCount} day{dayCount > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </QuestionBlock>

          <QuestionBlock label="Traveling with">
            <TagSelector
              items={companions}
              selected={travelingWith}
              onToggle={(item) => setTravelingWith((current) => toggleValue(current, item))}
            />
          </QuestionBlock>

          <QuestionBlock label="Interests">
            <TagSelector
              items={interestsCatalog}
              selected={interests}
              onToggle={(item) => setInterests((current) => toggleValue(current, item))}
            />
          </QuestionBlock>

          <QuestionBlock label="Budget">
            <div className="grid grid-cols-3 gap-2">
              {budgets.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setBudget(item)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    budget === item ? "bg-[#1f3b2f] text-[#f8f2e4]" : "border border-[#d7cbb3] bg-[#fcfaf6] text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </QuestionBlock>

          <button
            type="button"
            onClick={() => setGeneratedAt(new Date().toLocaleString())}
            className="h-12 w-full rounded-full bg-[#1f3b2f] text-sm font-semibold text-[#f8f2e4] transition hover:bg-[#3e5b4a]"
          >
            Generate itinerary
          </button>
        </div>
      </aside>

      <section className="space-y-6">
        <div className="rounded-[30px] border border-[#e8dfc8] bg-white/90 p-6 shadow-[0_20px_70px_rgba(31,59,47,0.12)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Generated Trip</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">{days}-day itinerary from {stayLocation}</h2>
              <p className="mt-2 text-sm text-slate-600">{generatedAt ? `Last generated: ${generatedAt}` : "Ready to generate your first trip."}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700">
                Export PDF (placeholder)
              </button>
              <button type="button" className="rounded-full bg-[#1f3b2f] px-4 py-2 text-sm font-semibold text-[#f8f2e4]">
                Save Trip (placeholder)
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <Panel title="Daily itinerary">
              <div className="space-y-4">
                {itinerary.generatedDays.map((dayPlan) => (
                  <article key={dayPlan.day} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Day {dayPlan.day}</p>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                      <TripStop label="Morning" place={dayPlan.morning} />
                      <TripStop label="Afternoon" place={dayPlan.afternoon} />
                      <TripStop label="Evening" place={dayPlan.evening} />
                    </div>
                  </article>
                ))}
              </div>
            </Panel>

            <Panel title="Map + driving route">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-dashed border-[#c9b899] bg-[repeating-linear-gradient(45deg,rgba(31,59,47,0.03),rgba(31,59,47,0.03)_10px,rgba(31,59,47,0.08)_10px,rgba(31,59,47,0.08)_20px)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Map placeholder</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">Interactive map preview will render your stops and route sequence in this panel.</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Driving route placeholder</p>
                  <ol className="mt-2 space-y-1 text-sm text-slate-700">
                    {itinerary.generatedDays.flatMap((day) => [day.morning, day.afternoon, day.evening]).slice(0, 8).map((place, index) => (
                      <li key={`${place.id}-${index}`}>{index + 1}. {place.name}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </Panel>
          </section>

          <section className="space-y-6">
            <Panel title="Restaurants">
              <SimpleList items={itinerary.restaurants.map((place) => `${place.name} · ${place.city}`)} emptyText="No restaurant suggestions found for this profile." />
            </Panel>

            <Panel title="Hidden Gems">
              <SimpleList items={itinerary.hiddenGemPicks.map((gem) => `${gem.name} · ${gem.location}`)} emptyText="Hidden gem picks are loading." />
            </Panel>

            <Panel title="Collections">
              <SimpleList items={itinerary.matchedCollections.map((collection) => `${collection.title} · ${collection.season}`)} emptyText="No collection matches yet. Try different interests." />
            </Panel>
          </section>
        </div>
      </section>
    </div>
  );
}

function QuestionBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">{label}</label>
      {children}
    </div>
  );
}

function TagSelector<T extends string>({
  items,
  selected,
  onToggle,
}: {
  items: T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onToggle(item)}
          className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
            selected.includes(item)
              ? "bg-[#1f3b2f] text-[#f8f2e4]"
              : "border border-[#d7cbb3] bg-[#fcfaf6] text-slate-700"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function toggleValue<T>(current: T[], value: T) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white/90 p-5 shadow-[0_14px_48px_rgba(31,59,47,0.1)]">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TripStop({ label, place }: { label: string; place: Place }) {
  return (
    <div className="rounded-xl border border-[#ece3cf] bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{place.name}</p>
      <p className="text-xs text-slate-500">{place.placeType}</p>
    </div>
  );
}

function SimpleList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (!items.length) {
    return <p className="text-sm text-slate-600">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {items.map((item) => (
        <li key={item} className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  );
}

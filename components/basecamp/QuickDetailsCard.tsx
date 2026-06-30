import type { PlaceType } from "@/types/Place";

interface QuickDetailsState {
  name: string;
  placeType: PlaceType;
  description: string;
  dogFriendly: boolean;
  kidFriendly: boolean;
  swimming: boolean;
  parking: boolean;
  restroom: boolean;
  accessibility: boolean;
  bestSeason: string;
  difficulty: string;
}

interface QuickDetailsCardProps {
  value: QuickDetailsState;
  onChange: (next: QuickDetailsState) => void;
}

const placeTypes: PlaceType[] = [
  "Restaurant",
  "Waterfall",
  "Brewery",
  "Hotel",
  "Trail",
  "Covered Bridge",
  "Maker Studio",
  "Farm Stand",
  "Scenic Overlook",
  "Shop",
];

const toggleFields: Array<{ key: keyof QuickDetailsState; label: string }> = [
  { key: "dogFriendly", label: "Dog Friendly" },
  { key: "kidFriendly", label: "Kid Friendly" },
  { key: "swimming", label: "Swimming" },
  { key: "parking", label: "Parking" },
  { key: "restroom", label: "Restroom" },
  { key: "accessibility", label: "Accessibility" },
];

const booleanToggleKeys = new Set<keyof QuickDetailsState>([
  "dogFriendly",
  "kidFriendly",
  "swimming",
  "parking",
  "restroom",
  "accessibility",
]);

export function QuickDetailsCard({ value, onChange }: QuickDetailsCardProps) {
  const setField = <K extends keyof QuickDetailsState>(key: K, fieldValue: QuickDetailsState[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="space-y-4 rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Step 3</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Quick details</h2>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Place name</span>
        <input
          value={value.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder="Name this location"
          className="h-12 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-base text-slate-800 outline-none"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Place type</span>
        <select
          value={value.placeType}
          onChange={(event) => setField("placeType", event.target.value as PlaceType)}
          className="h-12 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-base text-slate-800 outline-none"
        >
          {placeTypes.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Description</span>
        <textarea
          value={value.description}
          onChange={(event) => setField("description", event.target.value)}
          placeholder="Quick onsite description"
          rows={4}
          className="w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 text-base text-slate-800 outline-none"
        />
      </label>

      <div className="grid gap-2 sm:grid-cols-2">
        {toggleFields.map((field) => (
          <button
            key={field.key}
            type="button"
            onClick={() => {
              if (!booleanToggleKeys.has(field.key)) {
                return;
              }
              setField(field.key, !value[field.key] as QuickDetailsState[typeof field.key]);
            }}
            className={`min-h-12 rounded-2xl border px-4 text-left text-sm font-semibold transition ${
              value[field.key]
                ? "border-[#1f3b2f] bg-[#1f3b2f] text-[#f8f2e4]"
                : "border-[#d7cbb3] bg-[#fcfaf6] text-slate-700"
            }`}
          >
            {field.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-sm font-semibold text-slate-700">Best season</span>
          <input
            value={value.bestSeason}
            onChange={(event) => setField("bestSeason", event.target.value)}
            placeholder="Summer"
            className="h-12 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-base text-slate-800 outline-none"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-semibold text-slate-700">Difficulty</span>
          <input
            value={value.difficulty}
            onChange={(event) => setField("difficulty", event.target.value)}
            placeholder="Easy"
            className="h-12 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-base text-slate-800 outline-none"
          />
        </label>
      </div>
    </section>
  );
}

export type { QuickDetailsState };

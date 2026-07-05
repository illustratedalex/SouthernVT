import { Badge } from "@/components/ui";

type ExperienceProfile = {
  id: "lodging" | "attraction" | "restaurant";
  categories: Array<{ icon: string; label: string; score: number }>;
  notes: string[];
  businessResponse?: string;
};

type TravelerExperiencesProps = {
  listingType: string;
  overallRating?: number;
  verifiedVisitors?: number;
};

const profiles: Record<ExperienceProfile["id"], ExperienceProfile> = {
  lodging: {
    id: "lodging",
    categories: [
      { icon: "🛏️", label: "Comfort", score: 4.8 },
      { icon: "🧼", label: "Cleanliness", score: 4.7 },
      { icon: "🤝", label: "Hospitality", score: 4.9 },
      { icon: "📍", label: "Location", score: 4.8 },
      { icon: "💰", label: "Value", score: 4.6 },
    ],
    notes: [
      "The breakfast was fantastic.",
      "Great base for Hamilton Falls.",
      "Quiet after sunset.",
      "Would absolutely return.",
    ],
    businessResponse: "Thank you for sharing your stay details. We appreciate verified guest feedback and continue updating listing information.",
  },
  attraction: {
    id: "attraction",
    categories: [
      { icon: "🏞️", label: "Scenery", score: 4.9 },
      { icon: "🧭", label: "Accessibility", score: 4.5 },
      { icon: "👨‍👩‍👧‍👦", label: "Family Friendly", score: 4.6 },
      { icon: "👥", label: "Crowds", score: 4.2 },
      { icon: "💰", label: "Value", score: 4.7 },
    ],
    notes: [
      "Trail markers were easy to follow.",
      "Morning light made the scenery stand out.",
      "Good family stop with clear parking options.",
      "Worth pairing with a nearby cafe.",
    ],
  },
  restaurant: {
    id: "restaurant",
    categories: [
      { icon: "🍽️", label: "Food", score: 4.8 },
      { icon: "🧑‍🍳", label: "Service", score: 4.6 },
      { icon: "🕯️", label: "Atmosphere", score: 4.7 },
      { icon: "💰", label: "Value", score: 4.5 },
      { icon: "📍", label: "Location", score: 4.8 },
    ],
    notes: [
      "Food arrived quickly and tasted fresh.",
      "Staff helped with local recommendations.",
      "Easy walk from nearby attractions.",
      "Would return on a future weekend trip.",
    ],
    businessResponse: "Thanks for the thoughtful experience note. Verified traveler feedback helps keep SouthernVT listings practical and useful.",
  },
};

function toProfileId(listingType: string): ExperienceProfile["id"] {
  const normalized = listingType.toLowerCase();
  if (normalized.includes("restaurant") || normalized.includes("cafe")) {
    return "restaurant";
  }
  if (
    normalized.includes("attraction") ||
    normalized.includes("outdoor") ||
    normalized.includes("trail") ||
    normalized.includes("waterfall") ||
    normalized.includes("gallery")
  ) {
    return "attraction";
  }
  return "lodging";
}

function renderStars(rating: number) {
  const fullStars = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(fullStars).padEnd(5, "☆");
}

export function TravelerExperiences({ listingType, overallRating = 5, verifiedVisitors = 12 }: TravelerExperiencesProps) {
  const profile = profiles[toProfileId(listingType)];

  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-[#fcfaf6] p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Traveler Experiences</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Experiences shared by verified visitors.</h2>

      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-[#ece3cf] bg-white p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Overall Experience</p>
          <p className="mt-1 text-2xl font-semibold text-[#1f5a3d]">{renderStars(overallRating)}</p>
        </div>
        <div className="h-10 w-px bg-[#ece3cf]" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Based on</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{verifiedVisitors} Verified Visitors</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {profile.categories.map((item) => (
          <article key={item.label} className="rounded-2xl border border-[#ece3cf] bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {item.icon} {item.label}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{item.score.toFixed(1)}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {profile.notes.slice(0, 5).map((note) => (
          <article key={note} className="rounded-2xl border border-[#ece3cf] bg-white px-4 py-3 text-sm text-slate-700">
            &ldquo;{note.slice(0, 140)}&rdquo;
          </article>
        ))}
      </div>

      {profile.businessResponse ? (
        <article className="mt-4 rounded-2xl border border-[#dbe8df] bg-[#f4faf6] px-4 py-3">
          <Badge variant="forest" className="text-[10px] tracking-[0.14em]">
            Business Response
          </Badge>
          <p className="mt-2 text-sm leading-7 text-slate-700">{profile.businessResponse.slice(0, 140)}</p>
        </article>
      ) : null}

      <div className="mt-5 rounded-2xl border border-[#ece3cf] bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">Stayed here?</p>
        <p className="mt-1 text-sm text-slate-600">Share your experience. Verified guests only.</p>
        <button
          type="button"
          className="mt-3 inline-flex rounded-full bg-[#1f5a3d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2b6d4c]"
        >
          Leave Experience
        </button>
      </div>
    </section>
  );
}

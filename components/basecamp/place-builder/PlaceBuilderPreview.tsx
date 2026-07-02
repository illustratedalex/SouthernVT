import type { PlaceBuilderData } from "./types";

const TYPE_BADGE: Record<string, string> = {
  Restaurant: "bg-[#fff3e0] text-[#b45309]",
  Waterfall: "bg-[#e0f2fe] text-[#0369a1]",
  Brewery: "bg-[#fef9c3] text-[#854d0e]",
  Hotel: "bg-[#f0fdf4] text-[#166534]",
  Trail: "bg-[#ecfdf5] text-[#065f46]",
  "Covered Bridge": "bg-[#fef3c7] text-[#92400e]",
  "Maker Studio": "bg-[#f5f3ff] text-[#5b21b6]",
  "Farm Stand": "bg-[#ecfdf5] text-[#065f46]",
  "Scenic Overlook": "bg-[#e0f2fe] text-[#075985]",
  Shop: "bg-[#fdf4ff] text-[#7e22ce]",
};

interface PlaceBuilderPreviewProps {
  data: PlaceBuilderData;
}

export function PlaceBuilderPreview({ data }: PlaceBuilderPreviewProps) {
  const slug =
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "untitled-place";

  const visitorChips = [
    data.parking && `Parking: ${data.parking}`,
    data.restrooms && `Restrooms: ${data.restrooms}`,
    data.accessibility && `Accessibility: ${data.accessibility}`,
    data.dogs && `Dogs: ${data.dogs}`,
    data.swimming && `Swimming: ${data.swimming}`,
    data.difficulty && `Difficulty: ${data.difficulty}`,
    data.visitLength && `Visit: ${data.visitLength}`,
  ].filter(Boolean) as string[];

  const relItems = [
    data.nearbyFood && { label: "Nearby Food", value: data.nearbyFood },
    data.nearbyLodging && { label: "Nearby Lodging", value: data.nearbyLodging },
    data.nearbyAttractions && { label: "Nearby Attractions", value: data.nearbyAttractions },
    data.collections && { label: "Collections", value: data.collections },
    data.guides && { label: "Guides", value: data.guides },
  ].filter(Boolean) as { label: string; value: string }[];

  const typeBadgeClass = TYPE_BADGE[data.placeType] ?? "bg-[#f3f4f6] text-slate-600";
  const seoTitle = data.seoTitle || data.name || "Place title";
  const seoDescription = data.seoDescription || data.summary || "Add a description in the SEO step.";

  return (
    <div className="space-y-5 rounded-[32px] border border-[#e8dfc8] bg-[#fcfaf6] p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)]">
      {/* Hero image */}
      <div className="overflow-hidden rounded-[24px] border border-[#e8dfc8] bg-white shadow-sm">
        {data.heroImage ? (
          <img
            src={data.heroImage}
            alt={data.name || "Place hero"}
            className="h-64 w-full object-cover"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-[#f0e8d6]">
            <p className="text-sm text-slate-500">Hero image will appear here</p>
          </div>
        )}
      </div>

      {/* Name + type + location */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${typeBadgeClass}`}>
            {data.placeType}
          </span>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">
            {data.name || <span className="text-slate-400">Untitled Place</span>}
          </h3>
          {data.town ? (
            <p className="mt-1 text-sm text-slate-500">
              {data.town}, Vermont{data.county ? ` · ${data.county}` : ""}
            </p>
          ) : null}
        </div>
        <span className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
          Draft
        </span>
      </div>

      {/* Summary */}
      {data.summary ? (
        <p className="text-base leading-8 text-slate-700">{data.summary}</p>
      ) : null}

      {/* Story section */}
      {(data.whyVisit || data.whatMakesUnique || data.insiderTip) ? (
        <div className="rounded-2xl border border-[#e8dfc8] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">The Story</p>
          {data.whyVisit ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Why visit?</p>
              <p className="mt-1 text-sm leading-7 text-slate-700">{data.whyVisit}</p>
            </div>
          ) : null}
          {data.whatMakesUnique ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">What makes it unique</p>
              <p className="mt-1 text-sm leading-7 text-slate-700">{data.whatMakesUnique}</p>
            </div>
          ) : null}
          {data.insiderTip ? (
            <div className="mt-4 rounded-2xl border border-[#efe0b8] bg-[#fff8e8] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a5c17]">Insider Tip</p>
              <p className="mt-1 text-sm text-slate-700">{data.insiderTip}</p>
            </div>
          ) : null}
          {data.bestSeason ? (
            <p className="mt-3 text-sm text-slate-500">
              Best season:{" "}
              <span className="font-semibold text-slate-700">{data.bestSeason}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Visitor info chips */}
      {visitorChips.length > 0 ? (
        <div className="rounded-2xl border border-[#e8dfc8] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Visitor Info</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {visitorChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#e8dfc8] bg-[#fcfaf6] px-3 py-1.5 text-sm text-slate-700"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Gallery strip */}
      {data.gallery ? (
        <div className="rounded-2xl border border-[#e8dfc8] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Gallery</p>
          <p className="mt-2 text-sm text-slate-600">{data.gallery}</p>
          {data.photoNotes ? (
            <p className="mt-2 text-xs italic text-slate-500">{data.photoNotes}</p>
          ) : null}
        </div>
      ) : null}

      {/* Relationships */}
      {relItems.length > 0 ? (
        <div className="rounded-2xl border border-[#e8dfc8] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Related Content</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {relItems.map((item) => (
              <div key={item.label} className="rounded-xl bg-[#fcfaf6] px-3 py-2">
                <p className="text-xs font-semibold text-slate-500">{item.label}</p>
                <p className="mt-0.5 text-sm text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* SEO snippet */}
      <div className="rounded-2xl border border-[#e8dfc8] bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">SEO Preview</p>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-[#1a6b44]">https://southernvt.com/places/{slug}</p>
          <p className="text-sm font-semibold text-[#1a0dab]">{seoTitle}</p>
          <p className="text-sm leading-6 text-slate-700">{seoDescription}</p>
        </div>
      </div>
    </div>
  );
}

"use client";

interface CoverStoryCardProps {
  storyTitle: string;
  theme: string;
  description?: string;
}

export function CoverStoryCard({ storyTitle, theme, description }: CoverStoryCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Lead Story</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">{storyTitle}</h2>
      <p className="mt-4 text-lg text-slate-700 leading-relaxed">{theme}</p>

      {description && (
        <p className="mt-4 text-sm text-slate-600 border-t border-[#ece3cf] pt-4 leading-relaxed">{description}</p>
      )}

      <div className="mt-6 flex gap-2">
        <button className="flex-1 rounded-lg bg-[#1f3b2f] text-white px-4 py-2 text-sm font-semibold hover:bg-[#2a4a3f]">
          Edit Story
        </button>
        <button className="flex-1 rounded-lg border border-[#e8dfc8] bg-white text-slate-800 px-4 py-2 text-sm font-semibold hover:bg-[#fcfaf6]">
          Preview
        </button>
      </div>
    </article>
  );
}

interface BasecampPreviewPanelProps {
  heroTitle: string;
  heroDescription: string;
  badges: string[];
  seoSnippet: string;
  relatedPlaceholder?: string;
}

export function BasecampPreviewPanel({ heroTitle, heroDescription, badges, seoSnippet, relatedPlaceholder = "Related content will appear here once relationships are added." }: BasecampPreviewPanelProps) {
  return (
    <section className="space-y-5 rounded-4xl border border-[#e8dfc8] bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="overflow-hidden rounded-[26px] border border-[#e8dfc8] bg-linear-to-br from-[#1f3b2f] via-[#345544] to-[#5e7a67] p-6 text-[#f8f2e4]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d8b15d]">Preview</p>
        <h3 className="mt-3 text-3xl font-semibold">{heroTitle}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">{heroDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span key={badge} className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[26px] border border-[#e8dfc8] bg-[#fcfaf6] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">SEO snippet</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">{seoSnippet}</p>
      </div>

      <div className="rounded-[26px] border border-dashed border-[#d7cbb3] bg-[#fff9eb] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Related content</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">{relatedPlaceholder}</p>
      </div>
    </section>
  );
}
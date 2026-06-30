import type { Story } from "@/types/Story";

type StoryQuoteProps = {
  story: Story;
};

export function StoryQuote({ story }: StoryQuoteProps) {
  return (
    <blockquote className="rounded-[30px] border border-[#e8dfc8] bg-white px-6 py-5 text-lg font-medium leading-8 text-slate-800 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
      "{story.featuredQuote}"
    </blockquote>
  );
}

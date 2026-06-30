import type { Story } from "@/types/Story";

type StoryHeroProps = {
  story: Story;
  eyebrow?: string;
};

export function StoryHero({ story, eyebrow = "SouthernVT Story" }: StoryHeroProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-forest-green)">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-900">{story.title}</h2>
      <p className="mt-2 text-base leading-8 text-slate-600">{story.subtitle}</p>
    </section>
  );
}

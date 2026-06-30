import type { Story } from "@/types/Story";

type PhotographyTipsProps = {
  story: Story;
};

export function PhotographyTips({ story }: PhotographyTipsProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6">
      <h3 className="text-2xl font-semibold text-slate-900">Photography Tips</h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
        {story.photographyTips.map((tip) => (
          <li key={tip} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#cc8d2d]" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

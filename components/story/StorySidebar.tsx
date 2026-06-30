import type { Story } from "@/types/Story";

type StorySidebarProps = {
  story: Story;
};

export function StorySidebar({ story }: StorySidebarProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-[#fcfaf6] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-forest-green)">Story details</p>
      <div className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
        <p><span className="font-semibold text-slate-900">Author:</span> {story.author}</p>
        <p><span className="font-semibold text-slate-900">Reading time:</span> {story.readingTime}</p>
        <p><span className="font-semibold text-slate-900">Difficulty:</span> {story.difficulty}</p>
        <p><span className="font-semibold text-slate-900">Season:</span> {story.season}</p>
        <p><span className="font-semibold text-slate-900">Updated:</span> {new Date(story.updatedAt).toLocaleDateString()}</p>
      </div>
    </section>
  );
}

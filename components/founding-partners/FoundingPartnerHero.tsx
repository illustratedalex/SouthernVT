import { Badge } from "@/components/ui";

type FoundingPartnerHeroProps = {
  title: string;
  headline: string;
  subheadline: string;
};

export function FoundingPartnerHero({ title, headline, subheadline }: FoundingPartnerHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[#e8dfc8] bg-white p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,180,99,0.14),transparent_34%),linear-gradient(135deg,rgba(252,250,246,0.98),rgba(255,255,255,0.96))]" />
      <div className="relative space-y-5">
        <Badge variant="featured">{title}</Badge>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{headline}</h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{subheadline}</p>
        </div>
      </div>
    </section>
  );
}
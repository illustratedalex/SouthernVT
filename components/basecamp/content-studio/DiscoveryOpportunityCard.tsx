import Link from "next/link";

type DiscoveryOpportunityCardProps = {
  title: string;
  count: number;
  description: string;
  href: string;
};

export function DiscoveryOpportunityCard({ title, count, description, href }: DiscoveryOpportunityCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Discovery Opportunity</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-[#1f3b2f]">{count}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      <Link href={href} className="mt-4 inline-flex rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white">
        Review
      </Link>
    </article>
  );
}

import { EditorialSection } from "@/components/ui";

const benefits = [
  { title: "Enhanced business profile", description: "A richer partner page with better context, visuals, and local trust signals." },
  { title: "Founding Partner badge", description: "A visible marker that shows early support without changing editorial standards." },
  { title: "Featured partner section", description: "A dedicated area for early supporters inside the partner experience." },
  { title: "Events and deals", description: "A practical place to surface timely offers, events, and seasonal announcements." },
  { title: "Partner insights", description: "Early reporting on engagement, interest, and content interactions." },
  { title: "Early access to new tools", description: "Get a first look at new partner utilities as SouthernVT grows." },
  { title: "Input into the platform", description: "Help shape the tools and workflows that matter to local businesses." },
];

export function FoundingPartnerBenefits() {
  return (
    <EditorialSection
      eyebrow="What partners receive"
      title="A practical early-support package"
      description="Founding Partners get useful visibility and a closer connection to the product as it develops."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {benefits.map((benefit) => (
          <article key={benefit.title} className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
            <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.description}</p>
          </article>
        ))}
      </div>
    </EditorialSection>
  );
}
import { EditorialSection, Prose } from "@/components/ui";

export function FoundingPartnerPromise() {
  return (
    <EditorialSection
      eyebrow="What partners do not buy"
      title="Editorial integrity stays in place"
      description="The founding offer supports growth, but it does not change how SouthernVT reports or recommends."
    >
      <Prose>
        <ul className="space-y-3">
          <li>Editorial recommendations are not for sale.</li>
          <li>Verification cannot be bought.</li>
          <li>Search ranking is not guaranteed.</li>
          <li><strong>SouthernVT Recommended</strong> is earned through trust, not payment.</li>
        </ul>
      </Prose>
    </EditorialSection>
  );
}
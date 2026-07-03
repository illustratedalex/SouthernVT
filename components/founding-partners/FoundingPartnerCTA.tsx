import { Button, EditorialSection } from "@/components/ui";
import Link from "next/link";

type FoundingPartnerCTAProps = {
  primaryHref?: string;
  secondaryHref?: string;
};

export function FoundingPartnerCTA({ primaryHref = "/contact", secondaryHref = "mailto:alex@southernvt.com?subject=SouthernVT%20Founding%20Partners" }: FoundingPartnerCTAProps) {
  return (
    <EditorialSection
      eyebrow="Next step"
      title="Talk with Alex about joining the first cohort"
      description="If the fit feels right, we can start with a simple conversation and a clear outline of what support looks like."
      className="bg-[#f9f4e8]"
    >
      <div className="flex flex-wrap gap-3">
        <Link href={primaryHref}>
          <Button variant="secondary">Become a Founding Partner</Button>
        </Link>
        <a href={secondaryHref}>
          <Button variant="ghost" className="border border-(--color-forest-green)/15 bg-white text-(--color-forest-green) motion-safe:hover:bg-[#f4efe1]">
            Contact Alex
          </Button>
        </a>
      </div>
    </EditorialSection>
  );
}
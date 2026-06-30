import { BasecampPageHeader, BasecampSection } from "@/components/basecamp";
import { FeatureFlagsSettings } from "@/components/basecamp/FeatureFlagsSettings";
import { getFeatureFlags } from "@/lib/featureFlags";

export default async function FeatureFlagsPage() {
  const flags = await getFeatureFlags();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <BasecampPageHeader
          eyebrow="Basecamp"
          title="Feature flags"
          description="Toggle preview and rollout behavior for public and Basecamp experiences."
          primaryAction={{ label: "Back to dashboard", href: "/basecamp" }}
        />

        <BasecampSection title="Flag settings" eyebrow="Configuration" description="These controls drive preview banners and feature availability across the studio.">
          <FeatureFlagsSettings initialFlags={flags} />
        </BasecampSection>
      </div>
    </div>
  );
}

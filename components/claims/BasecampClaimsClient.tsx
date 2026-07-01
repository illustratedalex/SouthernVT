"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BasecampEmptyState, BasecampPageHeader, BasecampSection, BasecampToolbar } from "@/components/basecamp";
import { addSessionActivityEvent } from "@/lib/basecamp/sessionEvents";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { getClaims, updateClaimStatus } from "@/lib/repositories/claimRepository";
import type { BusinessClaim } from "@/types/Claim";
import { ClaimDetailsDrawer } from "./ClaimDetailsDrawer";
import { ClaimTable } from "./ClaimTable";

export function BasecampClaimsClient() {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [selected, setSelected] = useState<BusinessClaim | null>(null);
  const [search, setSearch] = useState("");
  const [businessPortalEnabled, setBusinessPortalEnabled] = useState(true);

  useEffect(() => {
    async function load() {
      const [loadedClaims, enabled] = await Promise.all([getClaims(), isFeatureEnabled("businessPortal")]);
      setClaims(loadedClaims);
      setBusinessPortalEnabled(enabled);
    }

    void load();
  }, []);

  const refreshClaims = async () => {
    const loaded = await getClaims();
    setClaims(loaded);
  };

  const visibleClaims = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return claims;
    }

    return claims.filter((claim) => {
      const haystack = `${claim.businessName} ${claim.contactName} ${claim.placeName} ${claim.email}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [claims, search]);

  const transitionClaim = async (claim: BusinessClaim, status: "approved" | "rejected") => {
    const updated = await updateClaimStatus(claim.id, status);
    if (!updated) {
      return;
    }

    addSessionActivityEvent({
      type: "status_changed",
      contentType: "workflow",
      contentId: claim.placeId,
      title: `${claim.placeName} ownership request ${status}.`,
      description: `${claim.businessName} claim moved to ${status}.`,
      actor: "Basecamp Claims",
      metadata: {
        placeSlug: claim.placeSlug,
        status,
      },
    });

    await refreshClaims();

    if (selected?.id === claim.id) {
      setSelected(updated);
    }
  };

  return (
    <>
      <BasecampPageHeader
        eyebrow="Basecamp"
        title="Business Claims"
        description="Review and triage ownership requests for existing business listings."
        statusPill={businessPortalEnabled ? "Live" : "Preview"}
        primaryAction={{ label: "Feature flags", href: "/basecamp/settings/features" }}
      />

      {!businessPortalEnabled ? (
        <BasecampEmptyState
          title="Business claiming is hidden"
          description="Enable the businessPortal flag to show claim links publicly and activate this queue."
          ctaLabel="Open feature flags"
          ctaHref="/basecamp/settings/features"
        />
      ) : (
        <>
          <BasecampToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search claims"
            sortLabel="Newest"
            viewLabel="Table"
            bulkLabel="Queue"
          />

          <BasecampSection title="Claim queue" eyebrow="Business Portal" description="Pending, approved, and rejected ownership requests.">
            {visibleClaims.length === 0 ? (
              <p className="text-sm leading-7 text-slate-600">No claims found for the current filter.</p>
            ) : (
              <ClaimTable
                claims={visibleClaims}
                onApprove={(id) => {
                  const claim = claims.find((item) => item.id === id);
                  if (!claim) {
                    return;
                  }

                  void transitionClaim(claim, "approved");
                }}
                onReject={(id) => {
                  const claim = claims.find((item) => item.id === id);
                  if (!claim) {
                    return;
                  }

                  void transitionClaim(claim, "rejected");
                }}
                onView={setSelected}
              />
            )}
          </BasecampSection>

          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 text-sm leading-7 text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Workflow</p>
            <p className="mt-2">
              Pending {"->"} Approved {"->"} Business Portal Enabled (Mock)
            </p>
            <p className="mt-1 text-slate-500">
              Approval currently logs activity and simulates partner enablement.
            </p>
            <Link href="/basecamp/activity" className="mt-3 inline-flex font-semibold text-[#1f3b2f] underline underline-offset-4">
              View activity log
            </Link>
          </section>
        </>
      )}

      <ClaimDetailsDrawer claim={selected} onClose={() => setSelected(null)} />
    </>
  );
}

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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [loadedClaims, enabled] = await Promise.all([getClaims(), isFeatureEnabled("businessPortal")]);
        setClaims(loadedClaims);
        setBusinessPortalEnabled(enabled);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load claims.");
      }
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
      const haystack = `${claim.businessName} ${claim.claimantName} ${claim.businessSlug} ${claim.claimantEmail}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [claims, search]);

  const transitionClaim = async (claim: BusinessClaim, status: "approved" | "rejected", reviewNotes?: string) => {
    try {
      const updated = await updateClaimStatus(claim.id, { status, reviewNotes, reviewedBy: "basecamp_claims" });

      addSessionActivityEvent({
        type: "status_changed",
        contentType: "workflow",
        contentId: claim.businessListingId,
        title: `${claim.businessName} ownership request ${status}.`,
        description: `${claim.businessName} claim moved to ${status}.`,
        actor: "Basecamp Claims",
        metadata: {
          businessSlug: claim.businessSlug,
          status,
          reviewNotes: reviewNotes ?? "",
        },
      });

      await refreshClaims();

      if (selected?.id === claim.id) {
        setSelected(updated);
      }
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to review claim.");
    }
  };

  return (
    <>
      <BasecampPageHeader
        eyebrow="Basecamp"
        title="Business Claims"
        description="Review and triage ownership requests for existing business listings."
        statusPill={businessPortalEnabled ? "Internal queue (auth pending)" : "Preview"}
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
          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{errorMessage}</p>
          ) : null}

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
                onApprove={(id, reviewNotes) => {
                  const claim = claims.find((item) => item.id === id);
                  if (!claim) {
                    return;
                  }

                  void transitionClaim(claim, "approved", reviewNotes);
                }}
                onReject={(id, reviewNotes) => {
                  const claim = claims.find((item) => item.id === id);
                  if (!claim) {
                    return;
                  }

                  void transitionClaim(claim, "rejected", reviewNotes);
                }}
                onView={setSelected}
              />
            )}
          </BasecampSection>

          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 text-sm leading-7 text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Workflow</p>
            <p className="mt-2">
              Pending {"->"} Approved {"->"} Owner access enabled
            </p>
            <p className="mt-1 text-slate-500">
              Approval creates an owner mapping record. Rejection keeps the listing unclaimed.
            </p>
            <p className="mt-1 text-slate-500">
              Basecamp reviewer authentication is not fully implemented yet. This queue assumes trusted internal access.
            </p>
            <Link href="/basecamp/activity" className="mt-3 inline-flex font-semibold text-[#1f3b2f] underline underline-offset-4">
              View activity log
            </Link>
          </section>
        </>
      )}

      <ClaimDetailsDrawer
        key={selected?.id ?? "no-claim-selected"}
        claim={selected}
        onClose={() => setSelected(null)}
        onApprove={(id, reviewNotes) => {
          const claim = claims.find((item) => item.id === id);
          if (!claim) {
            return;
          }
          void transitionClaim(claim, "approved", reviewNotes);
        }}
        onReject={(id, reviewNotes) => {
          const claim = claims.find((item) => item.id === id);
          if (!claim) {
            return;
          }
          void transitionClaim(claim, "rejected", reviewNotes);
        }}
      />
    </>
  );
}

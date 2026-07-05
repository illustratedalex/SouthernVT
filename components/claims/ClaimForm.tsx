"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Input, useToasts } from "@/components/ui";
import { trackClaimStarted, trackClaimSubmitted } from "@/lib/analytics/events";
import { addSessionActivityEvent } from "@/lib/basecamp/sessionEvents";
import { submitClaim } from "@/lib/repositories/claimRepository";
import type { ClaimRelationship } from "@/types/Claim";

type ClaimFormProps = {
  listing: {
    id: string;
    slug: string;
    name: string;
    type: string;
    publicHref: string;
    publicLabel: string;
  };
};

type FormState = {
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  roleAtBusiness: ClaimRelationship;
  proofMessage: string;
};

const initialState: FormState = {
  claimantName: "",
  claimantEmail: "",
  claimantPhone: "",
  roleAtBusiness: "owner",
  proofMessage: "",
};

export function ClaimForm({ listing }: ClaimFormProps) {
  const { pushToast } = useToasts();
  const [state, setState] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    trackClaimStarted(listing.slug, listing.type);
  }, [listing.slug, listing.type]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!state.claimantName || !state.claimantEmail || !state.claimantPhone || !state.roleAtBusiness) {
      pushToast({ tone: "warning", title: "Required fields missing", description: "Complete all required fields." });
      return;
    }

    setSubmitting(true);

    try {
      await submitClaim({
        businessListingId: listing.id,
        businessSlug: listing.slug,
        businessName: listing.name,
        claimantName: state.claimantName,
        claimantEmail: state.claimantEmail,
        claimantPhone: state.claimantPhone,
        roleAtBusiness: state.roleAtBusiness,
        proofMessage: state.proofMessage,
      });

      addSessionActivityEvent({
        type: "created",
        contentType: "workflow",
        contentId: listing.id,
        title: `${listing.name} ownership request submitted.`,
        description: `${state.claimantName} submitted a business claim for ${listing.name}.`,
        actor: "Public Claim Form",
        metadata: {
          businessSlug: listing.slug,
          roleAtBusiness: state.roleAtBusiness,
          status: "pending",
        },
      });

      setSubmitted(true);
      trackClaimSubmitted(listing.slug, listing.type);
      pushToast({
        tone: "success",
        title: "Claim submitted",
        description: "Your claim request has been submitted. SouthernVT will review it before granting access.",
      });
    } catch (error) {
      pushToast({
        tone: "error",
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="rounded-[30px] border border-[#cde8d6] bg-[#ecf8f0] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f5a3d]">Request received</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Success</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Your claim request has been submitted. SouthernVT will review it before granting access.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={listing.publicHref} className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">
            Return to {listing.publicLabel}
          </Link>
          <Link href="/" className="inline-flex rounded-full border border-[#d7cbb3] px-5 py-3 text-sm font-semibold text-slate-700">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[30px] border border-[#e8dfc8] bg-white/90 p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Business Claim</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Claim this listing</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Claimant Name
          <Input value={state.claimantName} onChange={(event) => update("claimantName", event.target.value)} required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Email
          <Input type="email" value={state.claimantEmail} onChange={(event) => update("claimantEmail", event.target.value)} required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Phone
          <Input value={state.claimantPhone} onChange={(event) => update("claimantPhone", event.target.value)} required />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Role at business
        <select
          value={state.roleAtBusiness}
          onChange={(event) => update("roleAtBusiness", event.target.value as ClaimRelationship)}
          className="h-12 w-full rounded-2xl border border-(--color-pine)/25 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
        >
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="editor">Editor</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Proof message
        <textarea
          value={state.proofMessage}
          onChange={(event) => update("proofMessage", event.target.value)}
          className="min-h-32 w-full rounded-2xl border border-(--color-pine)/25 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
          placeholder="Share verification details or context for the review team."
        />
      </label>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

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
    publicHref: string;
    publicLabel: string;
  };
};

type FormState = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  relationship: ClaimRelationship;
  message: string;
  certified: boolean;
};

const initialState: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  relationship: "owner",
  message: "",
  certified: false,
};

export function ClaimForm({ listing }: ClaimFormProps) {
  const { pushToast } = useToasts();
  const [state, setState] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    trackClaimStarted(
      { listing_id: listing.id, listing_slug: listing.slug, listing_name: listing.name },
      `claim:${listing.id}`,
    );
  }, [listing.id, listing.name, listing.slug]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!state.businessName || !state.contactName || !state.email || !state.phone || !state.certified) {
      pushToast({ tone: "warning", title: "Required fields missing", description: "Complete all required fields and certification." });
      return;
    }

    setSubmitting(true);

    try {
      await submitClaim({
        placeId: listing.id,
        placeSlug: listing.slug,
        placeName: listing.name,
        businessName: state.businessName,
        contactName: state.contactName,
        email: state.email,
        phone: state.phone,
        relationship: state.relationship,
        message: state.message,
        certified: state.certified,
      });

      addSessionActivityEvent({
        type: "created",
        contentType: "workflow",
        contentId: listing.id,
        title: `${listing.name} ownership request submitted.`,
        description: `${state.contactName} submitted a business claim for ${listing.name}.`,
        actor: "Public Claim Form",
        metadata: {
          placeSlug: listing.slug,
          relationship: state.relationship,
          status: "pending",
        },
      });

      setSubmitted(true);
      trackClaimSubmitted({
        listing_id: listing.id,
        listing_slug: listing.slug,
        listing_name: listing.name,
        relationship: state.relationship,
      });
      pushToast({ tone: "success", title: "Claim submitted", description: "Your request is pending review." });
    } catch {
      pushToast({ tone: "error", title: "Submission failed", description: "Please try again." });
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
          Your ownership request for {listing.name} has been submitted. We will review it in Basecamp.
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
          Business Name
          <Input value={state.businessName} onChange={(event) => update("businessName", event.target.value)} required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Contact Name
          <Input value={state.contactName} onChange={(event) => update("contactName", event.target.value)} required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Email
          <Input type="email" value={state.email} onChange={(event) => update("email", event.target.value)} required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Phone
          <Input value={state.phone} onChange={(event) => update("phone", event.target.value)} required />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Relationship
        <select
          value={state.relationship}
          onChange={(event) => update("relationship", event.target.value as ClaimRelationship)}
          className="h-12 w-full rounded-2xl border border-(--color-pine)/25 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
        >
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="marketing">Marketing</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Message
        <textarea
          value={state.message}
          onChange={(event) => update("message", event.target.value)}
          className="min-h-32 w-full rounded-2xl border border-(--color-pine)/25 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
          placeholder="Share verification details or context for the review team."
        />
      </label>

      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input type="checkbox" checked={state.certified} onChange={(event) => update("certified", event.target.checked)} className="h-4 w-4" required />
        I certify I represent this business.
      </label>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

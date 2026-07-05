"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Input, useToasts } from "@/components/ui";
import { trackClaimStarted, trackClaimSubmitted } from "@/lib/analytics/events";
import { addSessionActivityEvent } from "@/lib/basecamp/sessionEvents";
import { submitClaim } from "@/lib/repositories/claimRepository";

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
  businessName: string;
  listingUrl: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  website: string;
  requestedUpdates: string;
  verificationNotes: string;
  honeypot: string;
};

export function ClaimForm({ listing }: ClaimFormProps) {
  const { pushToast } = useToasts();
  const [state, setState] = useState<FormState>({
    businessName: listing.name,
    listingUrl: listing.publicHref,
    contactName: "",
    role: "owner",
    email: "",
    phone: "",
    website: "",
    requestedUpdates: "",
    verificationNotes: "",
    honeypot: "",
  });
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

    if (!state.businessName || !state.listingUrl || !state.contactName || !state.role || !state.email) {
      pushToast({ tone: "warning", title: "Required fields missing", description: "Complete all required fields." });
      return;
    }

    setSubmitting(true);

    try {
      await submitClaim({
        businessListingId: listing.id,
        businessSlug: listing.slug,
        businessName: state.businessName,
        listingUrl: state.listingUrl,
        contactName: state.contactName,
        role: state.role,
        email: state.email,
        phone: state.phone,
        website: state.website,
        requestedUpdates: state.requestedUpdates,
        verificationNotes: state.verificationNotes,
        honeypot: state.honeypot,
      });

      addSessionActivityEvent({
        type: "created",
        contentType: "workflow",
        contentId: listing.id,
        title: `${listing.name} ownership request submitted.`,
        description: `${state.contactName} submitted a business claim for ${listing.name}.`,
        actor: "Public Claim Form",
        metadata: {
          businessSlug: listing.slug,
          roleAtBusiness: state.role,
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
        <p className="mt-2 text-sm text-slate-600">Claiming is currently free. Every request is reviewed manually before access is granted.</p>
      </div>

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="organization"
        value={state.honeypot}
        onChange={(event) => update("honeypot", event.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Business Name
          <Input value={state.businessName} onChange={(event) => update("businessName", event.target.value)} required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Listing URL
          <Input value={state.listingUrl} onChange={(event) => update("listingUrl", event.target.value)} required />
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
          <Input value={state.phone} onChange={(event) => update("phone", event.target.value)} />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Website
          <Input value={state.website} onChange={(event) => update("website", event.target.value)} />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Role
        <Input value={state.role} onChange={(event) => update("role", event.target.value)} required />
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Requested Updates
        <textarea
          value={state.requestedUpdates}
          onChange={(event) => update("requestedUpdates", event.target.value)}
          className="min-h-32 w-full rounded-2xl border border-(--color-pine)/25 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
          placeholder="Share any listing details that need to be corrected or expanded."
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Verification Notes
        <textarea
          value={state.verificationNotes}
          onChange={(event) => update("verificationNotes", event.target.value)}
          className="min-h-28 w-full rounded-2xl border border-(--color-pine)/25 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
          placeholder="Provide proof or context to help SouthernVT verify ownership."
        />
      </label>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

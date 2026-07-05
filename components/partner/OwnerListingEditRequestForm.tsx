"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import type { BusinessListing } from "@/types/BusinessListing";

interface OwnerListingEditRequestFormProps {
  listing: BusinessListing;
}

export function OwnerListingEditRequestForm({ listing }: OwnerListingEditRequestFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    description: listing.description,
    website: listing.website,
    phone: listing.phone,
    photosPlaceholder: "",
    eventsPlaceholder: "",
    dealsPlaceholder: "",
    ownerMessage: "",
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/partner-portal/edit-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessListingId: listing.id,
        ...form,
      }),
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error ?? "Unable to submit edit request.");
      setSubmitting(false);
      return;
    }

    setMessage("Edit request submitted for review.");
    setSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Submit listing edit request</p>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Description
        <textarea
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          className="min-h-20 w-full rounded-xl border border-[#d7cbb3] px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm font-medium text-slate-700">
          Website
          <input
            value={form.website}
            onChange={(event) => update("website", event.target.value)}
            className="h-10 w-full rounded-xl border border-[#d7cbb3] px-3 text-sm"
          />
        </label>
        <label className="block space-y-1 text-sm font-medium text-slate-700">
          Phone
          <input
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className="h-10 w-full rounded-xl border border-[#d7cbb3] px-3 text-sm"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Photos placeholder
        <textarea
          value={form.photosPlaceholder}
          onChange={(event) => update("photosPlaceholder", event.target.value)}
          className="min-h-16 w-full rounded-xl border border-[#d7cbb3] px-3 py-2 text-sm"
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Events placeholder
        <textarea
          value={form.eventsPlaceholder}
          onChange={(event) => update("eventsPlaceholder", event.target.value)}
          className="min-h-16 w-full rounded-xl border border-[#d7cbb3] px-3 py-2 text-sm"
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Deals placeholder
        <textarea
          value={form.dealsPlaceholder}
          onChange={(event) => update("dealsPlaceholder", event.target.value)}
          className="min-h-16 w-full rounded-xl border border-[#d7cbb3] px-3 py-2 text-sm"
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Owner message
        <textarea
          value={form.ownerMessage}
          onChange={(event) => update("ownerMessage", event.target.value)}
          className="min-h-16 w-full rounded-xl border border-[#d7cbb3] px-3 py-2 text-sm"
        />
      </label>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit edit request"}
      </Button>

      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </form>
  );
}

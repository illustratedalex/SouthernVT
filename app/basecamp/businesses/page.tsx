"use client";

import Link from "next/link";
import { useState } from "react";
import { Sidebar } from "@/components/admin";
import { BasecampPageHeader } from "@/components/basecamp";
import { Badge, Button } from "@/components/ui";
import {
  getBusinessListingClaimLabel,
  getBusinessListings,
  getBusinessListingStatusLabel,
  getBusinessListingStatusTone,
} from "@/lib/businessListings";
import type { BusinessListing } from "@/types/BusinessListing";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Newsroom", href: "/basecamp/content" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Businesses", href: "/basecamp/businesses", active: true },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Photo Desk", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function updateListing(listings: BusinessListing[], id: string, updater: (listing: BusinessListing) => BusinessListing) {
  return listings.map((listing) => (listing.id === id ? updater(listing) : listing));
}

export default function BasecampBusinessesPage() {
  const [listings, setListings] = useState<BusinessListing[]>(() => getBusinessListings().map((listing) => ({ ...listing })));

  const markReviewed = (id: string) => {
    const now = new Date().toISOString();
    setListings((current) => updateListing(current, id, (listing) => ({ ...listing, lastReviewedAt: now, updatedAt: now })));
  };

  const markVerified = (id: string) => {
    const now = new Date().toISOString();
    setListings((current) => updateListing(current, id, (listing) => ({
      ...listing,
      isVerified: true,
      status: listing.isFoundingPartner ? "founding_partner" : "verified",
      claimStatus: listing.claimStatus === "unclaimed" ? "pending" : listing.claimStatus,
      lastReviewedAt: now,
      updatedAt: now,
    })));
  };

  const markFoundingPartner = (id: string) => {
    const now = new Date().toISOString();
    setListings((current) => updateListing(current, id, (listing) => ({
      ...listing,
      isFoundingPartner: true,
      isVerified: true,
      status: "founding_partner",
      claimStatus: listing.claimStatus === "unclaimed" ? "pending" : listing.claimStatus,
      lastReviewedAt: now,
      updatedAt: now,
    })));
  };

  const editPlaceholder = (id: string) => {
    const now = new Date().toISOString();
    setListings((current) => updateListing(current, id, (listing) => ({ ...listing, updatedAt: now })));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Business directory management"
            description="Manage claimable basic business listings for the public directory. Actions are mock-only in this preview."
            statusPill="Mock workflow"
            primaryAction={{ label: "Open public directory", href: "/businesses" }}
          />

          <section className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-5 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#ece3cf] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-3 py-3">Business</th>
                    <th className="px-3 py-3">Town</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Claim Status</th>
                    <th className="px-3 py-3">Completeness</th>
                    <th className="px-3 py-3">Last Reviewed</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1e7d4]">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="align-top">
                      <td className="px-3 py-4">
                        <p className="font-semibold text-slate-900">{listing.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{listing.address}</p>
                      </td>
                      <td className="px-3 py-4 text-slate-700">{listing.town}</td>
                      <td className="px-3 py-4 text-slate-700">{listing.category}</td>
                      <td className="px-3 py-4">
                        <Badge variant={getBusinessListingStatusTone(listing.status)}>{getBusinessListingStatusLabel(listing.status)}</Badge>
                      </td>
                      <td className="px-3 py-4">
                        <Badge variant="subtle">{getBusinessListingClaimLabel(listing.claimStatus)}</Badge>
                      </td>
                      <td className="px-3 py-4 text-slate-700">{listing.completenessScore}%</td>
                      <td className="px-3 py-4 text-slate-700">{formatDate(listing.lastReviewedAt)}</td>
                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/businesses/${listing.slug}`}
                            className="inline-flex rounded-full border border-[#d7cbb3] px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#fcfaf6]"
                          >
                            View Public
                          </Link>
                          <Button type="button" variant="ghost" onClick={() => editPlaceholder(listing.id)}>Edit Placeholder</Button>
                          <Button type="button" variant="ghost" onClick={() => markReviewed(listing.id)}>Mark Reviewed</Button>
                          <Button type="button" variant="ghost" onClick={() => markVerified(listing.id)}>Mark Verified</Button>
                          <Button type="button" variant="ghost" onClick={() => markFoundingPartner(listing.id)}>Mark Founding Partner</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
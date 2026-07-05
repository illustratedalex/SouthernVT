"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Sidebar } from "@/components/admin";
import { southernVT100Destinations } from "@/data/southernvt100";
import type { SouthernVT100Destination } from "@/types/SouthernVT100";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Newsroom", href: "/basecamp/content" },
  { label: "Editorial Issue", href: "/basecamp/editorial-issue" },
  { label: "SouthernVT 100", href: "/basecamp/southernvt-100", active: true },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Photo Desk", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
];

type FilterValue = "All" | string;
type QuickAction = "assign" | "verify" | "publish" | "move_issue";

function isVerified(destination: SouthernVT100Destination) {
  const { location, photo, visited, recommended } = destination.verification;
  return location && photo && visited && recommended;
}

function cloneDestination(destination: SouthernVT100Destination): SouthernVT100Destination {
  return {
    ...destination,
    verification: { ...destination.verification },
  };
}

export default function SouthernVT100Page() {
  const [destinations, setDestinations] = useState(() => southernVT100Destinations.map(cloneDestination));
  const [selectedId, setSelectedId] = useState(destinations[0]?.id ?? null);
  const [regionFilter, setRegionFilter] = useState<FilterValue>("All");
  const [categoryFilter, setCategoryFilter] = useState<FilterValue>("All");
  const [seasonFilter, setSeasonFilter] = useState<FilterValue>("All");
  const [issueFilter, setIssueFilter] = useState<FilterValue>("All");
  const [verificationFilter, setVerificationFilter] = useState<FilterValue>("All");
  const [coverageFilter, setCoverageFilter] = useState<FilterValue>("All");

  const selectedDestination = useMemo(
    () => destinations.find((destination) => destination.id === selectedId) ?? null,
    [destinations, selectedId],
  );

  const regions = useMemo(
    () => [...new Set(destinations.map((destination) => destination.region))].sort(),
    [destinations],
  );
  const categories = useMemo(
    () => [...new Set(destinations.map((destination) => destination.category))].sort(),
    [destinations],
  );
  const seasons = useMemo(
    () => [...new Set(destinations.map((destination) => destination.season))].sort(),
    [destinations],
  );
  const coverages = useMemo(
    () => [...new Set(destinations.map((destination) => destination.coverage))].sort(),
    [destinations],
  );

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      if (regionFilter !== "All" && destination.region !== regionFilter) return false;
      if (categoryFilter !== "All" && destination.category !== categoryFilter) return false;
      if (seasonFilter !== "All" && destination.season !== seasonFilter) return false;
      if (issueFilter !== "All" && destination.issueAssignment !== issueFilter) return false;
      if (coverageFilter !== "All" && destination.coverage !== coverageFilter) return false;
      if (verificationFilter === "Verified" && !isVerified(destination)) return false;
      if (verificationFilter === "Needs Verification" && isVerified(destination)) return false;
      return true;
    });
  }, [destinations, regionFilter, categoryFilter, seasonFilter, issueFilter, verificationFilter, coverageFilter]);

  const stats = useMemo(() => {
    const published = destinations.filter((destination) => destination.editorialStatus === "Published").length;
    const research = destinations.filter((destination) => destination.editorialStatus === "Research").length;
    const photography = destinations.filter((destination) => destination.verification.photo).length;
    const verification = destinations.filter((destination) => isVerified(destination)).length;
    return { total: destinations.length, published, research, photography, verification };
  }, [destinations]);

  function applyQuickAction(action: QuickAction) {
    if (!selectedId) return;

    setDestinations((current) =>
      current.map((destination) => {
        if (destination.id !== selectedId) {
          return destination;
        }

        if (action === "assign") {
          return { ...destination, editorialStatus: "Assigned", priority: "High" };
        }

        if (action === "verify") {
          return {
            ...destination,
            verification: {
              location: true,
              photo: true,
              visited: true,
              recommended: true,
            },
          };
        }

        if (action === "publish") {
          return {
            ...destination,
            editorialStatus: "Published",
            issueAssignment: "Current Issue",
            contentHealth: Math.max(destination.contentHealth, 88),
            coverageScore: Math.max(destination.coverageScore, 88),
            relationshipScore: Math.max(destination.relationshipScore, 84),
            photographyScore: Math.max(destination.photographyScore, 84),
          };
        }

        const nextIssue =
          destination.issueAssignment === "None"
            ? "Future Issue"
            : destination.issueAssignment === "Future Issue"
              ? "Current Issue"
              : "None";

        return { ...destination, issueAssignment: nextIssue };
      }),
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <section className="rounded-4xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Editor-in-Chief Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">The SouthernVT 100</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              Master planning catalog for the 100 destinations that define Southern Vermont. This is an internal editorial planning workspace.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Overall Progress</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.published} / {stats.total}</p>
            </article>
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Published</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.published}</p>
            </article>
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Research</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.research}</p>
            </article>
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Photography</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.photography}</p>
            </article>
            <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Verification</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.verification}</p>
            </article>
          </section>

          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Filters</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Region</span>
                <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  {regions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Category</span>
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  {categories.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Season</span>
                <select value={seasonFilter} onChange={(event) => setSeasonFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  {seasons.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Issue</span>
                <select value={issueFilter} onChange={(event) => setIssueFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  <option value="Current Issue">Current Issue</option>
                  <option value="Future Issue">Future Issue</option>
                  <option value="None">None</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Verification</span>
                <select value={verificationFilter} onChange={(event) => setVerificationFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  <option value="Verified">Verified</option>
                  <option value="Needs Verification">Needs Verification</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Coverage</span>
                <select value={coverageFilter} onChange={(event) => setCoverageFilter(event.target.value)} className="w-full rounded-xl border border-[#d7cbb3] bg-white px-3 py-2">
                  <option value="All">All</option>
                  {coverages.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Quick Actions</p>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedDestination
                    ? `Selected: ${selectedDestination.name}`
                    : "Select a destination row to apply quick editorial actions."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyQuickAction("assign")}
                  disabled={!selectedDestination}
                  className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Assign
                </button>
                <Link
                  href={selectedDestination ? `/places/${selectedDestination.slug}` : "#"}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    selectedDestination ? "border-[#d7cbb3] bg-white text-slate-800" : "pointer-events-none border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  Open
                </Link>
                <button
                  type="button"
                  onClick={() => applyQuickAction("verify")}
                  disabled={!selectedDestination}
                  className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickAction("publish")}
                  disabled={!selectedDestination}
                  className="rounded-full bg-[#1f5a3d] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Publish
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickAction("move_issue")}
                  disabled={!selectedDestination}
                  className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Move Issue
                </button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#ece3cf] text-sm">
                <thead className="bg-[#fcfaf6]">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Destination</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Category</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Coverage</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Priority</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Editorial Status</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Issue</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Season</th>
                    <th className="px-3 py-3 text-left font-semibold text-slate-600">Scores</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2ebda]">
                  {filteredDestinations.map((destination) => (
                    <tr
                      key={destination.id}
                      onClick={() => setSelectedId(destination.id)}
                      className={`cursor-pointer align-top ${selectedId === destination.id ? "bg-[#f3f8f4]" : "bg-white hover:bg-[#fdf8ef]"}`}
                    >
                      <td className="px-3 py-3">
                        <p className="font-semibold text-slate-900">{destination.name}</p>
                        <p className="text-xs text-slate-500">
                          {destination.town} · {destination.region}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Verification:{" "}
                          {isVerified(destination) ? "Complete" : "Needs work"}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-slate-700">{destination.category}</td>
                      <td className="px-3 py-3 text-slate-700">{destination.coverage}</td>
                      <td className="px-3 py-3 text-slate-700">{destination.priority}</td>
                      <td className="px-3 py-3 text-slate-700">{destination.editorialStatus}</td>
                      <td className="px-3 py-3 text-slate-700">{destination.issueAssignment}</td>
                      <td className="px-3 py-3 text-slate-700">{destination.season}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">
                        <p>Coverage: {destination.coverageScore}</p>
                        <p>Relationship: {destination.relationshipScore}</p>
                        <p>Photography: {destination.photographyScore}</p>
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

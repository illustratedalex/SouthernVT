"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const categories = ["Bug", "Suggestion", "Missing Place", "Business Request"] as const;

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Feedback</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Help Improve SouthernVT</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Feedback submissions are reviewed manually during beta. We use this queue to improve listings, coverage, and planning tools.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-2xl border border-[#cde8d6] bg-[#ecf8f0] p-4 text-sm text-[#1f5a3d]">
              Thanks for sharing feedback. We&apos;ve captured your submission for the beta queue.
            </div>
          ) : null}

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Name</span>
              <input required className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 outline-none" />
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Email (optional)</span>
              <input type="email" className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 outline-none" />
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Category</span>
              <select required className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 outline-none">
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Message</span>
              <textarea required rows={6} className="w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 outline-none" />
            </label>

            <button type="submit" className="rounded-full bg-[#1f3b2f] px-6 py-3 text-sm font-semibold text-[#f8f2e4]">
              Submit Feedback
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}

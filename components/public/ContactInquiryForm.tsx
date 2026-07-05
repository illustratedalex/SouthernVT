"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const inquiryReasons = [
  "General Question",
  "Suggest a Place",
  "Correct a Listing",
  "Claim a Business",
  "Founding Partner Inquiry",
  "Press / Media",
  "Other",
] as const;

type InquiryReason = (typeof inquiryReasons)[number];

const helloReasons: InquiryReason[] = ["General Question", "Suggest a Place", "Correct a Listing", "Other"];
const partnerReasons: InquiryReason[] = ["Founding Partner Inquiry", "Claim a Business"];

function destinationForReason(reason: InquiryReason | "") {
  if (partnerReasons.includes(reason as InquiryReason)) {
    return "partners@southernvt.com";
  }

  if (reason === "Press / Media") {
    return "press@southernvt.com";
  }

  if (helloReasons.includes(reason as InquiryReason)) {
    return "hello@southernvt.com";
  }

  return "hello@southernvt.com";
}

const inputClass = "h-11 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 outline-none focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20 transition";
const textareaClass = "w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 outline-none focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20 transition";

export default function ContactInquiryForm() {
  const searchParams = useSearchParams();
  const requestedReason = searchParams.get("reason");
  const initialReason = inquiryReasons.find((reason) => reason === requestedReason) ?? "General Question";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<InquiryReason>(initialReason);
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const destinationEmail = useMemo(() => destinationForReason(reason), [reason]);
  const remaining = 5000 - message.length;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, reason, message, company }),
      });

      const data = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !data.success) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("We couldn't send your message right now. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Contact Form</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        Use the form below or email us directly. We read every message.
      </p>

      {submitted ? (
        <div className="mt-6 rounded-2xl border border-[#cde8d6] bg-[#ecf8f0] p-5 text-sm leading-7 text-[#1f5a3d]">
          <p className="font-semibold">Message sent.</p>
          <p className="mt-1">Thank you for contacting SouthernVT. We&apos;ll be in touch soon.</p>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={(event) => { void handleSubmit(event); }}>
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="organization"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="hidden"
            aria-hidden="true"
          />

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-slate-700">Name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-slate-700">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-slate-700">Reason</span>
            <select
              required
              value={reason}
              onChange={(event) => {
                setReason(event.target.value as InquiryReason);
              }}
              className={inputClass}
            >
              {inquiryReasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 text-sm text-slate-700">
            <p className="font-medium text-slate-800">This message will be sent to:</p>
            <p className="mt-1 font-semibold text-[#1f3b2f]">{destinationEmail}</p>
          </div>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-slate-700">
              Message{" "}
              <span className={`font-normal ${remaining < 200 ? "text-amber-600" : "text-slate-400"}`}>
                ({remaining.toLocaleString()} characters remaining)
              </span>
            </span>
            <textarea
              required
              rows={6}
              maxLength={5000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={textareaClass}
            />
          </label>

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[#1f3b2f] px-6 py-3 text-sm font-semibold text-[#f8f2e4] transition hover:bg-[#162e23] disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </section>
  );
}


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

  return "hello@southernvt.com";
}

export default function ContactInquiryForm() {
  const searchParams = useSearchParams();
  const requestedReason = searchParams.get("reason");
  const initialReason = inquiryReasons.find((reason) => reason === requestedReason) ?? "General Question";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<InquiryReason>(initialReason);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const destinationEmail = useMemo(() => destinationForReason(reason), [reason]);

  return (
    <section id="contact-form" className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Contact Form</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">Mock submit only for now. No emails are sent yet.</p>

      {submitted ? (
        <div className="mt-6 rounded-2xl border border-[#cde8d6] bg-[#ecf8f0] p-4 text-sm text-[#1f5a3d]">
          Thank you for contacting SouthernVT. We&apos;ll be in touch soon.
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
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 outline-none"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 outline-none"
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
            className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 outline-none"
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
          <span className="mb-1.5 block font-medium text-slate-700">Message</span>
          <textarea
            required
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full rounded-2xl border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-3 outline-none"
          />
        </label>

        <button type="submit" className="rounded-full bg-[#1f3b2f] px-6 py-3 text-sm font-semibold text-[#f8f2e4]">
          Send Message
        </button>
      </form>
    </section>
  );
}

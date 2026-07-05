"use client";

import { useState } from "react";

interface SquareCheckoutButtonProps {
  businessSlug: string;
  planId: string;
  billingCadence: "monthly" | "yearly";
  label?: string;
}

export function SquareCheckoutButton({
  businessSlug,
  planId,
  billingCadence,
  label = "Continue with Square",
}: SquareCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/create-square-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessSlug, planId, billingCadence }),
      });

      const data = (await response.json()) as { success: boolean; checkoutUrl?: string; error?: string };

      if (!data.success || !data.checkoutUrl) {
        setError(data.error ?? "Could not create checkout session. Please try again or contact partners@southernvt.com.");
        setLoading(false);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError("Network error. Please try again or contact partners@southernvt.com.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-[#1f3b2f] px-5 py-2.5 text-sm font-semibold text-[#f8f2e4] hover:bg-[#2d5242] disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? (
          <>
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#f8f2e4] border-t-transparent" />
            Redirecting to checkout…
          </>
        ) : (
          label
        )}
      </button>
      {error && (
        <p className="text-xs text-red-700">{error}</p>
      )}
    </div>
  );
}

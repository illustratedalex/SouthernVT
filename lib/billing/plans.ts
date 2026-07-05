export type BillingPlanId =
  | "basic_free"
  | "enhanced_monthly"
  | "enhanced_yearly"
  | "founding_partner_monthly"
  | "founding_partner_yearly"
  | "future_premium";

export type BillingPlanKind = "basic" | "enhanced" | "founding_partner" | "future_premium";

export type BillingProvider = "square" | "manual" | "comped";

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  kind: BillingPlanKind;
  interval: "free" | "monthly" | "yearly";
  price: number;
  active: boolean;
  purchasable: boolean;
  description: string;
  trustNote: string;
  /** Square subscription plan ID (from Square Developer Dashboard catalog) */
  squareCatalogPlanIdMonthly?: string;
  squareCatalogPlanVariationIdMonthly?: string;
  squareCatalogPlanIdYearly?: string;
  squareCatalogPlanVariationIdYearly?: string;
};

export type SquareBillingStatus = {
  configured: boolean;
  missing: string[];
  environment: "sandbox" | "production";
};

/** @deprecated Use SquareBillingStatus — Stripe has been replaced by Square */
export type StripeBillingStatus = {
  configured: boolean;
  missing: string[];
};

export const billingPlans: BillingPlan[] = [
  {
    id: "basic_free",
    name: "Free Basic Listing",
    kind: "basic",
    interval: "free",
    price: 0,
    active: true,
    purchasable: false,
    description: "A no-cost listing with the core SouthernVT directory presence.",
    trustNote: "This plan does not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.",
  },
  {
    id: "enhanced_monthly",
    name: "Enhanced Listing",
    kind: "enhanced",
    interval: "monthly",
    price: 25,
    active: true,
    purchasable: true,
    description: "Enhanced visibility for businesses that want a stronger directory presence.",
    trustNote: "Paid business listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.",
    // Set these in lib/billing/plans.ts once Square catalog items are created in the Dashboard.
    squareCatalogPlanIdMonthly: process.env.SQUARE_PLAN_ID_ENHANCED ?? "",
    squareCatalogPlanVariationIdMonthly: process.env.SQUARE_PLAN_VARIATION_ID_ENHANCED_MONTHLY ?? "",
  },
  {
    id: "enhanced_yearly",
    name: "Enhanced Listing",
    kind: "enhanced",
    interval: "yearly",
    price: 250,
    active: true,
    purchasable: true,
    description: "Save with annual billing for the same Enhanced Listing benefits.",
    trustNote: "Paid business listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.",
    squareCatalogPlanIdYearly: process.env.SQUARE_PLAN_ID_ENHANCED ?? "",
    squareCatalogPlanVariationIdYearly: process.env.SQUARE_PLAN_VARIATION_ID_ENHANCED_YEARLY ?? "",
  },
  {
    id: "founding_partner_monthly",
    name: "Founding Partner",
    kind: "founding_partner",
    interval: "monthly",
    price: 50,
    active: true,
    purchasable: true,
    description: "Early-supporter recognition during beta with a closer relationship to SouthernVT.",
    trustNote: "Founding Partner support does not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.",
    squareCatalogPlanIdMonthly: process.env.SQUARE_PLAN_ID_FOUNDING_PARTNER ?? "",
    squareCatalogPlanVariationIdMonthly: process.env.SQUARE_PLAN_VARIATION_ID_FOUNDING_PARTNER_MONTHLY ?? "",
  },
  {
    id: "founding_partner_yearly",
    name: "Founding Partner",
    kind: "founding_partner",
    interval: "yearly",
    price: 500,
    active: true,
    purchasable: true,
    description: "Annual Founding Partner support for early supporters.",
    trustNote: "Founding Partner support does not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.",
    squareCatalogPlanIdYearly: process.env.SQUARE_PLAN_ID_FOUNDING_PARTNER ?? "",
    squareCatalogPlanVariationIdYearly: process.env.SQUARE_PLAN_VARIATION_ID_FOUNDING_PARTNER_YEARLY ?? "",
  },
  {
    id: "future_premium",
    name: "Future Premium",
    kind: "future_premium",
    interval: "monthly",
    price: 0,
    active: false,
    purchasable: false,
    description: "Reserved for a future premium tier. Disabled for beta launch.",
    trustNote: "Future premium features are disabled during beta and do not affect editorial decisions.",
  },
];

export function getBillingPlan(planId: string) {
  return billingPlans.find((plan) => plan.id === planId) ?? null;
}

export function getBillablePlans() {
  return billingPlans.filter((plan) => plan.purchasable && plan.active);
}

export function getCurrentBillingPlanLabel(isFoundingPartner: boolean, status: string) {
  if (isFoundingPartner) {
    return "Founding Partner";
  }

  if (status === "premium") {
    return "Future Premium (disabled)";
  }

  return "Free Basic Listing";
}

export function getSquareBillingStatus(): SquareBillingStatus {
  const missing: string[] = [];

  if (!process.env.SQUARE_ACCESS_TOKEN?.trim()) {
    missing.push("SQUARE_ACCESS_TOKEN");
  }
  if (!process.env.SQUARE_LOCATION_ID?.trim()) {
    missing.push("SQUARE_LOCATION_ID");
  }

  const rawEnv = (process.env.SQUARE_ENVIRONMENT ?? "sandbox").toLowerCase();
  const environment = rawEnv === "production" ? "production" : "sandbox";

  return {
    configured: missing.length === 0,
    missing,
    environment,
  };
}

export function hasSquareBillingEnv(): boolean {
  return getSquareBillingStatus().configured;
}

/**
 * @deprecated Square is now the primary billing provider.
 * Kept for backward compatibility — returns configured: false always.
 */
export function getStripeBillingStatus(): StripeBillingStatus {
  return { configured: false, missing: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"] };
}

/** @deprecated Use hasSquareBillingEnv */
export function hasStripeBillingEnv(): boolean {
  return false;
}

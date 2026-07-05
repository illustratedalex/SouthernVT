export type BillingPlanId =
  | "basic_free"
  | "enhanced_monthly"
  | "enhanced_yearly"
  | "founding_partner_monthly"
  | "founding_partner_yearly"
  | "future_premium";

export type BillingPlanKind = "basic" | "enhanced" | "founding_partner" | "future_premium";

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
};

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
    trustNote: "Paid listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.",
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
    trustNote: "Paid listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.",
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

export function getStripeBillingStatus(): StripeBillingStatus {
  const missing: string[] = [];

  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    missing.push("STRIPE_SECRET_KEY");
  }
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()) {
    missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET?.trim()) {
    missing.push("STRIPE_WEBHOOK_SECRET");
  }

  return {
    configured: missing.length === 0,
    missing,
  };
}

export function hasStripeBillingEnv() {
  return getStripeBillingStatus().configured;
}

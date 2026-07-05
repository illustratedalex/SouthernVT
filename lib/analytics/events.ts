"use client";

type GAValue = string | number | boolean;
type EventParams = Record<string, GAValue | null | undefined>;
type GtagFn = (command: "event", eventName: string, params?: Record<string, GAValue>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

const trackedOnce = new Set<string>();

function sanitizeEventParams(params?: EventParams): Record<string, GAValue> | undefined {
  if (!params) return undefined;

  const entries = Object.entries(params).filter(([, value]) => {
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return typeof value === "number" || typeof value === "boolean";
  });

  if (!entries.length) return undefined;
  return Object.fromEntries(entries) as Record<string, GAValue>;
}

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === "undefined") return;

  const gtag = window.gtag;
  if (typeof gtag !== "function") return;

  try {
    gtag("event", eventName, sanitizeEventParams(params));
  } catch {
    // Analytics should never break user flows.
  }
}

export function trackEventOnce(eventName: string, params?: EventParams, onceKey?: string) {
  if (onceKey) {
    if (trackedOnce.has(onceKey)) return;
    trackedOnce.add(onceKey);
  }

  trackEvent(eventName, params);
}

export function trackConciergeStarted() {
  trackEvent("concierge_start");
}

export function trackConciergeCompleted() {
  trackEvent("concierge_complete");
}

export function trackAIConcierge() {
  trackEvent("ai_concierge");
}

export function trackPlaceViewed(placeSlug: string, placeName: string) {
  trackEvent("place_view", { place_slug: placeSlug, place_name: placeName });
}

export function trackBusinessViewed(businessSlug: string, businessName: string) {
  trackEvent("business_view", { business_slug: businessSlug, business_name: businessName });
}

export function trackBusinessWebsiteClick(businessSlug: string, businessName: string) {
  trackEvent("business_website_click", { business_slug: businessSlug, business_name: businessName });
}

export function trackDirectionsClick(targetSlug: string, targetName: string, targetType: string) {
  trackEvent("directions_click", {
    target_slug: targetSlug,
    target_name: targetName,
    target_type: targetType,
  });
}

export function trackPhoneClick(businessSlug: string, businessName: string) {
  trackEvent("phone_click", { business_slug: businessSlug, business_name: businessName });
}

export function trackClaimStarted(slug: string, listingType: string) {
  trackEventOnce("claim_start", { slug, listing_type: listingType }, `claim_start:${slug}:${listingType}`);
}

export function trackClaimSubmitted(slug: string, listingType: string) {
  trackEvent("claim_submit", { slug, listing_type: listingType });
}

export function trackFoundingPartnerInterest(source: string) {
  trackEvent("founding_partner_interest", { source });
}

export function trackNewsletterSignup(source: string) {
  trackEvent("newsletter_signup", { source });
}

export function trackSearch(query: string, source: string) {
  trackEvent("search", { query, source });
}

export function trackSavedTrip(source: string) {
  trackEvent("saved_trip", { source });
}

export function trackPassportCheckIn(placeSlug: string, placeName: string) {
  trackEvent("passport_checkin", { place_slug: placeSlug, place_name: placeName });
}

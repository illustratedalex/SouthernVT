"use client";

type EventParams = Record<string, string | number | boolean | undefined | null>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: EventParams) => void;
  }
}

const trackedOnce = new Set<string>();

function sendEvent(eventName: string, params?: EventParams, onceKey?: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  if (onceKey) {
    if (trackedOnce.has(onceKey)) {
      return;
    }
    trackedOnce.add(onceKey);
  }

  window.gtag("event", eventName, params);
}

export function trackConciergeStarted(params?: EventParams) {
  sendEvent("concierge_started", params);
}

export function trackConciergeCompleted(params?: EventParams, onceKey?: string) {
  sendEvent("concierge_completed", params, onceKey);
}

export function trackPlaceViewed(params?: EventParams, onceKey?: string) {
  sendEvent("place_viewed", params, onceKey);
}

export function trackCollectionViewed(params?: EventParams, onceKey?: string) {
  sendEvent("collection_viewed", params, onceKey);
}

export function trackGuideViewed(params?: EventParams, onceKey?: string) {
  sendEvent("guide_viewed", params, onceKey);
}

export function trackStoryViewed(params?: EventParams, onceKey?: string) {
  sendEvent("story_viewed", params, onceKey);
}

export function trackBusinessViewed(params?: EventParams, onceKey?: string) {
  sendEvent("business_viewed", params, onceKey);
}

export function trackBusinessWebsiteClick(params?: EventParams) {
  sendEvent("business_website_click", params);
}

export function trackDirectionsClick(params?: EventParams) {
  sendEvent("directions_click", params);
}

export function trackPhoneClick(params?: EventParams) {
  sendEvent("phone_click", params);
}

export function trackPassportCheckIn(params?: EventParams) {
  sendEvent("passport_check_in", params);
}

export function trackPartnerClick(params?: EventParams) {
  sendEvent("partner_click", params);
}

export function trackClaimStarted(params?: EventParams, onceKey?: string) {
  sendEvent("claim_started", params, onceKey);
}

export function trackClaimSubmitted(params?: EventParams) {
  sendEvent("claim_submitted", params);
}

export function trackSearch(params?: EventParams) {
  sendEvent("search_submitted", params);
}

export function trackSavedTrip(params?: EventParams, onceKey?: string) {
  sendEvent("saved_trip_viewed", params, onceKey);
}

export function trackAIConcierge(params?: EventParams) {
  sendEvent("ai_concierge_requested", params);
}

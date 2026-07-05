"use client";

import { useEffect } from "react";
import {
  trackBusinessWebsiteClick,
  trackConciergeStarted,
  trackDirectionsClick,
  trackFoundingPartnerInterest,
  trackNewsletterSignup,
  trackPhoneClick,
  trackSearch,
} from "@/lib/analytics/events";

function toValue(value: string | undefined) {
  return value && value.trim() ? value.trim() : undefined;
}

export function AnalyticsEventBindings() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const clickable = target.closest<HTMLElement>("[data-ga-event]");
      if (!clickable) {
        return;
      }

      const gaEvent = clickable.dataset.gaEvent;
      if (!gaEvent) {
        return;
      }

      if (gaEvent === "concierge_start") {
        trackConciergeStarted();
        return;
      }

      if (gaEvent === "business_website_click") {
        trackBusinessWebsiteClick(
          toValue(clickable.dataset.gaBusinessSlug) ?? "unknown",
          toValue(clickable.dataset.gaBusinessName) ?? toValue(clickable.dataset.gaLabel) ?? "Unknown Business",
        );
        return;
      }

      if (gaEvent === "directions_click") {
        trackDirectionsClick(
          toValue(clickable.dataset.gaTargetSlug) ?? toValue(clickable.dataset.gaPlaceSlug) ?? "unknown",
          toValue(clickable.dataset.gaTargetName) ?? toValue(clickable.dataset.gaPlaceName) ?? "Unknown Destination",
          toValue(clickable.dataset.gaTargetType) ?? "place",
        );
        return;
      }

      if (gaEvent === "phone_click") {
        trackPhoneClick(
          toValue(clickable.dataset.gaBusinessSlug) ?? toValue(clickable.dataset.gaEntitySlug) ?? "unknown",
          toValue(clickable.dataset.gaBusinessName) ?? toValue(clickable.dataset.gaEntityName) ?? "Unknown Business",
        );
        return;
      }

      if (gaEvent === "founding_partner_interest") {
        trackFoundingPartnerInterest(
          toValue(clickable.dataset.gaSource) ?? toValue(clickable.dataset.gaPartnerSurface) ?? "unknown",
        );
      }
    };

    const onSubmit = (event: SubmitEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLFormElement)) {
        return;
      }

      const formData = new FormData(target);
      const gaEvent = target.dataset.gaEvent;
      if (gaEvent === "search") {
        const query = formData.get("q");
        trackSearch(
          typeof query === "string" ? query.trim() : "",
          toValue(target.dataset.gaSource) ?? "unknown",
        );
        return;
      }

      if (gaEvent === "newsletter_signup") {
        trackNewsletterSignup(toValue(target.dataset.gaSource) ?? "unknown");
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import {
  trackBusinessWebsiteClick,
  trackConciergeStarted,
  trackDirectionsClick,
  trackPartnerClick,
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

      const commonParams = {
        source: toValue(clickable.dataset.gaSource),
        label: toValue(clickable.dataset.gaLabel),
        href: toValue(clickable.dataset.gaHref),
      };

      if (gaEvent === "concierge_started") {
        trackConciergeStarted({
          ...commonParams,
          mood: toValue(clickable.dataset.gaMood),
          time_available: toValue(clickable.dataset.gaTime),
          travel_style: toValue(clickable.dataset.gaStyle),
          radius: toValue(clickable.dataset.gaRadius),
        });
        return;
      }

      if (gaEvent === "business_website_click") {
        trackBusinessWebsiteClick({
          ...commonParams,
          business_slug: toValue(clickable.dataset.gaBusinessSlug),
          business_name: toValue(clickable.dataset.gaBusinessName),
        });
        return;
      }

      if (gaEvent === "directions_click") {
        trackDirectionsClick({
          ...commonParams,
          place_slug: toValue(clickable.dataset.gaPlaceSlug),
          place_name: toValue(clickable.dataset.gaPlaceName),
        });
        return;
      }

      if (gaEvent === "phone_click") {
        trackPhoneClick({
          ...commonParams,
          entity_slug: toValue(clickable.dataset.gaEntitySlug),
          entity_name: toValue(clickable.dataset.gaEntityName),
        });
        return;
      }

      if (gaEvent === "partner_click") {
        trackPartnerClick({
          ...commonParams,
          partner_surface: toValue(clickable.dataset.gaPartnerSurface),
        });
      }
    };

    const onSubmit = (event: SubmitEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLFormElement)) {
        return;
      }

      if (target.dataset.gaEvent !== "search_submitted") {
        return;
      }

      const formData = new FormData(target);
      const query = formData.get("q");
      trackSearch({
        source: toValue(target.dataset.gaSource),
        query: typeof query === "string" ? query.trim() : undefined,
      });
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

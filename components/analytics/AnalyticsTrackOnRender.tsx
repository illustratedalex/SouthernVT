"use client";

import { useEffect } from "react";
import {
  trackEvent,
  trackEventOnce,
} from "@/lib/analytics/events";

type TrackOnRenderEvent =
  | "place_view"
  | "collection_viewed"
  | "guide_viewed"
  | "story_viewed"
  | "business_view"
  | "concierge_complete"
  | "saved_trip";

type AnalyticsTrackOnRenderProps = {
  event: TrackOnRenderEvent;
  params?: Record<string, string | number | boolean | undefined | null>;
  onceKey: string;
};

export function AnalyticsTrackOnRender({ event, params, onceKey }: AnalyticsTrackOnRenderProps) {
  useEffect(() => {
    if (event === "place_view") {
      trackEventOnce("place_view", params, onceKey);
      return;
    }
    if (event === "collection_viewed") {
      trackEventOnce("collection_viewed", params, onceKey);
      return;
    }
    if (event === "guide_viewed") {
      trackEventOnce("guide_viewed", params, onceKey);
      return;
    }
    if (event === "story_viewed") {
      trackEventOnce("story_viewed", params, onceKey);
      return;
    }
    if (event === "business_view") {
      trackEventOnce("business_view", params, onceKey);
      return;
    }
    if (event === "concierge_complete") {
      trackEventOnce("concierge_complete", params, onceKey);
      return;
    }
    if (event === "saved_trip") {
      trackEventOnce("saved_trip", params, onceKey);
      return;
    }

    trackEvent(event, params);
  }, [event, onceKey, params]);

  return null;
}

"use client";

import { useEffect } from "react";
import {
  trackBusinessViewed,
  trackCollectionViewed,
  trackConciergeCompleted,
  trackGuideViewed,
  trackPlaceViewed,
  trackSavedTrip,
  trackStoryViewed,
} from "@/lib/analytics/events";

type TrackOnRenderEvent =
  | "place_viewed"
  | "collection_viewed"
  | "guide_viewed"
  | "story_viewed"
  | "business_viewed"
  | "concierge_completed"
  | "saved_trip_viewed";

type AnalyticsTrackOnRenderProps = {
  event: TrackOnRenderEvent;
  params?: Record<string, string | number | boolean | undefined | null>;
  onceKey: string;
};

export function AnalyticsTrackOnRender({ event, params, onceKey }: AnalyticsTrackOnRenderProps) {
  useEffect(() => {
    if (event === "place_viewed") {
      trackPlaceViewed(params, onceKey);
      return;
    }
    if (event === "collection_viewed") {
      trackCollectionViewed(params, onceKey);
      return;
    }
    if (event === "guide_viewed") {
      trackGuideViewed(params, onceKey);
      return;
    }
    if (event === "story_viewed") {
      trackStoryViewed(params, onceKey);
      return;
    }
    if (event === "business_viewed") {
      trackBusinessViewed(params, onceKey);
      return;
    }
    if (event === "concierge_completed") {
      trackConciergeCompleted(params, onceKey);
      return;
    }

    trackSavedTrip(params, onceKey);
  }, [event, onceKey, params]);

  return null;
}

"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { articleRepository } from "@/lib/repositories/articleRepository";
import { collectionRepository } from "@/lib/repositories/collectionRepository";
import { dealRepository } from "@/lib/repositories/dealRepository";
import { eventRepository } from "@/lib/repositories/eventRepository";
import { featureFlagRepository } from "@/lib/repositories/featureFlagRepository";
import { mediaRepository } from "@/lib/repositories/mediaRepository";
import { passportRepository } from "@/lib/repositories/passportRepository";
import { placeRepository } from "@/lib/repositories/placeRepository";
import { relationshipRepository } from "@/lib/repositories/RelationshipRepository";
import { reviewRepository } from "@/lib/repositories/reviewRepository";
import { activityRepository } from "@/lib/repositories/ActivityRepository";
import { workflowRepository } from "@/lib/repositories/WorkflowRepository";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import { setRepositoryModeOverride, type RepositoryRuntimeMode } from "@/lib/repositories/mode";

export type RepositoryMode = "mock" | "supabase" | "auto";

export type RepositoryBundle = {
  places: typeof placeRepository;
  collections: typeof collectionRepository;
  articles: typeof articleRepository;
  events: typeof eventRepository;
  deals: typeof dealRepository;
  media: typeof mediaRepository;
  relationships: typeof relationshipRepository;
  workflow: typeof workflowRepository;
  activity: typeof activityRepository;
  reviews: typeof reviewRepository;
  passport: typeof passportRepository;
  featureFlags: typeof featureFlagRepository;
};

const defaultBundle: RepositoryBundle = {
  places: placeRepository,
  collections: collectionRepository,
  articles: articleRepository,
  events: eventRepository,
  deals: dealRepository,
  media: mediaRepository,
  relationships: relationshipRepository,
  workflow: workflowRepository,
  activity: activityRepository,
  reviews: reviewRepository,
  passport: passportRepository,
  featureFlags: featureFlagRepository,
};

const RepositoryContext = createContext<RepositoryBundle>(defaultBundle);

function resolveRequestedMode(mode: RepositoryMode): RepositoryMode {
  if (mode !== "auto") {
    return mode;
  }

  const explicit = process.env.NEXT_PUBLIC_REPOSITORY_MODE;
  if (explicit === "mock" || explicit === "supabase") {
    return explicit;
  }

  return "auto";
}

export function RepositoryProvider({ children, mode = "auto" }: { children: ReactNode; mode?: RepositoryMode }) {
  const resolvedMode = resolveRequestedMode(mode);
  const value = useMemo(() => defaultBundle, []);

  useEffect(() => {
    if (resolvedMode === "auto") {
      setRepositoryModeOverride(null);
      return;
    }

    setRepositoryModeOverride(resolvedMode as RepositoryRuntimeMode);

    return () => {
      setRepositoryModeOverride(null);
    };
  }, [resolvedMode]);

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>;
}

export function MockRepositoryProvider({ children }: { children: ReactNode }) {
  return <RepositoryProvider mode="mock">{children}</RepositoryProvider>;
}

export function SupabaseRepositoryProvider({ children }: { children: ReactNode }) {
  return <RepositoryProvider mode="supabase">{children}</RepositoryProvider>;
}

export function useRepositories() {
  return useContext(RepositoryContext);
}
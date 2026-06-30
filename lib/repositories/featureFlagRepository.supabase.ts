import { getSupabaseClient } from "@/lib/supabase/client";
import type { FeatureFlag, FeatureFlagKey } from "@/types/FeatureFlag";

function mapFeatureFlag(row: any): FeatureFlag {
  return {
    key: row.key,
    label: row.label,
    description: row.description,
    enabled: row.enabled,
    environment: row.environment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("feature_flags").select("*").is("archived_at", null).order("key", { ascending: true });
  if (error || !data) {
    throw new Error(`Failed to fetch feature flags from Supabase: ${error?.message ?? "unknown error"}`);
  }
  return data.map(mapFeatureFlag);
}

export async function getFeatureFlag(key: FeatureFlagKey): Promise<FeatureFlag | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client.from("feature_flags").select("*").eq("key", key).is("archived_at", null).maybeSingle();
  if (error) {
    throw new Error(`Failed to fetch feature flag from Supabase: ${error.message}`);
  }
  return data ? mapFeatureFlag(data) : null;
}

export async function isFeatureEnabled(key: FeatureFlagKey): Promise<boolean> {
  const flag = await getFeatureFlag(key);
  return Boolean(flag?.enabled);
}

export async function updateFeatureFlag(key: FeatureFlagKey, enabled: boolean): Promise<FeatureFlag | null> {
  const client: any = getSupabaseClient();
  const { data, error } = await client
    .from("feature_flags")
    .update({ enabled, updated_at: new Date().toISOString() })
    .eq("key", key)
    .is("archived_at", null)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update feature flag in Supabase: ${error.message}`);
  }
  return data ? mapFeatureFlag(data) : null;
}

export const supabaseFeatureFlagRepository = {
  getFeatureFlags,
  getFeatureFlag,
  isFeatureEnabled,
  updateFeatureFlag,
};

import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, hasSupabaseConfig, requireSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

export function hasSupabaseEnv() {
	return hasSupabaseConfig();
}

export function createSupabaseClient() {
	const config = requireSupabaseConfig();
	return createClient<Database>(config.url, config.anonKey) as any;
}

let browserClient: any = null;

export function getSupabaseClient() {
	if (!browserClient) {
		browserClient = createSupabaseClient();
	}
	return browserClient;
}

// Backward compatible alias for existing imports in this repo.
export const supabase = hasSupabaseEnv()
	? getSupabaseClient()
	: createClient<Database>(getSupabaseConfig().url || "https://placeholder.supabase.co", getSupabaseConfig().anonKey || "placeholder-anon-key");

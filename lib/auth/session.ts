import "server-only";
import { cookies } from "next/headers";
import { createClient, type User } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export const OWNER_AUTH_COOKIE = "svt_owner_access_token";

export function createSupabaseUserClient(accessToken: string) {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient<Database>(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function getOwnerAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(OWNER_AUTH_COOKIE)?.value ?? null;
}

export async function getAuthenticatedOwnerUser(): Promise<User | null> {
  const accessToken = await getOwnerAccessToken();
  if (!accessToken) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) {
    return null;
  }

  return data.user ?? null;
}

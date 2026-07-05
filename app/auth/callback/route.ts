import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OWNER_AUTH_COOKIE } from "@/lib/auth/session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login?error=invalid_callback", request.url));
  }

  const otpType = type as EmailOtpType;
  if (!["signup", "invite", "magiclink", "recovery", "email_change", "email"].includes(otpType)) {
    return NextResponse.redirect(new URL("/login?error=invalid_callback", request.url));
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: otpType,
  });

  if (error || !data.session?.access_token) {
    return NextResponse.redirect(new URL("/login?error=callback_failed", request.url));
  }

  const response = NextResponse.redirect(new URL("/partner-portal", request.url));
  response.cookies.set(OWNER_AUTH_COOKIE, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

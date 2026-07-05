import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OWNER_AUTH_COOKIE } from "@/lib/auth/session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return NextResponse.redirect(new URL("/signup?error=missing_fields", request.url));
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return NextResponse.redirect(new URL("/signup?error=signup_failed", request.url));
  }

  const accessToken = data.session?.access_token;
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login?notice=confirm_email", request.url));
  }

  const response = NextResponse.redirect(new URL("/partner-portal", request.url));
  response.cookies.set(OWNER_AUTH_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "./config";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (hasSupabaseConfig()) {
    response.headers.set("x-trailhead-supabase", "enabled");
  }

  response.headers.set("x-trailhead-path", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
import type { NextRequest } from "next/server";
import { middleware as supabaseMiddleware } from "@/lib/supabase/middleware";

export function proxy(request: NextRequest) {
  return supabaseMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

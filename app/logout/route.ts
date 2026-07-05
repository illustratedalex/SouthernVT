import { NextResponse } from "next/server";
import { OWNER_AUTH_COOKIE } from "@/lib/auth/session";

function buildLogoutResponse(request: Request) {
  const response = NextResponse.redirect(new URL("/login?notice=logged_out", request.url));
  response.cookies.set(OWNER_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET(request: Request) {
  return buildLogoutResponse(request);
}

export async function POST(request: Request) {
  return buildLogoutResponse(request);
}

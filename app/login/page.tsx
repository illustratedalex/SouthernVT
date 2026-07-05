import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Owner Login | SouthernVT",
  description: "Business owner login for SouthernVT listing claiming and partner portal access.",
  path: "/login",
});

const errorMessages: Record<string, string> = {
  callback_failed: "We could not complete the magic link sign-in. Please try again.",
  invalid_callback: "Invalid sign-in callback. Please request a new magic link.",
  invalid_credentials: "Invalid email or password.",
  magic_link_failed: "Unable to send magic link right now. Please try again.",
  missing_email: "Enter your email to receive a magic link.",
  missing_fields: "Email and password are required.",
};

const noticeMessages: Record<string, string> = {
  confirm_email: "Your account was created. Please confirm your email before logging in.",
  logged_out: "You have been logged out.",
  magic_link_sent: "Magic link sent. Check your inbox to finish sign-in.",
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string; notice?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error ? errorMessages[params.error] : "";
  const notice = params.notice ? noticeMessages[params.notice] : "";

  return (
    <section className="mx-auto max-w-xl space-y-6 px-6 py-12 sm:px-8 lg:px-10">
      <header className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Business Owner Access</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Login</h1>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          Sign in to manage your approved SouthernVT business listings.
        </p>
      </header>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      ) : null}
      {notice ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>
      ) : null}

      <form action="/api/auth/login" method="post" className="space-y-4 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            required
            className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-white px-4 text-sm text-slate-800"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            required
            className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-white px-4 text-sm text-slate-800"
          />
        </label>
        <button type="submit" className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-2.5 text-sm font-semibold text-[#f8f2e4]">
          Login
        </button>
      </form>

      <form action="/api/auth/magic-link" method="post" className="space-y-4 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Or request a magic link</p>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            required
            className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-white px-4 text-sm text-slate-800"
          />
        </label>
        <button type="submit" className="inline-flex rounded-full border border-[#d7cbb3] px-5 py-2.5 text-sm font-semibold text-slate-700">
          Send magic link
        </button>
      </form>

      <p className="text-sm text-slate-700">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#1f3b2f] underline underline-offset-4">
          Create one
        </Link>
      </p>
    </section>
  );
}

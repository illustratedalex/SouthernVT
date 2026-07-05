import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Owner Sign Up | SouthernVT",
  description: "Create a SouthernVT owner account to access approved business listings.",
  path: "/signup",
});

const errorMessages: Record<string, string> = {
  missing_fields: "Name, email, and password are required.",
  signup_failed: "Unable to create account. Please verify your details and try again.",
};

interface SignupPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const error = params.error ? errorMessages[params.error] : "";

  return (
    <section className="mx-auto max-w-xl space-y-6 px-6 py-12 sm:px-8 lg:px-10">
      <header className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Business Owner Access</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create account</h1>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          Use the same email you submit in your business claim so Basecamp can approve ownership access.
        </p>
      </header>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      ) : null}

      <form action="/api/auth/signup" method="post" className="space-y-4 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Full name
          <input
            type="text"
            name="name"
            required
            className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-white px-4 text-sm text-slate-800"
          />
        </label>
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
            minLength={8}
            required
            className="h-11 w-full rounded-2xl border border-[#d7cbb3] bg-white px-4 text-sm text-slate-800"
          />
        </label>
        <button type="submit" className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-2.5 text-sm font-semibold text-[#f8f2e4]">
          Create account
        </button>
      </form>

      <p className="text-sm text-slate-700">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#1f3b2f] underline underline-offset-4">
          Login
        </Link>
      </p>
    </section>
  );
}

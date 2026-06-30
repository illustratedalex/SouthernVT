import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <header className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Contact</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Get in touch with SouthernVT</h1>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Email</h2>
            <p className="mt-2 text-sm text-slate-600">hello@southernvt.com (placeholder)</p>
          </article>

          <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Social</h2>
            <p className="mt-2 text-sm text-slate-600">Instagram (placeholder) · Facebook (placeholder) · YouTube (placeholder)</p>
          </article>
        </div>

        <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Business partnerships</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">Interested in featuring your business on SouthernVT? Visit the partner workflow and submit your details.</p>
          <a href="/partner-portal" className="mt-4 inline-flex rounded-full bg-[#1f3b2f] px-6 py-3 text-sm font-semibold text-[#f8f2e4]">Open Partner Portal</a>
        </section>
      </section>
      <Footer />
    </main>
  );
}

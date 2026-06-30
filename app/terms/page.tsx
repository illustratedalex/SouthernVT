import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-10">
        <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Terms</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">Terms of service placeholder for SouthernVT beta launch.</p>
        </article>
      </section>
      <Footer />
    </main>
  );
}

import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy — SouthernVT",
  description: "How SouthernVT collects, uses, and protects information submitted through our platform.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-10">
        <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-8 shadow-sm">
          {/* Header */}
          <h1 className="text-3xl font-semibold text-slate-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-500">Effective Date: July 2026</p>

          {/* Disclaimer */}
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            <strong>Note:</strong> This policy is provided for general informational purposes and should be reviewed by legal counsel before formal commercial launch.
          </div>

          <Section title="Who We Are">
            <p>
              SouthernVT is a regional travel publication and planning platform focused on Southern Vermont. We help visitors discover places, businesses, and experiences across Windham, Bennington, and Southern Windsor counties.
            </p>
            <p>
              Our website is located at <strong>southernvt.com</strong>. For questions about this policy, contact us at{" "}
              <a href="mailto:hello@southernvt.com" className="text-[#1f3b2f] underline underline-offset-2">
                hello@southernvt.com
              </a>
              .
            </p>
          </Section>

          <Section title="Information We Collect">
            <p>We may collect the following types of information:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Contact form submissions (name, email, message)</li>
              <li>Business claim submissions (business name, contact name, role, phone, verification notes)</li>
              <li>Newsletter signups, if enabled</li>
              <li>Analytics data about how visitors use the site</li>
              <li>Device and browser information</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Listing information submitted by business owners</li>
            </ul>
            <p>
              We do not require account registration to browse SouthernVT. Information is only collected when you voluntarily submit a form or interact with a feature that requires it.
            </p>
          </Section>

          <Section title="How We Use Information">
            <p>Information collected through SouthernVT may be used to:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Respond to contact inquiries</li>
              <li>Review and process business listing claim requests</li>
              <li>Improve accuracy of listings</li>
              <li>Analyze site performance and improve visitor experience</li>
              <li>Send updates or announcements to users who have opted in</li>
              <li>Maintain platform security and prevent abuse</li>
            </ul>
          </Section>

          <Section title="Analytics Tools">
            <p>SouthernVT uses analytics and performance monitoring tools to understand how visitors use the site. These may include:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>
                <strong>Google Analytics</strong> — tracks page views, sessions, and visitor behavior
              </li>
              <li>
                <strong>Microsoft Clarity</strong> — session replay and heatmap tool for understanding user experience
              </li>
              <li>
                <strong>Vercel Analytics</strong> — performance and traffic data provided by our hosting platform
              </li>
            </ul>
            <p>
              These tools may set cookies and collect anonymized or aggregated data. We do not use analytics data to personally identify individual visitors.
            </p>
          </Section>

          <Section title="Business Listings and Claims">
            <p>
              SouthernVT maintains a directory of local businesses and places. Some listings are created by our editorial team using publicly available information. Business owners may submit a claim request to take ownership of their listing.
            </p>
            <p>
              When a claim is submitted, SouthernVT reviews it before granting access. Approved owners may update their listing information. All changes are subject to editorial review and may be modified or rejected at SouthernVT&apos;s discretion.
            </p>
          </Section>

          <Section title="Payments">
            <p>
              SouthernVT may offer paid listing upgrades or Founding Partner contributions in the future. If enabled, payments would be processed by a third-party payment provider such as Stripe. SouthernVT does not store credit card or payment information directly.
            </p>
            <p>At this time, all listing claims and basic listings are free of charge.</p>
          </Section>

          <Section title="Email Communication">
            <p>
              Messages submitted through our contact form are routed to the SouthernVT team based on the reason selected:
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>
                General inquiries, listing corrections, and suggestions →{" "}
                <a href="mailto:hello@southernvt.com" className="text-[#1f3b2f] underline underline-offset-2">
                  hello@southernvt.com
                </a>
              </li>
              <li>
                Business claims and partner inquiries →{" "}
                <a href="mailto:partners@southernvt.com" className="text-[#1f3b2f] underline underline-offset-2">
                  partners@southernvt.com
                </a>
              </li>
              <li>
                Press and media inquiries →{" "}
                <a href="mailto:press@southernvt.com" className="text-[#1f3b2f] underline underline-offset-2">
                  press@southernvt.com
                </a>
              </li>
            </ul>
          </Section>

          <Section title="Data Sharing">
            <p>
              SouthernVT does not sell personal information to third parties.
            </p>
            <p>
              We may share limited information with service providers necessary to operate the platform — such as email delivery services, analytics providers, and hosting infrastructure. These providers are only given access to information needed to perform their function.
            </p>
            <p>
              We may disclose information if required by law or to protect the rights, safety, or property of SouthernVT, our users, or the public.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              SouthernVT uses cookies and similar technologies for analytics and performance monitoring. These cookies help us understand how visitors use the site so we can improve the experience.
            </p>
            <p>
              You can configure your browser to refuse cookies or alert you when cookies are being sent. Some features of the site may not function properly if cookies are disabled.
            </p>
          </Section>

          <Section title="Data Retention">
            <p>
              We retain submitted information for as long as necessary to operate SouthernVT, respond to requests, comply with legal obligations, or maintain records of business listing claims and communications.
            </p>
            <p>
              If you would like to request deletion or correction of information you have submitted, contact us at{" "}
              <a href="mailto:hello@southernvt.com" className="text-[#1f3b2f] underline underline-offset-2">
                hello@southernvt.com
              </a>
              .
            </p>
          </Section>

          <Section title="Children">
            <p>
              SouthernVT is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has submitted information through our platform, please contact us so we can remove it.
            </p>
          </Section>

          <Section title="Your Choices">
            <p>You can contact SouthernVT at any time to:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Request an update or correction to information you have submitted</li>
              <li>Request removal of a contact form submission or claim request</li>
              <li>Unsubscribe from any email communications</li>
            </ul>
            <p>
              Reach us at{" "}
              <a href="mailto:hello@southernvt.com" className="text-[#1f3b2f] underline underline-offset-2">
                hello@southernvt.com
              </a>
              .
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              We may update this privacy policy from time to time. When we do, we will update the effective date at the top of this page. Continued use of SouthernVT after changes are posted constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              For questions, concerns, or requests related to this privacy policy, contact SouthernVT at:
            </p>
            <p>
              <a href="mailto:hello@southernvt.com" className="font-semibold text-[#1f3b2f] underline underline-offset-2">
                hello@southernvt.com
              </a>
            </p>
          </Section>

          <div className="mt-10 border-t border-[#e8dfc8] pt-6 text-xs leading-6 text-slate-400">
            SouthernVT · Southern Vermont · Effective July 2026
          </div>
        </article>
      </section>
      <Footer />
    </main>
  );
}

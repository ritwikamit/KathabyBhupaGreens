import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { getSiteConfig } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy explaining how Katha by Bhupa Greens handles enquiry messages and website contact details.',
};

export default function PrivacyPolicyPage() {
  const site = getSiteConfig();

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-12 sm:pt-16 space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-[#774D78]">
          <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="section-eyebrow">Website Information</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#635364]">
          Last updated: November 2026
        </p>
      </header>

      <div className="glass-panel rounded-2xl p-7 sm:p-10 space-y-8 text-base leading-relaxed text-[#2A1C2B]/85">
        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Information you share with us
          </h2>
          <p>
            When you send an enquiry through our Find Us page, we collect the name, phone number or email address, enquiry topic, optional preferred date and time, and message you enter.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            How we use your details
          </h2>
          <p>
            We use your contact details solely to reply to your question about the menu, opening hours, table enquiries, or a planned group visit at {site.name}. We do not sell or rent your details to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Do not submit sensitive data
          </h2>
          <p>
            This website does not take online payments or store payment cards. Please do not enter bank details, card numbers, government IDs, or other sensitive personal information in the contact form.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            External links
          </h2>
          <p>
            Links to Google Maps, WhatsApp, Instagram, Facebook, and the Bhupa Greens website open external platforms governed by their own privacy policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Contact for privacy requests
          </h2>
          <p>
            If you want us to remove an enquiry message you previously sent, email{' '}
            <a
              href={`mailto:${site.email}`}
              className="text-[#774D78] hover:underline"
            >
              {site.email}
            </a>{' '}
            or reach our desk via the{' '}
            <Link href="/find-us" className="text-[#774D78] hover:underline">
              Find Us
            </Link>{' '}
            page.
          </p>
        </section>

        <div className="pt-4 border-t border-[#774D78]/15 flex flex-wrap items-center gap-6 text-sm font-medium">
          <Link
            href="/terms-and-conditions"
            className="text-[#774D78] hover:text-[#5D3A5E] transition-colors"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/cookie-policy"
            className="text-[#774D78] hover:text-[#5D3A5E] transition-colors"
          >
            Cookie Policy
          </Link>
          <Link
            href="/find-us"
            className="text-[#774D78] hover:text-[#5D3A5E] transition-colors"
          >
            Return to Find Us
          </Link>
        </div>
      </div>
    </div>
  );
}

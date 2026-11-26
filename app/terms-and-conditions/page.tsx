import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { getSiteConfig } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Terms and conditions for using the Katha by Bhupa Greens website, viewing menu details, and submitting table enquiries.',
};

export default function TermsAndConditionsPage() {
  const site = getSiteConfig();

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-12 sm:pt-16 space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-[#774D78]">
          <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="section-eyebrow">Website Information</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-[#635364]">
          Last updated: November 2026
        </p>
      </header>

      <div className="glass-panel rounded-2xl p-7 sm:p-10 space-y-8 text-base leading-relaxed text-[#2A1C2B]/85">
        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Use of this website
          </h2>
          <p>
            This website provides menu information, photographs, directions, and enquiry options for {site.name}, located inside the Bhupa Greens campus in Darbhanga, Bihar. By browsing this site, you agree to use it for lawful, personal, non-commercial enquiries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Menu items, allergens, and pricing
          </h2>
          <p>
            Menu categories, dish descriptions, and seasonal offerings are maintained by the {site.name} team and may change without prior notice based on ingredient availability and daily kitchen preparation. Please confirm current pricing, daily availability, and allergen details with your server when dining.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Table enquiries and opening hours
          </h2>
          <p>
            Submitting a message through our Find Us page or starting a WhatsApp enquiry constitutes a request for information and does not automatically confirm a table reservation. Opening hours may adjust on Bhupa Greens campus event days; please confirm with our team before travelling.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Intellectual property
          </h2>
          <p>
            All original brand logos, photography, editorial copy, and short-form video reels displayed on this website belong to {site.name} or their respective creators and may not be reproduced commercially without written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Questions about these terms
          </h2>
          <p>
            For any questions regarding these terms, write to{' '}
            <a
              href={`mailto:${site.email}`}
              className="text-[#774D78] hover:underline"
            >
              {site.email}
            </a>{' '}
            or use the{' '}
            <Link href="/find-us" className="text-[#774D78] hover:underline">
              Find Us
            </Link>{' '}
            page.
          </p>
        </section>

        <div className="pt-4 border-t border-[#774D78]/15 flex flex-wrap items-center gap-6 text-sm font-medium">
          <Link
            href="/privacy-policy"
            className="text-[#774D78] hover:text-[#5D3A5E] transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/cookie-policy"
            className="text-[#774D78] hover:text-[#5D3A5E] transition-colors"
          >
            Cookie Policy
          </Link>
          <Link
            href="/faq"
            className="text-[#774D78] hover:text-[#5D3A5E] transition-colors"
          >
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import CookieSettingsPanel from '@/components/CookieSettingsPanel';
import { getSiteConfig } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Cookie policy describing how the Katha by Bhupa Greens website uses essential technical storage and external links.',
};

export default function CookiePolicyPage() {
  const site = getSiteConfig();

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-12 sm:pt-16 space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-[#774D78]">
          <Cookie className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="section-eyebrow">Website Information</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
          Cookie Policy
        </h1>
        <p className="text-sm text-[#635364]">
          Last updated: November 2026
        </p>
      </header>

      <CookieSettingsPanel />

      <div className="glass-panel rounded-2xl p-7 sm:p-10 space-y-8 text-base leading-relaxed text-[#2A1C2B]/85">
        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            What cookies are
          </h2>
          <p>
            Cookies are small text files stored in your browser when you visit a website. They help websites load reliably and remember basic preferences during your browsing session.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            How {site.name} uses cookies
          </h2>
          <p>
            This website is designed as a lightweight, informational restaurant site. We do not use advertising trackers or sell browsing behaviour. Essential technical storage may be used strictly to deliver pages, protect our enquiry form from automated spam, and keep navigation smooth.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Third-party services
          </h2>
          <p>
            When you follow links to Google Maps, WhatsApp, Instagram, Facebook, or the Bhupa Greens website, those external services may set their own cookies in line with their respective policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Managing cookies in your browser
          </h2>
          <p>
            You can clear or block cookies at any time through your browser settings. Because we do not rely on tracking cookies, all core pages and menus remain accessible even with non-essential cookies turned off.
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
            href="/terms-and-conditions"
            className="text-[#774D78] hover:text-[#5D3A5E] transition-colors"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/find-us"
            className="text-[#774D78] hover:text-[#5D3A5E] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

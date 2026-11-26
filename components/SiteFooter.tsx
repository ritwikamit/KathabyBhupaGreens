import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import EditorialImage from '@/components/EditorialImage';
import OpenMenuBookButton from '@/components/OpenMenuBookButton';
import { MENU_CATEGORIES, SITE_CONFIG } from '@/lib/data/katha-data';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="agency-credit"
      className="mt-16 sm:mt-24 mx-auto w-full max-w-[1380px] px-3 sm:px-6 lg:px-10 pb-4 sm:pb-7"
    >
      <div className="relative isolate w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#774D78]/25 shadow-2xl shadow-[#2A1C2B]/20 min-h-0 sm:min-h-[490px] flex flex-col justify-between">
        {/* Clearer Katha Dining Hall Background Photo with Balanced Readability Fade */}
        <div className="absolute inset-0 z-0">
          <EditorialImage
            src="/katha-photos/dining-hall.webp"
            alt="Warm evening dining room inside Katha by Bhupa Greens"
            sizes="(max-width: 1380px) 100vw, 1380px"
            containerClassName="relative w-full h-full"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#1B101C]/58 via-[#1B101C]/48 to-[#140B15]/78"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#1A0F1B]/62 via-[#1A0F1B]/30 to-[#1A0F1B]/48"
          />
        </div>

        {/* Enlarged & Evenly Aligned Footer Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-12 pt-7 sm:pt-16 pb-6 sm:pb-12 flex-1 flex flex-col justify-between gap-8 sm:gap-12 text-[#FBF7EE]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-start">
            {/* Column 1: Bigger Unboxed White-Script Logo + Venue Details + Enquiry CTAs */}
            <div className="lg:col-span-4 space-y-6">
              <Link
                href="/"
                aria-label="Katha by Bhupa Greens Home"
                className="interactive-logo inline-block"
              >
                <Image
                  src="/assets/katha-logo-footer-white.png"
                  alt="Katha by Bhupa Greens"
                  width={340}
                  height={168}
                  referrerPolicy="no-referrer"
                  className="h-14 sm:h-20 md:h-[108px] w-auto object-contain drop-shadow-[0_4px_14px_rgba(12,6,14,0.7)]"
                />
              </Link>

              <div className="space-y-2.5 text-sm text-white/95 max-w-xs drop-shadow-[0_1px_4px_rgba(15,8,16,0.75)]">
                <p className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#F1E3C4] mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{SITE_CONFIG.address}</span>
                </p>
                <p className="flex items-center gap-2.5 text-xs text-[#F1E3C4]/95 tabular-nums">
                  <Clock className="h-3.5 w-3.5 text-[#F1E3C4] shrink-0" aria-hidden="true" />
                  <span>Open daily · {SITE_CONFIG.hours}</span>
                </p>
                <p className="flex items-center gap-2.5 text-xs text-[#FBF7EE]/90">
                  <Mail className="h-3.5 w-3.5 text-[#F1E3C4] shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="hover:text-[#F1E3C4] transition-colors break-all"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href={SITE_CONFIG.phoneHref}
                  className="interactive-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-lg bg-[#774D78] border border-[#AF8EB1]/35 px-4 py-2.5 text-xs font-medium text-white whitespace-nowrap shrink-0 hover:bg-[#8E5E8F] shadow-md"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  Book Table on Call
                </a>
                <a
                  href={SITE_CONFIG.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-lg bg-white/95 px-4 py-2.5 text-xs font-medium text-[#2A1C2B] whitespace-nowrap shrink-0 hover:bg-white shadow-md"
                >
                  <FaWhatsapp className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                  WhatsApp Enquiry
                </a>
              </div>
            </div>

            {/* Columns 2 & 3 Grouped as 2 Columns Even on Smartphone */}
            <div className="grid grid-cols-2 gap-8 lg:contents drop-shadow-[0_1px_4px_rgba(15,8,16,0.75)]">
              {/* Column 2: Dedicated Menus in Menu Font */}
              <nav aria-label="Footer menus" className="lg:col-span-3 space-y-4">
                <h2 className="font-menu text-xs font-semibold text-[#F1E3C4]">
                  Menus
                </h2>
                <ul className="space-y-2.5 text-xs sm:text-[13px]">
                  <li>
                    <OpenMenuBookButton
                      className="font-menu inline-block font-semibold text-white hover:text-[#F1E3C4] hover:translate-x-1 transition-all duration-200"
                    >
                      Menu Book
                    </OpenMenuBookButton>
                  </li>
                  {MENU_CATEGORIES.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/menu/${category.slug}`}
                        className="font-menu inline-block text-white/90 hover:text-[#F1E3C4] hover:translate-x-1 transition-all duration-200"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Column 3: Explore */}
              <nav aria-label="Footer navigation" className="lg:col-span-2 space-y-4">
                <h2 className="font-menu text-xs font-semibold text-[#F1E3C4]">
                  Explore
                </h2>
                <ul className="space-y-2.5 text-xs sm:text-[13px]">
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'Our Story', href: '/our-story' },
                    { label: 'Gallery', href: '/gallery' },
                    { label: 'Journal', href: '/journal' },
                    { label: 'Blog', href: '/blog' },
                    { label: 'FAQ', href: '/faq' },
                    { label: 'Find Us', href: '/find-us' },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-menu inline-block text-white/90 hover:text-[#F1E3C4] hover:translate-x-1 transition-all duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 4: Policies & Connect (Google Reviews Icon Removed) */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-7 drop-shadow-[0_1px_4px_rgba(15,8,16,0.75)]">
              <nav aria-label="Legal and policies" className="space-y-4">
                <h2 className="font-menu text-xs font-semibold text-[#F1E3C4]">
                  Policies
                </h2>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="inline-block text-white/90 hover:text-[#F1E3C4] hover:translate-x-1 transition-all duration-200"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-and-conditions"
                      className="inline-block text-white/90 hover:text-[#F1E3C4] hover:translate-x-1 transition-all duration-200"
                    >
                      Terms &amp; Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cookie-policy"
                      className="inline-block text-white/90 hover:text-[#F1E3C4] hover:translate-x-1 transition-all duration-200"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="space-y-3.5">
                <h2 className="font-menu text-xs font-semibold text-[#F1E3C4]">
                  Connect
                </h2>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={SITE_CONFIG.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Katha by Bhupa Greens Location on Google Maps"
                    title="Location"
                    className="interactive-btn inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-[#1B101C]/45 text-[#FBF7EE] backdrop-blur-md hover:border-[#774D78] hover:bg-[#774D78] hover:text-white"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={SITE_CONFIG.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Katha by Bhupa Greens WhatsApp Enquiry"
                    title="WhatsApp"
                    className="interactive-btn inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-[#1B101C]/45 text-[#4ADE80] backdrop-blur-md hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
                  >
                    <FaWhatsapp className="h-[18px] w-[18px]" aria-hidden="true" />
                  </a>
                  <a
                    href={SITE_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Katha by Bhupa Greens on Instagram"
                    title="Instagram"
                    className="interactive-btn inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-[#1B101C]/45 text-[#FBF7EE] backdrop-blur-md hover:border-[#774D78] hover:bg-[#774D78] hover:text-white"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={SITE_CONFIG.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Katha by Bhupa Greens on Facebook"
                    title="Facebook"
                    className="interactive-btn inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-[#1B101C]/45 text-[#FBF7EE] backdrop-blur-md hover:border-[#774D78] hover:bg-[#774D78] hover:text-white"
                  >
                    <Facebook className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Aligned Bottom Copyright & Agency Credit Row */}
          <div className="border-t border-white/20 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left drop-shadow-[0_1px_4px_rgba(15,8,16,0.75)]">
            <p className="text-xs sm:text-sm text-[#FBF7EE]/90">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#FBF7EE]/90">
              <span className="leading-none">{SITE_CONFIG.agency.creditText}</span>
              <a
                href={SITE_CONFIG.agency.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp enquiry with ACCustomLabs"
                title="Enquire with ACCustomLabs on WhatsApp"
                className="interactive-logo inline-flex items-center"
              >
                <Image
                  src={SITE_CONFIG.logos.agency}
                  alt="ACCustomLabs"
                  width={110}
                  height={24}
                  referrerPolicy="no-referrer"
                  className="h-4 sm:h-[18px] w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

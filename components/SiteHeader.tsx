'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Camera,
  Clock,
  Feather,
  Home,
  MapPin,
  Menu,
  Phone,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { AnimatePresence, motion } from 'motion/react';
import { useMenuBookModal } from '@/components/MenuBookModalContext';
import { SITE_CONFIG } from '@/lib/data/katha-data';

const NAV_LINKS = [
  { label: 'Home', href: '/', subtitle: 'Welcome & daily rhythm', icon: Home },
  {
    label: 'Our Story',
    href: '/our-story',
    subtitle: 'Inside Bhupa Greens campus',
    icon: BookOpen,
  },
  {
    label: 'Gallery',
    href: '/gallery',
    subtitle: 'Dining room reels & photos',
    icon: Camera,
  },
  {
    label: 'Journal',
    href: '/journal',
    subtitle: 'Stories from our kitchen',
    icon: Feather,
  },
  {
    label: 'Find Us',
    href: '/find-us',
    subtitle: '3D globe, map & directions',
    icon: MapPin,
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { openMenuBook } = useMenuBookModal();
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const mobileOpen = openForPath === pathname;

  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const toggleMobile = () => {
    setOpenForPath((prev) => (prev === pathname ? null : pathname));
  };

  const closeMobile = () => {
    setOpenForPath(null);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav">
      <div className="mx-auto flex h-16 sm:h-20 md:h-[86px] max-w-6xl items-center justify-between gap-3 lg:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Enlarged Interactive Brand Logo */}
        <Link
          href="/"
          onClick={closeMobile}
          aria-label="Katha by Bhupa Greens Home"
          className="interactive-logo relative flex shrink-0 items-center py-1"
        >
          <Image
            src={SITE_CONFIG.logos.katha}
            alt="Katha by Bhupa Greens"
            width={220}
            height={102}
            priority
            referrerPolicy="no-referrer"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-5 lg:gap-7"
        >
          {NAV_LINKS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group font-menu relative py-1.5 text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.05] ${
                  active
                    ? 'text-[#774D78]'
                    : 'text-[#2A1C2B]/85 hover:text-[#774D78]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-[#774D78] origin-left transition-transform duration-300 ease-out ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Desktop View Menu + Redesigned Compact Smartphone Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openMenuBook()}
            className="interactive-btn font-menu hidden md:inline-flex items-center justify-center gap-2 rounded-lg bg-[#774D78] px-4 lg:px-5 py-2.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#5D3A5E]"
          >
            <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
            View Menu
          </button>

          {/* Direct 1-Tap Menu Book Button on Smartphone */}
          <button
            type="button"
            onClick={() => {
              closeMobile();
              openMenuBook();
            }}
            className="interactive-btn font-menu inline-flex md:hidden h-10 items-center justify-center gap-1.5 rounded-xl bg-[#774D78] px-3.5 text-[11px] font-semibold text-white whitespace-nowrap shrink-0 shadow-sm hover:bg-[#5D3A5E]"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Menu
          </button>

          <button
            type="button"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#774D78]/20 bg-white/85 text-[#2A1C2B] md:hidden transition-colors hover:bg-white shadow-sm"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Redesigned Smartphone Navigation Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Scrim Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              aria-hidden="true"
              className="fixed inset-0 top-16 z-40 bg-[#1F1520]/45 backdrop-blur-sm md:hidden"
            />

            <motion.nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-3 top-[72px] bottom-3 z-50 flex flex-col justify-between gap-5 overflow-y-auto rounded-2xl border border-[#774D78]/20 bg-[#FBF7EE]/98 p-4 sm:p-5 shadow-2xl md:hidden"
            >
              <div className="space-y-4">
                {/* Featured Interactive Menu Book Card */}
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    openMenuBook();
                  }}
                  className="interactive-btn w-full text-left flex items-center justify-between gap-3 rounded-xl border border-[#AF8EB1]/30 bg-gradient-to-r from-[#241626] via-[#3A213C] to-[#774D78] p-4 text-white shadow-lg"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[#F1E3C4]">
                      <BookOpen className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-menu text-sm font-semibold text-white">
                        Open Menu Book
                      </p>
                      <p className="text-xs text-[#F1E3C4]/90 truncate">
                        Flip page by page through all dishes
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#F1E3C4] shrink-0" aria-hidden="true" />
                </button>

                {/* Spacious Tactile Navigation Rows */}
                <div className="space-y-1.5">
                  <p className="font-menu px-1 text-[11px] font-semibold text-[#774D78]">
                    Explore Katha
                  </p>
                  <div className="space-y-1.5">
                    {NAV_LINKS.map((item) => {
                      const active = isActive(item.href);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className={`flex min-h-[54px] items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                            active
                              ? 'bg-[#774D78]/12 border border-[#774D78]/25 text-[#774D78]'
                              : 'border border-transparent bg-white/65 text-[#2A1C2B] hover:border-[#774D78]/18 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span
                              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                active
                                  ? 'bg-[#774D78] text-white'
                                  : 'bg-[#F1E3C4]/55 text-[#774D78]'
                              }`}
                            >
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <p className="font-menu text-xs font-semibold leading-tight">
                                {item.label}
                              </p>
                              <p className="text-[11px] text-[#635364] truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <ArrowRight
                            className={`h-3.5 w-3.5 shrink-0 ${
                              active ? 'text-[#774D78]' : 'text-[#635364]/75'
                            }`}
                            aria-hidden="true"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Smartphone Quick Table Actions */}
              <div className="space-y-3 border-t border-[#774D78]/15 pt-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={SITE_CONFIG.phoneHref}
                    className="interactive-btn inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#774D78] px-3 py-2.5 text-xs font-medium text-white hover:bg-[#5D3A5E]"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    Book Table
                  </a>
                  <a
                    href={SITE_CONFIG.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-btn inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-[#774D78]/20 bg-white px-3 py-2.5 text-xs font-medium text-[#2A1C2B] hover:border-[#774D78]"
                  >
                    <FaWhatsapp className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#635364] tabular-nums">
                  <Clock className="h-3 w-3 text-[#774D78]" aria-hidden="true" />
                  <span>Open every day · {SITE_CONFIG.hours}</span>
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  COOKIE_EVENT,
  getCookieConsent,
  saveCookieConsent,
} from '@/lib/cookies';

export default function CookieConsentModal() {
  const [open, setOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferencesEnabled, setPreferencesEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const existing = getCookieConsent();
    let timer: number | undefined;

    if (!existing) {
      // Reveal right after the initial brand loader finishes
      timer = window.setTimeout(() => {
        setOpen(true);
      }, 950);
    }

    const onConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail === null) {
        setShowCustomize(false);
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    window.addEventListener(COOKIE_EVENT, onConsentChange);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener(COOKIE_EVENT, onConsentChange);
    };
  }, []);

  const handleAcceptAll = () => {
    saveCookieConsent({
      status: 'accepted',
      preferences: true,
      analytics: true,
    });
    setOpen(false);
  };

  const handleEssentialOnly = () => {
    saveCookieConsent({
      status: 'essential',
      preferences: false,
      analytics: false,
    });
    setOpen(false);
  };

  const handleSaveCustom = () => {
    saveCookieConsent({
      status:
        preferencesEnabled && analyticsEnabled
          ? 'accepted'
          : !preferencesEnabled && !analyticsEnabled
            ? 'essential'
            : 'custom',
      preferences: preferencesEnabled,
      analytics: analyticsEnabled,
    });
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1F1520]/45 backdrop-blur-sm p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-2xl border border-[#774D78]/25 bg-[#FBF7EE]/96 p-6 sm:p-7 shadow-2xl shadow-[#1F1520]/30 backdrop-blur-xl space-y-5"
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#774D78]">
                <Cookie className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="section-eyebrow">Cookie Preferences</span>
              </div>
              <h2
                id="cookie-consent-title"
                className="font-serif text-2xl sm:text-3xl font-medium text-[#2A1C2B] leading-tight"
              >
                We use cookies for a smoother visit
              </h2>
              <p className="text-sm leading-relaxed text-[#635364]">
                Katha by Bhupa Greens uses essential cookies to keep pages fast and reliable, plus optional preference cookies to remember your choices. Read our{' '}
                <Link
                  href="/cookie-policy"
                  onClick={() => setOpen(false)}
                  className="font-medium text-[#774D78] underline underline-offset-2 hover:text-[#5D3A5E]"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            {/* Optional Custom Preferences Drawer */}
            {showCustomize && (
              <div className="space-y-3 rounded-xl border border-[#774D78]/15 bg-white/75 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#2A1C2B] inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#3E6B64]" aria-hidden="true" />
                      Essential Cookies
                    </p>
                    <p className="text-xs text-[#635364]">
                      Required for site navigation and form security.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#3E6B64] shrink-0">
                    Always on
                  </span>
                </div>

                <label className="flex cursor-pointer items-center justify-between gap-3 border-t border-[#774D78]/10 pt-3">
                  <div>
                    <p className="font-medium text-[#2A1C2B]">Preferences</p>
                    <p className="text-xs text-[#635364]">
                      Remembers your menu and viewing preferences.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferencesEnabled}
                    onChange={(e) => setPreferencesEnabled(e.target.checked)}
                    className="h-4 w-4 accent-[#774D78] rounded cursor-pointer"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between gap-3 border-t border-[#774D78]/10 pt-3">
                  <div>
                    <p className="font-medium text-[#2A1C2B]">Analytics</p>
                    <p className="text-xs text-[#635364]">
                      Helps us understand which menu sections visitors love.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="h-4 w-4 accent-[#774D78] rounded cursor-pointer"
                  />
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-1">
              {showCustomize ? (
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#774D78] px-5 py-3 text-sm font-medium text-white hover:bg-[#5D3A5E] transition-colors"
                >
                  Save Preferences
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#774D78] px-5 py-3 text-sm font-medium text-white hover:bg-[#5D3A5E] transition-colors"
                >
                  Accept Cookies
                </button>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="inline-flex items-center justify-center rounded-lg border border-[#774D78]/25 bg-white/85 px-4 py-2.5 text-xs sm:text-sm font-medium text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78] transition-colors"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomize((prev) => !prev)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#774D78]/20 bg-[#F1E3C4]/50 px-4 py-2.5 text-xs sm:text-sm font-medium text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78] transition-colors"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                  {showCustomize ? 'Hide Options' : 'Manage'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

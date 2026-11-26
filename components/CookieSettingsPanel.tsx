'use client';

import { useSyncExternalStore } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import {
  COOKIE_EVENT,
  clearCookieConsent,
  getCookieConsent,
  saveCookieConsent,
} from '@/lib/cookies';

type ConsentStatusSnapshot = 'loading' | 'none' | 'accepted' | 'essential' | 'custom';

function subscribeToCookies(callback: () => void) {
  window.addEventListener(COOKIE_EVENT, callback);
  return () => window.removeEventListener(COOKIE_EVENT, callback);
}

function getClientConsentSnapshot(): ConsentStatusSnapshot {
  const consent = getCookieConsent();
  return consent ? consent.status : 'none';
}

function getServerConsentSnapshot(): ConsentStatusSnapshot {
  return 'loading';
}

export default function CookieSettingsPanel() {
  const status = useSyncExternalStore(
    subscribeToCookies,
    getClientConsentSnapshot,
    getServerConsentSnapshot
  );

  const statusText =
    status === 'loading'
      ? 'Checking browser cookie settings...'
      : status === 'none'
        ? 'Not yet chosen'
        : status === 'accepted'
          ? 'All cookies accepted'
          : status === 'custom'
            ? 'Custom preferences saved'
            : 'Essential cookies only';

  const hasSavedChoice =
    status === 'accepted' || status === 'custom' || status === 'essential';

  return (
    <div className="glass-sage rounded-2xl p-6 sm:p-7 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-[0.04em] text-[#774D78]">
            Your Current Cookie Choice
          </p>
          <p className="inline-flex items-center gap-2 font-serif text-2xl font-medium text-[#2A1C2B]">
            {hasSavedChoice && (
              <CheckCircle2 className="h-5 w-5 text-[#3E6B64]" aria-hidden="true" />
            )}
            <span>{statusText}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              saveCookieConsent({
                status: 'accepted',
                preferences: true,
                analytics: true,
              })
            }
            className="rounded-lg bg-[#774D78] px-4 py-2 text-xs font-medium text-white hover:bg-[#5D3A5E] transition-colors"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={() =>
              saveCookieConsent({
                status: 'essential',
                preferences: false,
                analytics: false,
              })
            }
            className="rounded-lg border border-[#774D78]/25 bg-white/85 px-4 py-2 text-xs font-medium text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78] transition-colors"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => clearCookieConsent()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#774D78]/20 bg-white/60 px-3.5 py-2 text-xs font-medium text-[#635364] hover:text-[#2A1C2B] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset Choice
          </button>
        </div>
      </div>
    </div>
  );
}

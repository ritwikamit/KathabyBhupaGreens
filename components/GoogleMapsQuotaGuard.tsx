'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gm_authFailure?: () => void;
    __kathaGmpQuotaTapInstalled?: boolean;
  }
}

export default function GoogleMapsQuotaGuard() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const triggerQuotaEvent = () => {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    };

    if (!window.__kathaGmpQuotaTapInstalled) {
      window.__kathaGmpQuotaTapInstalled = true;

      const prevAuthFailure = window.gm_authFailure;
      window.gm_authFailure = () => {
        if (typeof prevAuthFailure === 'function') {
          prevAuthFailure();
        }
        triggerQuotaEvent();
      };

      const origError = console.error;
      console.error = (...args: unknown[]) => {
        origError.apply(console, args);
        const msg = args.map((a) => String(a)).join(' ');
        if (
          msg.includes('OverQuotaMapError') ||
          msg.includes('QuotaExceededError')
        ) {
          triggerQuotaEvent();
        }
      };
    }

    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };

    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  if (!quotaExceeded) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
      <span>
        Google Maps Platform quota reached. If you are the app owner, visit{' '}
        <a
          href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-amber-950 hover:text-amber-800"
        >
          maps developer site
        </a>{' '}
        for instructions to update your account.
      </span>
    </div>
  );
}

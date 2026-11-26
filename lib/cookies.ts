export interface CookiePreferences {
  essential: true;
  preferences: boolean;
  analytics: boolean;
  status: 'accepted' | 'essential' | 'custom';
  updatedAt: string;
}

const CONSENT_COOKIE = 'katha_cookie_consent';
const PREFS_COOKIE = 'katha_cookie_prefs';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

export const COOKIE_EVENT = 'katha:cookie-consent-change';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

function writeCookie(name: string, value: string, maxAge = MAX_AGE_SECONDS): void {
  if (typeof document === 'undefined') return;
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

export function getCookieConsent(): CookiePreferences | null {
  const status = readCookie(CONSENT_COOKIE);
  if (!status) return null;

  const rawPrefs = readCookie(PREFS_COOKIE);
  if (rawPrefs) {
    try {
      const parsed = JSON.parse(rawPrefs) as Partial<CookiePreferences>;
      return {
        essential: true,
        preferences: Boolean(parsed.preferences),
        analytics: Boolean(parsed.analytics),
        status:
          status === 'accepted' || status === 'custom' ? status : 'essential',
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    } catch {
      // Fallback below
    }
  }

  return {
    essential: true,
    preferences: status === 'accepted',
    analytics: status === 'accepted',
    status: status === 'accepted' ? 'accepted' : 'essential',
    updatedAt: new Date().toISOString(),
  };
}

export function saveCookieConsent(prefs: Omit<CookiePreferences, 'essential' | 'updatedAt'>): CookiePreferences {
  const next: CookiePreferences = {
    essential: true,
    preferences: prefs.preferences,
    analytics: prefs.analytics,
    status: prefs.status,
    updatedAt: new Date().toISOString(),
  };

  writeCookie(CONSENT_COOKIE, next.status);
  writeCookie(PREFS_COOKIE, JSON.stringify(next));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COOKIE_EVENT, { detail: next }));
  }

  return next;
}

export function clearCookieConsent(): void {
  writeCookie(CONSENT_COOKIE, '', 0);
  writeCookie(PREFS_COOKIE, '', 0);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COOKIE_EVENT, { detail: null }));
  }
}

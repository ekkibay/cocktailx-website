/**
 * Meta Pixel helper — typed, centralised, einwilligungsgesteuert.
 *
 * Der Pixel lädt ausschließlich nach aktiver Einwilligung. Ohne Einwilligung wird
 * kein Script nachgeladen und kein Event gesendet, auch kein PageView.
 *
 * Plausible läuft davon unabhängig weiter: cookielos, ohne personenbezogene
 * Speicherung, deshalb nicht einwilligungspflichtig.
 */

export const META_PIXEL_ID = "1475856023819696";

/** Einzige Quelle für den gespeicherten Einwilligungsstand. */
export const CONSENT_KEY = "meta_pixel_consent";
export type ConsentState = "granted" | "denied" | null;

/* ── Consent ─────────────────────────────────────────────────────────── */

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    // localStorage kann blockiert sein (Private Mode, Policies). Dann gilt:
    // keine Einwilligung nachweisbar, also kein Tracking.
    return null;
  }
}

export function hasConsent(): boolean {
  return readConsent() === "granted";
}

function writeConsent(state: Exclude<ConsentState, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, state);
  } catch {
    /* Speichern nicht möglich: Banner erscheint erneut, getrackt wird trotzdem nicht. */
  }
}

export function grantConsent() {
  if (typeof window === "undefined") return;
  writeConsent("granted");
  loadPixel();
}

export function revokeConsent() {
  if (typeof window === "undefined") return;
  writeConsent("denied");
  // Bereits geladener Pixel wird stillgelegt und seine Cookies entfernt.
  pixelLoaded = false;
  try {
    delete (window as unknown as Record<string, unknown>).fbq;
    delete (window as unknown as Record<string, unknown>)._fbq;
  } catch {
    /* nicht löschbar, trackEvent() blockt trotzdem über hasConsent() */
  }
  for (const name of ["_fbp", "_fbc"]) {
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname.replace(/^www\./, "")}`;
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }
}

/* ── Pixel loader ────────────────────────────────────────────────────── */

let pixelLoaded = false;

export function loadPixel() {
  if (typeof window === "undefined" || pixelLoaded) return;
  if (!hasConsent()) return;

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
  pixelLoaded = true;
}

/* ── Event tracker ───────────────────────────────────────────────────── */

type StandardEvent =
  | "PageView"
  | "ViewContent"
  | "InitiateCheckout"
  | "AddToCart"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration"
  | "Search";

/**
 * Fire a Meta Pixel event. Ohne Einwilligung passiert nichts.
 */
export function trackEvent(event: StandardEvent, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  if (!hasConsent()) return;
  if (!window.fbq) return;

  if (params) {
    window.fbq("track", event, params);
  } else {
    window.fbq("track", event);
  }
}

/* ── TypeScript global augmentation ──────────────────────────────────── */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

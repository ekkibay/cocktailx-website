/**
 * Meta Pixel helper — DSGVO-safe, typed, centralised.
 *
 * The base pixel (PageView) is loaded via <MetaPixel /> in the root layout.
 * Use `trackEvent()` from anywhere to fire standard or custom events.
 */

export const META_PIXEL_ID = "1475856023819696";

/* ── Consent helpers ─────────────────────────────────────────────────── */

const CONSENT_KEY = "meta_pixel_consent";

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "granted";
}

export function grantConsent() {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, "granted");
  // Initialise pixel now that we have consent
  loadPixel();
}

export function revokeConsent() {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, "denied");
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
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );
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
 * Fire a Meta Pixel event. Only fires if consent has been granted.
 *
 * @param event   Standard Meta event name
 * @param params  Optional event parameters (value, currency, content_name …)
 */
export function trackEvent(
  event: StandardEvent,
  params?: Record<string, string | number | boolean>
) {
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

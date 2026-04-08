/**
 * Meta Pixel helper — typed, centralised.
 *
 * The base pixel (PageView) is loaded via <MetaPixel /> in the root layout.
 * Use `trackEvent()` from anywhere to fire standard or custom events.
 *
 * TODO: Add cookie consent banner and re-enable consent gating.
 */

export const META_PIXEL_ID = "1475856023819696";

/* ── Consent helpers ─────────────────────────────────────────────────── */

/**
 * Always returns true for now — no cookie banner implemented yet.
 * Re-enable localStorage check once a consent banner is added.
 */
export function hasConsent(): boolean {
  return typeof window !== "undefined";
}

export function grantConsent() {
  if (typeof window === "undefined") return;
  loadPixel();
}

export function revokeConsent() {
  // TODO: implement when cookie banner is added
}

/* ── Pixel loader ────────────────────────────────────────────────────── */

let pixelLoaded = false;

export function loadPixel() {
  if (typeof window === "undefined" || pixelLoaded) return;

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
 * Fire a Meta Pixel event.
 *
 * @param event   Standard Meta event name
 * @param params  Optional event parameters (value, currency, content_name …)
 */
export function trackEvent(
  event: StandardEvent,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
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

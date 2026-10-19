/**
 * Google Analytics 4 / Google Ads, μόνο μετά από συγκατάθεση του επισκέπτη.
 *
 * Τίποτα δεν φορτώνεται αν δεν οριστούν τα αναγνωριστικά στις μεταβλητές
 * περιβάλλοντος (βλ. .env.example και ODIGOS-ANAZITISI-DIAFIMISI.md):
 *   VITE_GA_MEASUREMENT_ID          π.χ. G-XXXXXXXXXX
 *   VITE_GOOGLE_ADS_ID              π.χ. AW-123456789
 *   VITE_GOOGLE_ADS_LEAD_LABEL      ετικέτα μετατροπής «αίτημα προσφοράς»
 *   VITE_GOOGLE_ADS_CALL_LABEL      ετικέτα μετατροπής «κλήση από το site»
 */

type ConsentChoice = "granted" | "denied";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const CONSENT_KEY = "kt-cookie-consent";

const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
const adsId = import.meta.env.VITE_GOOGLE_ADS_ID?.trim() ?? "";
const adsLeadLabel = import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL?.trim() ?? "";
const adsCallLabel = import.meta.env.VITE_GOOGLE_ADS_CALL_LABEL?.trim() ?? "";

export const analyticsEnabled = Boolean(gaId || adsId);

let loaded = false;

export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Χωρίς αποθήκευση η ερώτηση θα εμφανιστεί ξανά στην επόμενη επίσκεψη.
  }
  if (choice === "granted") loadGoogleTag();
}

export function clearConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // ignore
  }
}

/** Φορτώνει το Google tag (gtag.js) μία φορά, αφού δοθεί συγκατάθεση. */
export function loadGoogleTag() {
  if (loaded || !analyticsEnabled || typeof window === "undefined") return;
  loaded = true;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("consent", "default", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  w.gtag("js", new Date());
  if (gaId) w.gtag("config", gaId);
  if (adsId) w.gtag("config", adsId);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId || adsId)}`;
  document.head.appendChild(script);
}

function send(...args: unknown[]) {
  const w = window as GtagWindow;
  if (loaded && w.gtag) w.gtag(...args);
}

/** Νέα σελίδα στο SPA. */
export function trackPageView(path: string) {
  if (gaId) send("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
}

/** Επιτυχής αποστολή της φόρμας αιτήματος προσφοράς. */
export function trackLead() {
  send("event", "generate_lead", { form: "quote" });
  if (adsId && adsLeadLabel) send("event", "conversion", { send_to: `${adsId}/${adsLeadLabel}` });
}

/** Πάτημα σε τηλέφωνο (tel:). */
export function trackCallClick(phone: string) {
  send("event", "click_to_call", { phone });
  if (adsId && adsCallLabel) send("event", "conversion", { send_to: `${adsId}/${adsCallLabel}` });
}

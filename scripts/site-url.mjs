/**
 * Η κύρια διεύθυνση του site (canonical, sitemap, Open Graph).
 *
 * Σειρά προτεραιότητας:
 *   1. VITE_SITE_URL από μεταβλητή περιβάλλοντος (Vercel / GitHub), αν οριστεί.
 *   2. Στο production build του Vercel: το domain της επιχείρησης.
 *   3. Η προεπιλογή του αρχείου .env (το αντίγραφο στο GitHub Pages).
 *
 * Στα preview deployments του Vercel το site σημειώνεται noindex, ώστε να μην
 * εμφανίζονται διπλές σελίδες στη Google.
 */
export const PRODUCTION_SITE_URL = "https://www.kataskeuastiki-tenton.com";

export function applySiteUrl() {
  const env = process.env;
  if (!env.VITE_SITE_URL) {
    if (env.VERCEL_ENV === "production") env.VITE_SITE_URL = PRODUCTION_SITE_URL;
    else if (env.VERCEL_ENV === "preview" && env.VERCEL_URL) env.VITE_SITE_URL = `https://${env.VERCEL_URL}`;
  }
  return { noindex: env.VERCEL_ENV === "preview" };
}

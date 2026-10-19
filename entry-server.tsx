/**
 * Είσοδος για το prerender στο build: δημιουργεί το HTML κάθε σελίδας ώστε
 * οι μηχανές αναζήτησης να βλέπουν περιεχόμενο, τίτλο και περιγραφή χωρίς
 * να χρειάζεται να τρέξουν JavaScript. Βλ. scripts/prerender.mjs.
 */
import { renderToString } from "react-dom/server";
import App, { getPageSeo, prerenderRoutes, seoFaqs } from "./App";

export function render(path: string) {
  return renderToString(<App initialPath={path} />);
}

export { getPageSeo, prerenderRoutes, seoFaqs };

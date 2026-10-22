/**
 * Μετά το build: γράφει ένα αρχείο HTML για κάθε σελίδα (με δικό της τίτλο,
 * περιγραφή, canonical, Open Graph και structured data), το 404.html, το
 * sitemap.xml και το robots.txt.
 *
 * Η διεύθυνση του site έρχεται από τη VITE_SITE_URL (αρχείο .env ή μεταβλητές
 * περιβάλλοντος στο Vercel / GitHub).
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnv } from "vite";
import { applySiteUrl } from "./site-url.mjs";

const root = resolve(".");
const { noindex } = applySiteUrl();
const dist = join(root, "dist");
const env = {
  ...loadEnv(process.env.MODE || "production", root, "VITE_"),
  ...Object.fromEntries(Object.entries(process.env).filter(([, value]) => value)),
};
const siteUrl = (env.VITE_SITE_URL || "").replace(/\/+$/, "");
if (!siteUrl) throw new Error("Λείπει η VITE_SITE_URL (δείτε το .env).");

const server = await import(pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href);
const template = readFileSync(join(dist, "index.html"), "utf8");
const today = new Date().toISOString().slice(0, 10);

const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pageUrl = (path) => (path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`);
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

function setMeta(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`Δεν βρέθηκε στο index.html: ${pattern}`);
  return html.replace(pattern, (match, before, _old, after) => `${before}${escapeHtml(value)}${after}`);
}

function verificationTags() {
  const tags = [];
  if (env.VITE_GOOGLE_SITE_VERIFICATION) {
    tags.push(`<meta name="google-site-verification" content="${escapeHtml(env.VITE_GOOGLE_SITE_VERIFICATION)}" />`);
  }
  if (env.VITE_BING_SITE_VERIFICATION) {
    tags.push(`<meta name="msvalidate.01" content="${escapeHtml(env.VITE_BING_SITE_VERIFICATION)}" />`);
  }
  return tags.join("\n    ");
}

function structuredData(path, seo) {
  const blocks = [];
  if (path !== "/") {
    const crumbs = [{ name: "Αρχική", path: "/" }];
    const segments = path.split("/").filter(Boolean);
    let current = "";
    for (const segment of segments) {
      current += `/${segment}`;
      if (server.prerenderRoutes.includes(current)) crumbs.push({ name: server.getPageSeo(current).heading, path: current });
    }
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: pageUrl(crumb.path),
      })),
    });
  } else {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: server.seoFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }
  blocks.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: pageUrl(path),
    inLanguage: "el-GR",
  });
  return blocks.map(jsonLd).join("\n    ");
}

function renderPage(path) {
  const seo = server.getPageSeo(path);
  const url = pageUrl(path);
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`);
  html = setMeta(html, /(<meta\s+name="description"\s+content=")([^"]*)("[^>]*>)/, seo.description);
  html = setMeta(html, /(<link rel="canonical" href=")([^"]*)(")/, url);
  html = setMeta(html, /(<meta property="og:url" content=")([^"]*)(")/, url);
  html = setMeta(html, /(<meta property="og:title" content=")([^"]*)(")/, seo.title);
  html = setMeta(html, /(<meta\s+property="og:description"\s+content=")([^"]*)("[^>]*>)/, seo.description);
  html = setMeta(html, /(<meta name="twitter:title" content=")([^"]*)(")/, seo.title);
  html = setMeta(html, /(<meta\s+name="twitter:description"\s+content=")([^"]*)("[^>]*>)/, seo.description);
  const robotsTag = noindex ? '<meta name="robots" content="noindex" />' : "";
  html = html.replace("</head>", `    ${[robotsTag, verificationTags(), structuredData(path, seo)].filter(Boolean).join("\n    ")}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${server.render(path)}</div>`);
  return html;
}

function write(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

const routes = server.prerenderRoutes;
for (const path of routes) {
  const html = renderPage(path);
  if (path === "/") {
    write(join(dist, "index.html"), html);
    continue;
  }
  // /pergkotentes -> pergkotentes.html (καθαρά URL στο Vercel και στο GitHub Pages).
  write(join(dist, `${path.slice(1)}.html`), html);
  // Σελίδες με υποσελίδες έχουν και φάκελο, οπότε γράφουμε και index.html μέσα του.
  if (routes.some((other) => other.startsWith(`${path}/`))) write(join(dist, path.slice(1), "index.html"), html);
}

// 404: η εφαρμογή δείχνει «Η σελίδα δεν βρέθηκε» και οι μηχανές δεν το ευρετηριάζουν.
write(
  join(dist, "404.html"),
  template
    .replace(/<title>[^<]*<\/title>/, "<title>Η σελίδα δεν βρέθηκε | Κατασκευαστική Τεντών</title>")
    .replace("</head>", '    <meta name="robots" content="noindex" />\n  </head>'),
);

const priority = (path) => (path === "/" ? "1.0" : path === "/politiki-aporritou" ? "0.2" : path.split("/").length > 2 ? "0.7" : "0.8");
write(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((path) => `  <url>\n    <loc>${pageUrl(path)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority(path)}</priority>\n  </url>`)
    .join("\n")}\n</urlset>\n`,
);
write(
  join(dist, "robots.txt"),
  noindex ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`Prerendered ${routes.length} pages for ${siteUrl} (+404.html, sitemap.xml, robots.txt).`);

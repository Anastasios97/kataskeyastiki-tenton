/**
 * Μετατρέπει το παλιό αντίγραφο του GitHub Pages σε ανακατευθύνσεις προς το
 * κύριο domain, ώστε η Google να μη βλέπει δύο ίδιες ιστοσελίδες.
 *
 * Διαβάζει το dist/sitemap.xml (χτισμένο με VITE_SITE_URL = κύριο domain) και
 * γράφει στο φάκελο εξόδου μία μικρή σελίδα για κάθε διεύθυνση, με canonical
 * και άμεση ανακατεύθυνση στην αντίστοιχη σελίδα του domain (η Google την
 * αντιμετωπίζει ως μόνιμη μεταφορά).
 *
 * Χρήση: node scripts/pages-redirect.mjs <φάκελος εξόδου>
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const outDir = process.argv[2];
if (!outDir) throw new Error("Usage: node scripts/pages-redirect.mjs <outDir>");

const sitemap = readFileSync("dist/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length === 0) throw new Error("dist/sitemap.xml has no URLs");

const origin = new URL(urls[0]).origin;

const escape = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const page = (target) => `<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8" />
<title>Η σελίδα μεταφέρθηκε</title>
<link rel="canonical" href="${escape(target)}" />
<meta http-equiv="refresh" content="0; url=${escape(target)}" />
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head>
<body>
<p>Η ιστοσελίδα μεταφέρθηκε στο <a href="${escape(target)}">${escape(target)}</a>.</p>
</body>
</html>
`;

rmSync(outDir, { recursive: true, force: true });

const write = (file, html) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

for (const url of urls) {
  const route = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  if (route === "") {
    write(join(outDir, "index.html"), page(url));
  } else {
    write(join(outDir, `${route}.html`), page(url));
    write(join(outDir, route, "index.html"), page(url));
  }
}

// Άγνωστες ή παλιές διευθύνσεις: κρατάμε τη διαδρομή μετά το όνομα του αποθετηρίου.
write(
  join(outDir, "404.html"),
  `<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8" />
<title>Η σελίδα μεταφέρθηκε</title>
<meta name="robots" content="noindex" />
<script>
var parts = location.pathname.split("/").filter(Boolean);
if (location.hostname.endsWith(".github.io") && parts.length) parts.shift();
var path = parts.join("/").replace(/\\.html$/, "").replace(/\\/index$/, "");
location.replace(${JSON.stringify(origin)} + "/" + path + location.search + location.hash);
</script>
</head>
<body>
<p>Η ιστοσελίδα μεταφέρθηκε στο <a href="${origin}/">${origin}/</a>.</p>
</body>
</html>
`,
);

console.log(`GitHub Pages redirects: ${urls.length} pages -> ${origin}`);

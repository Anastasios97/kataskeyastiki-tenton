// Εμφανίζει πόσες φωτογραφίες έχει κάθε φάκελος του photos/ και
// προειδοποιεί για αρχεία που δεν θα εμφανιστούν στην ιστοσελίδα.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const photosDir = join(root, "photos");
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const ignored = new Set([".md", ".gitkeep"]);
const config = readFileSync(join(root, "photos.ts"), "utf8");
const albums = [...config.matchAll(/folder:\s*"([^"]+)",\s*\n\s*title:\s*"([^"]+)"/g)].map(
  ([, folder, title]) => ({ folder, title }),
);

let problems = 0;
let total = 0;

console.log("\nΦωτογραφίες ανά φάκελο\n");

for (const { folder, title } of albums) {
  const dir = join(photosDir, folder);
  if (!existsSync(dir)) {
    console.log(`✗ photos/${folder}/ δεν υπάρχει (${title})`);
    problems += 1;
    continue;
  }

  const entries = readdirSync(dir, { withFileTypes: true });
  const photos = entries.filter((entry) => entry.isFile() && supported.has(extname(entry.name).toLowerCase()));
  const unsupported = entries.filter(
    (entry) => entry.isFile() && !supported.has(extname(entry.name).toLowerCase()) && !ignored.has(extname(entry.name).toLowerCase()),
  );
  const subfolders = entries.filter((entry) => entry.isDirectory());
  const cover = photos.find((entry) => /(kentriki|κεντρικ|cover|hero)/i.test(entry.name)) ?? photos[0];

  total += photos.length;
  const count = String(photos.length).padStart(3);
  console.log(`${count}  photos/${folder}/  ${title}${cover ? `  (κεντρική: ${cover.name})` : "  (άδειος: μόλις ανεβάσετε φωτογραφίες θα εμφανιστούν)"}`);

  for (const entry of photos) {
    const size = statSync(join(dir, entry.name)).size;
    if (size > 15 * 1024 * 1024) {
      console.log(`      ! ${entry.name}: ${(size / 1024 / 1024).toFixed(1)} MB, πολύ μεγάλο αρχείο`);
    }
  }
  for (const entry of unsupported) {
    problems += 1;
    const hint = /\.hei[cf]$/i.test(entry.name)
      ? "HEIC από iPhone: μετατροπή σε JPG (ή στο iPhone: Ρυθμίσεις → Κάμερα → Μορφές → Πιο συμβατή)"
      : "μη υποστηριζόμενη μορφή, χρησιμοποιήστε JPG, PNG ή WebP";
    console.log(`      ✗ ${entry.name}: ${hint}`);
  }
  for (const entry of subfolders) {
    problems += 1;
    console.log(`      ✗ ${entry.name}/: οι υποφάκελοι αγνοούνται, βάλτε τις φωτογραφίες απευθείας στον φάκελο`);
  }
}

console.log(`\nΣύνολο: ${total} φωτογραφίες σε ${albums.length} φακέλους.`);
if (problems) {
  console.log(`Βρέθηκαν ${problems} αρχεία/φάκελοι που δεν θα εμφανιστούν.\n`);
  process.exitCode = 1;
} else {
  console.log("Όλα εντάξει.\n");
}

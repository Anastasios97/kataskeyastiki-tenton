import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "image-slots.json"), "utf8"));
const slots = [];

function collect(value, key = "") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${key}.${index + 1}`));
    return;
  }

  if (value && typeof value === "object" && "local" in value) {
    slots.push({ key, ...value });
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([name, child]) => {
      collect(child, key ? `${key}.${name}` : name);
    });
  }
}

collect(manifest);

const available = [];
const missing = [];

for (const slot of slots) {
  const file = join(root, "public", slot.local.replace(/^\//, ""));
  (existsSync(file) ? available : missing).push({ ...slot, file });
}

console.log(`\nΦωτογραφίες διαθέσιμες: ${available.length}/${slots.length}\n`);

if (missing.length) {
  console.log("Λείπουν οι παρακάτω φωτογραφίες. Το site χρησιμοποιεί προσωρινά fallback:\n");
  for (const slot of missing) {
    console.log(`- ${slot.key}`);
    console.log(`  public${slot.local}`);
    console.log(`  ${slot.recommended}`);
  }
}

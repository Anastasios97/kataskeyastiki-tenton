import { existsSync, readFileSync, statSync } from "node:fs";
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
const invalid = [];
const warnings = [];

function readUint24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function getJpegSize(buffer) {
  let offset = 2;
  const markers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (markers.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }

  return null;
}

function getWebpSize(buffer) {
  if (buffer.length < 30) return null;
  const chunk = buffer.toString("ascii", 12, 16);

  if (chunk === "VP8X") {
    return {
      width: readUint24LE(buffer, 24) + 1,
      height: readUint24LE(buffer, 27) + 1,
    };
  }

  if (chunk === "VP8 " && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunk === "VP8L" && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return null;
}

function inspectImage(file) {
  const buffer = readFileSync(file);

  if (buffer.length < 16) {
    return { ok: false, reason: "Το αρχείο είναι πολύ μικρό για έγκυρη εικόνα." };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    const size = getJpegSize(buffer);
    return size ? { ok: true, type: "jpeg", ...size } : { ok: false, reason: "Δεν διαβάστηκαν διαστάσεις JPEG." };
  }

  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return {
      ok: true,
      type: "png",
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    const size = getWebpSize(buffer);
    return size ? { ok: true, type: "webp", ...size } : { ok: false, reason: "Δεν διαβάστηκαν διαστάσεις WebP." };
  }

  return { ok: false, reason: "Το αρχείο δεν αναγνωρίστηκε ως JPEG, PNG ή WebP." };
}

for (const slot of slots) {
  const file = join(root, "public", slot.local.replace(/^\//, ""));
  if (!existsSync(file)) {
    missing.push({ ...slot, file });
    continue;
  }

  const info = inspectImage(file);
  if (!info.ok) {
    invalid.push({ ...slot, file, reason: info.reason });
    continue;
  }

  const bytes = statSync(file).size;
  const record = { ...slot, ...info, bytes, file };
  available.push(record);

  if (bytes > 750_000) {
    warnings.push(record);
  }
}

console.log(`\nΦωτογραφίες διαθέσιμες: ${available.length}/${slots.length}\n`);

if (missing.length) {
  console.log("Λείπουν οι παρακάτω φωτογραφίες:\n");
  for (const slot of missing) {
    console.log(`- ${slot.key}`);
    console.log(`  public${slot.local}`);
    console.log(`  ${slot.recommended}`);
  }
}

if (invalid.length) {
  console.log("\nΤα παρακάτω αρχεία υπάρχουν αλλά δεν διαβάζονται ως έγκυρες εικόνες:\n");
  for (const slot of invalid) {
    console.log(`- ${slot.key}`);
    console.log(`  public${slot.local}`);
    console.log(`  ${slot.reason}`);
  }
}

if (available.length) {
  const totalBytes = available.reduce((sum, image) => sum + image.bytes, 0);
  const totalMb = (totalBytes / 1024 / 1024).toFixed(2);
  const largest = [...available].sort((a, b) => b.bytes - a.bytes).slice(0, 5);

  console.log(`Συνολικό βάρος εικόνων: ${totalMb} MB`);
  console.log("Μεγαλύτερα αρχεία:");
  for (const image of largest) {
    console.log(
      `- ${image.key}: ${image.width}×${image.height}, ${(image.bytes / 1024).toFixed(0)} KB, ${image.type}`,
    );
  }
}

if (warnings.length) {
  console.log("\nΠροσοχή: υπάρχουν εικόνες πάνω από 750 KB. Δεν αποτυγχάνει ο έλεγχος, αλλά αξίζει μελλοντική συμπίεση.");
}

if (missing.length || invalid.length) {
  process.exitCode = 1;
}

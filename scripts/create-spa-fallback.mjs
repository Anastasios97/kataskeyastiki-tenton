import { copyFileSync } from "node:fs";
import { join } from "node:path";

const indexPath = join("dist", "index.html");
const fallbackPath = join("dist", "404.html");

copyFileSync(indexPath, fallbackPath);
console.log("Created dist/404.html for GitHub Pages SPA routing.");

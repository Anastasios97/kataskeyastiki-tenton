import imageSlots from "./image-slots.json";

export type SiteImage = {
  local: string;
  fallback: string;
  alt: string;
  recommended: string;
};

const appBasePath = import.meta.env.BASE_URL || "/";
const appBasePrefix = appBasePath === "/" ? "" : appBasePath.replace(/\/$/, "");

function assetPath(path: string) {
  if (!path.startsWith("/")) return path;
  return `${appBasePrefix}${path}`;
}

function withAssetBase(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withAssetBase);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        key === "local" && typeof item === "string" ? assetPath(item) : withAssetBase(item),
      ]),
    );
  }

  return value;
}

export const media = withAssetBase(imageSlots) as typeof imageSlots;

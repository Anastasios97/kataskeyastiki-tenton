import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { getMetadata, setMetadata } from "imagetools-core";
import { imagetools } from "vite-imagetools";

declare const process: {
  env: Record<string, string | undefined>;
};

const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    // Οι φωτογραφίες του φακέλου photos/ μικραίνουν και γίνονται WebP στο build.
    imagetools({
      // Οι φωτογραφίες κινητού έχουν τον προσανατολισμό στα EXIF: τις
      // γυρίζουμε σωστά πριν αφαιρεθούν τα μεταδεδομένα.
      extendTransforms: (builtins) => [
        () => (image) => {
          const orientation = Number(getMetadata(image, "orientation") ?? 1);
          if (orientation >= 5) {
            const width = getMetadata(image, "width");
            setMetadata(image, "width", getMetadata(image, "height"));
            setMetadata(image, "height", width);
          }
          return image.rotate();
        },
        ...builtins,
      ],
      removeMetadata: true,
      cache: { enabled: true, dir: "node_modules/.cache/imagetools" },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});

import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(__dirname, "../..");

export default defineConfig({
  cacheDir: path.resolve(__dirname, ".vite-cache"),
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@arron/abuilder/styles.css",
        replacement: path.resolve(
          monorepoRoot,
          "packages/abuilder/dist/styles.css"
        ),
      },
      {
        find: "@arron/abuilder",
        replacement: path.resolve(monorepoRoot, "packages/abuilder/src/index.ts"),
      },
      {
        find: "@arron/ui/styles.css",
        replacement: path.resolve(monorepoRoot, "packages/ui/dist/styles.css"),
      },
      {
        find: "@arron/react-view/styles.css",
        replacement: path.resolve(
          monorepoRoot,
          "packages/react-view/dist/styles.css"
        ),
      },
      {
        find: "@arron/ui",
        replacement: path.resolve(monorepoRoot, "packages/ui/index.ts"),
      },
      {
        find: "@arron/react-view",
        replacement: path.resolve(
          monorepoRoot,
          "packages/react-view/src/index.ts"
        ),
      },
      {
        find: "@arron/react-blueprint",
        replacement: path.resolve(
          monorepoRoot,
          "packages/react-blueprint/index.ts"
        ),
      },
      {
        find: "@arron/blueprint-dsl",
        replacement: path.resolve(
          monorepoRoot,
          "packages/blueprint-dsl/src/index.ts"
        ),
      },
      {
        find: "@arron/rx-store",
        replacement: path.resolve(monorepoRoot, "packages/rx-store/src/index.ts"),
      },
    ],
  },
  server: {
    port: 31011,
    fs: {
      allow: [monorepoRoot],
    },
  },
});

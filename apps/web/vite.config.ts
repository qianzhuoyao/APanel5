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
        find: "@arronqzy/abuilder/styles.css",
        replacement: path.resolve(
          monorepoRoot,
          "packages/abuilder/dist/styles.css"
        ),
      },
      {
        find: "@arronqzy/abuilder",
        replacement: path.resolve(monorepoRoot, "packages/abuilder/src/index.ts"),
      },
      {
        find: "@arronqzy/ui/styles.css",
        replacement: path.resolve(monorepoRoot, "packages/ui/dist/styles.css"),
      },
      {
        find: "@arronqzy/react-view/styles.css",
        replacement: path.resolve(
          monorepoRoot,
          "packages/react-view/dist/styles.css"
        ),
      },
      {
        find: "@arronqzy/ui",
        replacement: path.resolve(monorepoRoot, "packages/ui/index.ts"),
      },
      {
        find: "@arronqzy/react-view",
        replacement: path.resolve(
          monorepoRoot,
          "packages/react-view/src/index.ts"
        ),
      },
      {
        find: "@arronqzy/react-blueprint",
        replacement: path.resolve(
          monorepoRoot,
          "packages/react-blueprint/index.ts"
        ),
      },
      {
        find: "@arronqzy/blueprint-dsl",
        replacement: path.resolve(
          monorepoRoot,
          "packages/blueprint-dsl/src/index.ts"
        ),
      },
      {
        find: "@arronqzy/rx-store",
        replacement: path.resolve(monorepoRoot, "packages/rx-store/src/index.ts"),
      },
      {
        find: "@arronqzy/view-table",
        replacement: path.resolve(
          monorepoRoot,
          "packages/view-table/src/index.ts"
        ),
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

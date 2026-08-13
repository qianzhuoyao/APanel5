import path from "node:path";
import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(__dirname, "../..");

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@arronqzy/abuilder-vue",
        replacement: path.resolve(monorepoRoot, "packages/abuilder-vue/src/index.ts"),
      },
      {
        find: "@arronqzy/vue-view",
        replacement: path.resolve(monorepoRoot, "packages/vue-view/src/index.ts"),
      },
      {
        find: "@arronqzy/vue-blueprint",
        replacement: path.resolve(monorepoRoot, "packages/vue-blueprint/src/index.ts"),
      },
      {
        find: "@arronqzy/vue-rx-store",
        replacement: path.resolve(monorepoRoot, "packages/vue-rx-store/src/index.ts"),
      },
      {
        find: "@arronqzy/rx-store",
        replacement: path.resolve(monorepoRoot, "packages/rx-store/src/index.ts"),
      },
      {
        find: "@arronqzy/blueprint-dsl",
        replacement: path.resolve(monorepoRoot, "packages/blueprint-dsl/src/index.ts"),
      },
      {
        find: "@arronqzy/view-table",
        replacement: path.resolve(monorepoRoot, "packages/view-table/src/index.ts"),
      },
    ],
  },
  server: {
    port: 31012,
    fs: { allow: [monorepoRoot] },
  },
});

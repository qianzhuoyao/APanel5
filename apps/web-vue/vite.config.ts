import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, type Plugin } from "vite";
import { abuilderVue } from "@arronqzy/abuilder-vue/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(__dirname, "../..");
const scene3dNodeModules = path.resolve(
  monorepoRoot,
  "packages/view-scene3d/node_modules"
);
/**
 * React / Veaury 优先走可写的 .vendor（monorepo node_modules 可能为 root 所有、无法 pnpm install）。
 * 避免 view-scene3d 内 React 19 与本应用 React 18 双实例。
 */
const vendorDir = path.resolve(monorepoRoot, ".vendor/node_modules");
const webReact = path.resolve(vendorDir, "react");
const webReactDom = path.resolve(vendorDir, "react-dom");
const i18nSrc = path.resolve(monorepoRoot, "packages/i18n/src");

const scene3dRuntimePackages = [
  "@react-three/fiber",
  "@react-three/drei",
  "@react-three/postprocessing",
  "@react-three/a11y",
  "@react-three/xr",
  "@react-three/flex",
  "@react-three/csg",
  "@react-three/cannon",
  "@react-three/rapier",
  "@react-three/p2",
  "@react-three/gpu-pathtracer",
  "@react-spring/three",
  "@use-gesture/react",
  "postprocessing",
  "valtio",
  "leva",
  "maath",
  "miniplex",
  "lamina",
  "three-stdlib",
];

const scene3dPkgAliases = scene3dRuntimePackages.map((pkg) => ({
  find: pkg,
  replacement: path.resolve(scene3dNodeModules, pkg),
}));

const abuilderStylesCss = path.resolve(
  monorepoRoot,
  "packages/abuilder/dist/styles.css"
);
const uiStylesCss = path.resolve(monorepoRoot, "packages/ui/dist/styles.css");
const reactViewStylesCss = path.resolve(
  monorepoRoot,
  "packages/react-view/dist/styles.css"
);

const cssBuildTargets = [
  {
    file: uiStylesCss,
    cwd: path.resolve(monorepoRoot, "packages/ui"),
  },
  {
    file: path.resolve(
      monorepoRoot,
      "packages/react-blueprint/dist/blueprint.css"
    ),
    cwd: path.resolve(monorepoRoot, "packages/react-blueprint"),
  },
  {
    file: reactViewStylesCss,
    cwd: path.resolve(monorepoRoot, "packages/react-view"),
  },
  {
    file: abuilderStylesCss,
    cwd: path.resolve(monorepoRoot, "packages/abuilder"),
  },
] as const;

function ensureWorkspaceCss() {
  for (const { file, cwd } of cssBuildTargets) {
    if (fs.existsSync(file)) continue;
    execSync("pnpm run build:css", { cwd, stdio: "inherit" });
  }
}

function ensureWorkspaceCssPlugin(): Plugin {
  return {
    name: "ensure-workspace-css",
    enforce: "pre",
    config() {
      ensureWorkspaceCss();
    },
  };
}

function resolveWorkspaceStylesPlugin(): Plugin {
  const styleImports = new Map<string, string>([
    ["@arronqzy/abuilder/styles.css", abuilderStylesCss],
    ["@arronqzy/abuilder-vue/styles.css", abuilderStylesCss],
    ["@arronqzy/ui/styles.css", uiStylesCss],
    ["@arronqzy/react-view/styles.css", reactViewStylesCss],
  ]);

  return {
    name: "resolve-workspace-styles",
    enforce: "pre",
    resolveId(id) {
      const target = styleImports.get(id);
      if (!target) return null;
      if (!fs.existsSync(target)) {
        const buildTarget = cssBuildTargets.find((item) => item.file === target);
        if (buildTarget) {
          execSync("pnpm run build:css", {
            cwd: buildTarget.cwd,
            stdio: "inherit",
          });
        }
      }
      return target;
    },
  };
}

export default defineConfig({
  cacheDir: path.resolve(__dirname, ".vite-cache"),
  plugins: [
    ensureWorkspaceCssPlugin(),
    resolveWorkspaceStylesPlugin(),
    // 与 React 宿主对称：一站式插件（内含 Veaury + 可选 AI），宿主不再直接碰 veaury。
    ...abuilderVue(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "three", "@arronqzy/i18n", "vue"],
    alias: [
      { find: /^react$/, replacement: webReact },
      {
        find: /^react\/jsx-runtime$/,
        replacement: path.join(webReact, "jsx-runtime.js"),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: path.join(webReact, "jsx-dev-runtime.js"),
      },
      { find: /^react-dom$/, replacement: webReactDom },
      {
        find: /^react-dom\/client$/,
        replacement: path.join(webReactDom, "client.js"),
      },
      {
        find: "@arronqzy/i18n/react",
        replacement: path.join(i18nSrc, "react/index.ts"),
      },
      {
        find: "@arronqzy/i18n/vue",
        replacement: path.join(i18nSrc, "vue/index.ts"),
      },
      {
        find: "@arronqzy/i18n",
        replacement: path.join(i18nSrc, "index.ts"),
      },
      {
        find: "@arronqzy/abuilder-vue/styles.css",
        replacement: abuilderStylesCss,
      },
      {
        find: "@arronqzy/abuilder-vue/vite",
        replacement: path.resolve(monorepoRoot, "packages/abuilder-vue/vite.js"),
      },
      {
        find: "@arronqzy/abuilder-vue",
        replacement: path.resolve(
          monorepoRoot,
          "packages/abuilder-vue/src/index.ts"
        ),
      },
      {
        find: "@arronqzy/abuilder/styles.css",
        replacement: abuilderStylesCss,
      },
      {
        find: /^@arronqzy\/abuilder$/,
        replacement: path.resolve(monorepoRoot, "packages/abuilder/src/index.ts"),
      },
      {
        find: "@arronqzy/abuilder/vite",
        replacement: path.resolve(monorepoRoot, "packages/abuilder/src/vite.ts"),
      },
      {
        find: "@arronqzy/ui/styles.css",
        replacement: uiStylesCss,
      },
      {
        find: "@arronqzy/react-view/styles.css",
        replacement: reactViewStylesCss,
      },
      {
        find: /^@arronqzy\/ui$/,
        replacement: path.resolve(monorepoRoot, "packages/ui/index.ts"),
      },
      {
        find: /^@arronqzy\/react-view$/,
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
        find: "@arronqzy/view-scene3d/react/ecosystem",
        replacement: path.resolve(
          monorepoRoot,
          "packages/view-scene3d/src/react/ecosystem.ts"
        ),
      },
      {
        find: "@arronqzy/view-scene3d/react",
        replacement: path.resolve(
          monorepoRoot,
          "packages/view-scene3d/src/react/index.ts"
        ),
      },
      {
        find: "@arronqzy/view-scene3d/vue",
        replacement: path.resolve(
          monorepoRoot,
          "packages/view-scene3d/src/vue/Scene3dNodeContent.vue"
        ),
      },
      {
        find: "@arronqzy/view-scene3d",
        replacement: path.resolve(
          monorepoRoot,
          "packages/view-scene3d/src/index.ts"
        ),
      },
      {
        find: "@arronqzy/view-table",
        replacement: path.resolve(
          monorepoRoot,
          "packages/view-table/src/index.ts"
        ),
      },
      {
        find: "@arronqzy/webllm-assistant/vite",
        replacement: path.resolve(
          monorepoRoot,
          "packages/webllm-assistant/src/vite-plugin.ts"
        ),
      },
      {
        find: "@arronqzy/webllm-assistant",
        replacement: path.resolve(
          monorepoRoot,
          "packages/webllm-assistant/src/index.ts"
        ),
      },
      {
        find: "@mlc-ai/web-llm",
        replacement: path.resolve(
          monorepoRoot,
          "packages/webllm-assistant/vendor/bundled/web-llm/lib/index.js"
        ),
      },
      {
        find: /^three$/,
        replacement: path.resolve(
          monorepoRoot,
          "packages/view-scene3d/node_modules/three"
        ),
      },
      {
        find: /^three\//,
        replacement:
          path.resolve(monorepoRoot, "packages/view-scene3d/node_modules/three") +
          "/",
      },
      ...scene3dPkgAliases,
    ],
  },
  server: {
    port: 31012,
    fs: {
      allow: [monorepoRoot],
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
    },
  },
  optimizeDeps: {
    exclude: ["@mlc-ai/web-llm"],
    include: ["three", "veaury", ...scene3dRuntimePackages],
  },
  build: {
    commonjsOptions: {
      exclude: [/@mlc-ai\/web-llm/, /node_modules[\\/]\.pnpm[\\/]@mlc-ai\+web-llm/],
    },
  },
  worker: {
    format: "es",
  },
});

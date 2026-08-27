import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import postcssImport from "postcss-import";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const monorepoRoot = path.resolve(pkgRoot, "../..");
const entry = path.join(pkgRoot, "src/entry.css");
const outDir = path.join(pkgRoot, "dist");
const outFile = path.join(outDir, "styles.css");

function findXyflowStyleCss() {
  const pnpmDir = path.join(monorepoRoot, "node_modules/.pnpm");
  const match = fs
    .readdirSync(pnpmDir)
    .find((name) => name.startsWith("@xyflow+react@"));
  if (!match) {
    throw new Error("Cannot find @xyflow/react in pnpm store");
  }
  return path.join(
    pnpmDir,
    match,
    "node_modules/@xyflow/react/dist/style.css"
  );
}

function resolvePackageCss(id) {
  if (id === "@arronqzy/ui/styles.css") {
    return path.join(monorepoRoot, "packages/ui/dist/styles.css");
  }
  if (id === "@arronqzy/react-view/styles.css") {
    return path.join(monorepoRoot, "packages/react-view/dist/styles.css");
  }
  if (id === "@arronqzy/react-blueprint/blueprint.css") {
    const distCss = path.join(
      monorepoRoot,
      "packages/react-blueprint/dist/blueprint.css"
    );
    if (fs.existsSync(distCss)) return distCss;
    return path.join(monorepoRoot, "packages/react-blueprint/src/blueprint.css");
  }
  if (id === "@xyflow/react/dist/style.css") {
    return findXyflowStyleCss();
  }
  return null;
}

const css = fs.readFileSync(entry, "utf8");
const result = await postcss([
  postcssImport({
    resolve(id) {
      const resolved = resolvePackageCss(id);
      if (resolved) return resolved;
      return id;
    },
  }),
]).process(css, {
  from: entry,
  to: outFile,
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, result.css);

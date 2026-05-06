import fs from "node:fs/promises";
import path from "node:path";

const REGISTRY_BASE = "https://ui.shadcn.com/r/styles/default";

/**
 * 说明：
 * - 不使用 `shadcn add`，避免触发 pnpm 安装依赖（你当前 node_modules 权限有残留会失败）
 * - 直接从 shadcn registry 拉取组件源码并写入 packages/ui/src/components/ui
 */

const componentNames = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "hover-card",
  "input",
  "input-otp",
  "label",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "sonner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
  // 注意：registry 里 `combobox.json` 缺失，会导致 add --all 失败；这里故意不包含 combobox
];

function isObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function normalizeEol(s) {
  return s.replace(/\r\n/g, "\n");
}

async function writeFileEnsured(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    const err = new Error(`Fetch failed ${res.status} ${url}\n${msg}`);
    err.status = res.status;
    throw err;
  }
  return await res.json();
}

function mapRegistryPathToLocal(filePath) {
  // registry 通常是 `components/ui/*.tsx`、`lib/utils.ts` 等
  // 我们把它统一落到 `packages/ui/src/` 下面，避免污染根目录结构
  if (filePath.startsWith("components/")) return path.join("src", filePath);
  if (filePath.startsWith("lib/")) return path.join("src", filePath);
  return path.join("src", filePath);
}

async function main() {
  const root = path.resolve(process.cwd(), "packages/ui");
  const written = new Set();
  const exportedUiModules = new Set();

  for (const name of componentNames) {
    const url = `${REGISTRY_BASE}/${name}.json`;
    try {
      const item = await fetchJson(url);
      if (!isObject(item) || !Array.isArray(item.files)) {
        throw new Error(`Invalid registry item shape for ${name}`);
      }

      for (const f of item.files) {
        if (!f?.path || typeof f.path !== "string" || typeof f.content !== "string") continue;
        const rel = mapRegistryPathToLocal(f.path);
        const abs = path.join(root, rel);
        await writeFileEnsured(abs, normalizeEol(f.content));
        written.add(rel);

        if (rel.startsWith("src/components/ui/") && rel.endsWith(".tsx")) {
          const mod = "./" + path.basename(rel, ".tsx");
          exportedUiModules.add(mod);
        }
      }
      // eslint-disable-next-line no-console
      console.log(`synced: ${name}`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`skip: ${name} (${e?.status ?? "err"})`);
    }
  }

  // 生成 ui barrel：src/components/ui/index.ts
  const uiIndexPath = path.join(root, "src/components/ui/index.ts");
  const exports = Array.from(exportedUiModules)
    .sort()
    .map((m) => `export * from "${m}";`)
    .join("\n");
  await writeFileEnsured(uiIndexPath, exports + "\n");

  // eslint-disable-next-line no-console
  console.log(`done. files: ${written.size}`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


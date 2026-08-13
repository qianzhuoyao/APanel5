import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Functional tests: compile to CJS via local typescript, then require.
 * Falls back to structural file check if tsc is unavailable.
 */
async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const pkgRoot = path.resolve(root, "..");
  const tscCandidates = [
    path.join(pkgRoot, "node_modules/typescript/bin/tsc"),
    path.join(pkgRoot, "../react-view/node_modules/typescript/bin/tsc"),
    path.join(pkgRoot, "../../node_modules/typescript/bin/tsc"),
  ];

  const { spawnSync } = await import("node:child_process");
  const { mkdtempSync, existsSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");

  const tsc = tscCandidates.find((p) => existsSync(p));
  if (!tsc) {
    for (const f of [
      "types.ts",
      "index.ts",
      "condition/evaluate.ts",
      "transform/transformToTable.ts",
      "resolve/resolveDisplay.ts",
      "cache/lru.ts",
    ]) {
      if (!existsSync(path.join(root, f))) throw new Error(`missing ${f}`);
    }
    console.log("view-table structural check passed (no tsc)");
    return;
  }

  const outDir = mkdtempSync(path.join(tmpdir(), "view-table-test-"));
  const r = spawnSync(
    tsc,
    [
      "-p",
      path.join(pkgRoot, "tsconfig.json"),
      "--noEmit",
      "false",
      "--outDir",
      outDir,
      "--module",
      "CommonJS",
      "--moduleResolution",
      "node",
      "--declaration",
      "false",
    ],
    { encoding: "utf8" }
  );
  if (r.status !== 0) {
    console.error(r.stdout || r.stderr);
    throw new Error("tsc failed");
  }

  const require = createRequire(import.meta.url);
  const {
    transformToTable,
    resolveCellDisplay,
    evaluateCondition,
    transformToTableCached,
    createDefaultTableConfig,
    resolveRawTableInput,
    isUsableTableRawData,
  } = require(path.join(outDir, "index.js"));

  const records = transformToTable(
    [
      { name: "A", status: "ok", n: 1 },
      { name: "B", status: "bad", n: 2 },
    ],
    {
      columns: [
        { field: "name", title: "名称" },
        {
          field: "status",
          widget: "tag",
          valueMap: [{ when: { op: "eq", value: "ok" }, value: "正常" }],
        },
      ],
    }
  );
  if (records.rows.length !== 2) throw new Error("rows");
  const cell = resolveCellDisplay(records.rows[0], records.columns[1], {
    columns: records.columns,
  });
  if (cell.text !== "正常") throw new Error(`valueMap ${cell.text}`);
  if (
    !evaluateCondition(
      { op: "gt", field: "n", value: 0 },
      { row: records.rows[0].values, value: 1 }
    )
  ) {
    throw new Error("condition");
  }
  const cfg = createDefaultTableConfig();
  if (!cfg.rowsText || !String(cfg.rowsText).includes("Alpha")) {
    throw new Error("default rowsText missing");
  }
  const staticRaw = resolveRawTableInput(cfg);
  if (!isUsableTableRawData(staticRaw)) throw new Error("static raw");
  // empty dynamic falls back to static
  const fallback = resolveRawTableInput(cfg, []);
  if (JSON.stringify(fallback) !== JSON.stringify(staticRaw)) {
    throw new Error("empty dynamic should fall back to static");
  }
  const dynamic = [{ name: "Dyn" }];
  const dynRaw = resolveRawTableInput(cfg, dynamic);
  if (dynRaw !== dynamic) throw new Error("dynamic should win");
  const a = transformToTableCached(staticRaw, cfg);
  const b = transformToTableCached(staticRaw, cfg);
  if (a !== b) throw new Error("lru");

  const big = Array.from({ length: 10000 }, (_, i) => ({
    name: `r${i}`,
    status: i % 2 ? "ok" : "bad",
    score: i % 100,
  }));
  const t0 = performance.now();
  const bigTable = transformToTable(big, {
    columns: [
      { field: "name" },
      { field: "status", widget: "tag" },
      { field: "score", widget: "progress", widgetProps: { max: 100 } },
    ],
  });
  const t1 = performance.now();
  if (bigTable.rows.length !== 10000) throw new Error("big rows");
  console.log(`view-table tests passed (10k transform ${(t1 - t0).toFixed(1)}ms)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

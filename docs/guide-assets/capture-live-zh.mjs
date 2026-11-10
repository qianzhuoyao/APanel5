/**
 * 重截 docs/guide-assets/live-zh 中文实机图（1440×900）。
 * 关键：拖入后必须点选画布，等到右侧出现「节点信息」再截「配置」类图。
 * 用法：node docs/guide-assets/capture-live-zh.mjs [baseUrl]
 */
import { chromium } from "../../.vendor/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "live-zh");
const ANN = __dirname;
const BASE = process.argv[2] || "http://127.0.0.1:31011/";
const VIEW = { width: 1440, height: 900 };

fs.mkdirSync(OUT, { recursive: true });

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, type: "png" });
  console.log("✓", name);
}

async function ensureZh(page) {
  await page.evaluate(() => {
    try {
      localStorage.setItem("abuilder.locale", "zh-CN");
    } catch {}
  });
}

async function clickMenu(page, name) {
  await page.getByRole("menuitem", { name, exact: true }).click();
  await page.waitForTimeout(350);
}

async function closeMenus(page) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}

async function openCategory(page, labelPrefix) {
  const combo = page.getByRole("combobox").first();
  await combo.click();
  await page.waitForTimeout(250);
  const opt = page.getByRole("option").filter({ hasText: labelPrefix }).first();
  if (await opt.count()) {
    await opt.click();
  } else {
    await page
      .locator(
        '[role="option"], [role="menuitem"], [data-radix-collection-item]'
      )
      .filter({ hasText: labelPrefix })
      .first()
      .click({ force: true });
  }
  await page.waitForTimeout(400);
}

async function dragMaterial(page, materialName) {
  const src = page
    .getByRole("button", { name: materialName, exact: true })
    .first();
  await src.waitFor({ state: "visible", timeout: 15000 });
  const box = await src.boundingBox();
  const target = { x: VIEW.width * 0.5, y: VIEW.height * 0.42 };
  if (!box) throw new Error(`no bbox for ${materialName}`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 20 });
  await page.mouse.up();
  await page.waitForTimeout(700);
}

/** Soft UI：拖入后未必保持选中，点画布中心直到配置侧栏出现节点信息。 */
async function selectOnCanvas(page) {
  for (let i = 0; i < 4; i++) {
    await page.mouse.click(VIEW.width * 0.5, VIEW.height * 0.42);
    await page.waitForTimeout(350);
    const empty = await page.getByText("暂无可配置节点").count();
    const info = await page.getByText("节点信息").count();
    if (info > 0 && empty === 0) return true;
  }
  return false;
}

async function dragAndSelect(page, materialName) {
  await dragMaterial(page, materialName);
  const ok = await selectOnCanvas(page);
  if (!ok) console.warn("WARN: select failed after", materialName);
  return ok;
}

async function expandConfigGroup(page, label) {
  const row = page.getByText(label, { exact: false }).first();
  if (await row.count()) {
    await row.click().catch(() => {});
    await page.waitForTimeout(250);
  }
}

async function copyAsAnnotated(liveName, annName) {
  const src = path.join(OUT, liveName);
  const dst = path.join(ANN, annName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log("↻ annotated", annName, "←", liveName);
  }
}

async function freshPage(context) {
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 120000 });
  await ensureZh(page);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.getByRole("menuitem", { name: "文件" }).waitFor({ timeout: 30000 });
  return page;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEW,
    deviceScaleFactor: 1,
    locale: "zh-CN",
  });

  let page = await freshPage(context);

  // —— 空画布总览 ——
  await shot(page, "01-overview.png");

  // —— 菜单 ——
  await clickMenu(page, "文件");
  await shot(page, "50-menu-file.png");
  await closeMenus(page);

  await clickMenu(page, "编辑");
  await shot(page, "50b-menu-edit.png");
  await closeMenus(page);

  await clickMenu(page, "视图");
  await shot(page, "50d-menu-view.png");
  await closeMenus(page);

  await clickMenu(page, "蓝图");
  await shot(page, "50e-menu-blueprint.png");
  await closeMenus(page);

  await clickMenu(page, "设置");
  await shot(page, "50c-menu-settings.png");
  const about = page.getByText("关于", { exact: false }).first();
  if (await about.count()) {
    await about.click().catch(() => {});
    await page.waitForTimeout(400);
    await shot(page, "51-settings-version.png");
  }
  await closeMenus(page);

  // —— 物料分类 ——
  await openCategory(page, "图表");
  await shot(page, "05-materials-charts.png");

  await openCategory(page, "基础");
  await shot(page, "05b-materials-basic.png");

  await openCategory(page, "媒体");
  await shot(page, "05c-materials-media.png");

  // 物料搜索
  await openCategory(page, "图表");
  await page.getByPlaceholder(/搜索物料/).fill("图");
  await page.waitForTimeout(400);
  await shot(page, "20-search-materials.png");
  await page.getByPlaceholder(/搜索物料/).fill("");
  await page.waitForTimeout(200);

  // —— 柱状图 + 选中配置 ——
  await openCategory(page, "图表");
  await dragAndSelect(page, "柱状图");
  await shot(page, "03-config-chart-full.png");
  await shot(page, "06-config-chart-top.png");

  await expandConfigGroup(page, "数据");
  await page.mouse.wheel(0, 280);
  await page.waitForTimeout(300);
  await shot(page, "06b-config-chart-data.png");

  await expandConfigGroup(page, "图表配置 / 高级");
  await page.mouse.wheel(0, 420);
  await page.waitForTimeout(300);
  await shot(page, "06c-config-chart-more.png");
  await page.mouse.wheel(0, -900);
  await page.waitForTimeout(200);

  // 配置搜索
  const cfgSearch = page.getByPlaceholder(/搜索配置/);
  await cfgSearch.fill("边框");
  await page.waitForTimeout(400);
  await shot(page, "22-search-config.png");
  await cfgSearch.fill("");
  await page.waitForTimeout(200);

  // 节点树
  await page.getByRole("tab", { name: "节点树" }).click();
  await page.waitForTimeout(400);
  await shot(page, "15-node-tree.png");
  const treeSearch = page.getByPlaceholder(/搜索节点/);
  if (await treeSearch.count()) {
    await treeSearch.fill("柱");
    await page.waitForTimeout(350);
    await shot(page, "23-node-tree-search.png");
    await treeSearch.fill("");
  }
  await page.getByRole("tab", { name: "物料" }).click();
  await page.waitForTimeout(200);

  // 图层栏（有选中节点时）
  await shot(page, "14-layers.png");
  await shot(page, "24-layers-bar.png");

  // 命名产物
  const title = page.getByPlaceholder(/构建产物名称|产物名称|未命名/);
  if (await title.count()) {
    await title.fill("演示看板");
  } else {
    // Soft UI 可能是普通 input
    const nameInput = page.locator('input[value="未命名产物"], input').filter({
      has: page.locator("xpath=."),
    });
    const candidates = page.locator("input");
    const n = await candidates.count();
    for (let i = 0; i < n; i++) {
      const el = candidates.nth(i);
      const val = await el.inputValue().catch(() => "");
      if (val.includes("未命名") || val === "") {
        const box = await el.boundingBox();
        if (box && box.y < 120 && box.x > 200 && box.x < 700) {
          await el.fill("演示看板");
          break;
        }
      }
    }
  }
  await page.waitForTimeout(300);
  await shot(page, "16-named.png");

  // 右键：节点
  await selectOnCanvas(page);
  await page.mouse.click(VIEW.width * 0.5, VIEW.height * 0.42, {
    button: "right",
  });
  await page.waitForTimeout(400);
  await shot(page, "26-canvas-context-node.png");
  await closeMenus(page);

  // 空白右键
  await page.mouse.click(VIEW.width * 0.78, VIEW.height * 0.55, {
    button: "right",
  });
  await page.waitForTimeout(400);
  await shot(page, "26b-canvas-context-blank.png");
  await closeMenus(page);

  // —— 文本（新页，避免画布过乱）——
  await page.close();
  page = await freshPage(context);
  await openCategory(page, "基础");
  await dragAndSelect(page, "文本");
  await shot(page, "07-text-full.png");
  await shot(page, "07b-config-text.png");
  await expandConfigGroup(page, "文字样式");
  await page.mouse.wheel(0, 360);
  await page.waitForTimeout(250);
  await shot(page, "07c-config-text-style.png");
  await page.mouse.wheel(0, -500);

  // —— 表格 ——
  await page.close();
  page = await freshPage(context);
  await openCategory(page, "基础");
  await dragAndSelect(page, "表格");
  await shot(page, "09-table-full.png");
  await shot(page, "09b-config-table.png");

  for (const [label, file] of [
    ["列", "09c-config-table-cols.png"],
    ["外观", "09d-config-table-appearance.png"],
  ]) {
    const tab = page
      .locator("button, [role=tab], label, div")
      .filter({ hasText: new RegExp(`^${label}$|^步骤.*${label}|${label}`) })
      .first();
    if (await tab.count()) {
      await tab.click().catch(() => {});
      await page.waitForTimeout(400);
    }
    await shot(page, file);
  }

  // —— 各物料配置（每类单独选中）——
  // Soft UI：图片在「基础」；媒体仅音频/视频
  const materialShots = [
    ["基础", "图片", "10-config-image.png"],
    ["基础", "几何", "11-config-geometry.png"],
    ["媒体", "音频", "12-config-audio.png"],
    ["媒体", "视频", "13-config-video.png"],
    ["基础", "网格布局", "08-grid-full.png", "08b-config-grid.png"],
    ["基础", "三维", "32-config-3d.png"],
    ["基础", "视窗", "33-config-viewport.png"],
    ["基础", "引用组件", "34-config-reference.png"],
  ];

  for (const [cat, name, file, extra] of materialShots) {
    try {
      await page.close();
      page = await freshPage(context);
      await openCategory(page, cat);
      const btn = page
        .getByRole("button", { name: new RegExp(name.replace("布局", "")) })
        .first();
      if (!(await btn.count())) {
        console.log("skip material", name);
        continue;
      }
      const label =
        ((await btn.innerText()).split("\n")[0] || name).trim() || name;
      await dragAndSelect(page, label);
      await shot(page, file);
      if (extra) await shot(page, extra);
    } catch (e) {
      console.warn("material fail", name, e.message);
    }
  }

  // 饼图 / 仪表盘
  try {
    await page.close();
    page = await freshPage(context);
    await openCategory(page, "图表");
    await dragAndSelect(page, "饼图");
    await shot(page, "30-config-pie.png");

    await page.close();
    page = await freshPage(context);
    await openCategory(page, "图表");
    await dragAndSelect(page, "仪表盘");
    await shot(page, "31-config-gauge.png");
  } catch (e) {
    console.warn("pie/gauge", e.message);
  }

  // 多选：柱状 + Shift 折线
  try {
    await page.close();
    page = await freshPage(context);
    await openCategory(page, "图表");
    await dragAndSelect(page, "柱状图");
    await openCategory(page, "图表");
    await dragMaterial(page, "折线图");
    // 折线可能落在相近位置；Shift 点两处
    await page.keyboard.down("Meta");
    await page.mouse.click(VIEW.width * 0.5, VIEW.height * 0.42);
    await page.mouse.click(VIEW.width * 0.55, VIEW.height * 0.48);
    await page.keyboard.up("Meta");
    await page.keyboard.down("Shift");
    await page.mouse.click(VIEW.width * 0.5, VIEW.height * 0.42);
    await page.mouse.click(VIEW.width * 0.58, VIEW.height * 0.5);
    await page.keyboard.up("Shift");
    await page.waitForTimeout(500);
    await shot(page, "21-multiselect-full.png");
    await shot(page, "21b-multiselect-config.png");
  } catch (e) {
    console.warn("multiselect", e.message);
  }

  // —— 蓝图 ——
  await page.close();
  page = await freshPage(context);
  // 先放一个视图节点，蓝图分屏更有参照
  await openCategory(page, "图表");
  await dragAndSelect(page, "柱状图");
  const title2 = page.locator("input").filter({ hasText: /.*/ });
  // name product
  const inputs = page.locator("input");
  for (let i = 0; i < (await inputs.count()); i++) {
    const el = inputs.nth(i);
    const val = await el.inputValue().catch(() => "");
    if (val.includes("未命名")) {
      await el.fill("演示看板");
      break;
    }
  }

  await page.getByLabel("显示蓝图面板").click();
  await page.locator(".react-flow").last().waitFor({ state: "visible", timeout: 15000 });
  await page.waitForTimeout(600);
  await shot(page, "40-blueprint-open.png");
  await shot(page, "17-blueprint.png");

  // 蓝图顶栏菜单（未命名蓝图旁）
  const bpTitle = page.getByRole("button", { name: /未命名蓝图|蓝图/ }).first();
  if (await bpTitle.count()) {
    await bpTitle.click().catch(() => {});
    await page.waitForTimeout(400);
  }
  await shot(page, "17b-blueprint-menu.png");
  await closeMenus(page);

  async function addBlueprintNode(px, py) {
    const flow = page.locator(".react-flow").last();
    await flow.waitFor({ state: "visible", timeout: 15000 });
    const box = await flow.boundingBox();
    if (!box) throw new Error("no react-flow");
    const x = box.x + box.width * px;
    const y = box.y + box.height * py;
    await page.mouse.click(x, y, { button: "right" });
    await page.waitForTimeout(350);
    const item = page.locator(".bp-context-menu__item").filter({
      hasText: /新增节点|添加节点/,
    });
    await item.first().click();
    await page.waitForTimeout(600);
  }

  await addBlueprintNode(0.35, 0.45);
  await shot(page, "17c-blueprint-node.png");
  await shot(page, "17d-blueprint-clip.png");
  await shot(page, "41-blueprint-nodes.png");

  // 选中蓝图节点看配置
  const bpNode = page.locator(".react-flow__node").first();
  if (await bpNode.count()) {
    await bpNode.click();
    await page.waitForTimeout(500);
  }
  await shot(page, "42-blueprint-node-config.png");

  // 配置类型下拉
  const typeSelect = page
    .locator("label")
    .filter({ hasText: /配置类型|节点类型|类型/ })
    .locator('[role="combobox"], button, select')
    .first();
  if (await typeSelect.count()) {
    await typeSelect.click();
    await page.waitForTimeout(350);
  } else {
    const combo = page.locator(".react-flow ~ * [role=combobox], aside [role=combobox]").first();
    if (await combo.count()) {
      await combo.click().catch(() => {});
      await page.waitForTimeout(350);
    }
  }
  await shot(page, "43-blueprint-type-menu.png");
  await closeMenus(page);

  // 再加几个节点
  await addBlueprintNode(0.6, 0.4).catch(() => {});
  await addBlueprintNode(0.45, 0.7).catch(() => {});
  await shot(page, "41-blueprint-nodes.png");

  // 保存蓝图对话框
  const saveBp = page.getByRole("button", { name: /保存蓝图/ }).first();
  if (await saveBp.count()) {
    await saveBp.click();
    await page.waitForTimeout(500);
    await shot(page, "44-blueprint-save-dialog.png");
    await closeMenus(page);
    await page.keyboard.press("Escape");
  } else {
    // toolbar title save
    const saveIcon = page.getByLabel(/保存蓝图/).first();
    if (await saveIcon.count()) {
      await saveIcon.click();
      await page.waitForTimeout(500);
      await shot(page, "44-blueprint-save-dialog.png");
      await page.keyboard.press("Escape");
    }
  }

  // 日志
  const logTab = page.getByText(/日志|输出|任务/, { exact: false }).first();
  if (await logTab.count()) {
    await logTab.click().catch(() => {});
    await page.waitForTimeout(400);
  }
  await shot(page, "45-blueprint-log.png");
  await shot(page, "45b-blueprint-log-clip.png");

  // Demo 示意：用带节点的蓝图分屏作为示意底图（避免空画布兜底）
  for (const name of [
    "demo-howto-wire.png",
    "demo-a-json-chart.png",
    "demo-b-clock-text.png",
    "demo-c-and-gate.png",
    "demo-d-event-click.png",
    "demo-e-storage.png",
  ]) {
    await shot(page, name);
  }

  // 合并图层
  await page.getByLabel("显示蓝图面板").click().catch(() => {});
  await page.waitForTimeout(500);
  const merge = page.getByLabel("合并图层");
  if (await merge.count()) {
    await merge.click({ force: true }).catch(() => {});
    await page.waitForTimeout(400);
    await shot(page, "25-layers-merge.png");
    await shot(page, "25b-layers-merge-clip.png");
    await closeMenus(page);
  }

  // 标注图：用对应实机图同步（手绘标注后续可再加工）
  copyAsAnnotated("01-overview.png", "fig1-overview-annotated.png");
  copyAsAnnotated("05-materials-charts.png", "fig2-materials-annotated.png");
  copyAsAnnotated("03-config-chart-full.png", "fig2-canvas-chart-annotated.png");
  copyAsAnnotated("03-config-chart-full.png", "fig3-config-annotated.png");
  copyAsAnnotated("06b-config-chart-data.png", "fig-chart-form-annotated.png");
  copyAsAnnotated("07-text-full.png", "fig-text-annotated.png");
  copyAsAnnotated("07b-config-text.png", "fig-text-form-annotated.png");
  copyAsAnnotated("08-grid-full.png", "fig-grid-annotated.png");
  copyAsAnnotated("08b-config-grid.png", "fig-grid-form-annotated.png");
  copyAsAnnotated("17-blueprint.png", "fig4-blueprint-annotated.png");
  copyAsAnnotated("17c-blueprint-node.png", "fig4b-blueprint-node-annotated.png");

  await browser.close();
  console.log("done →", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

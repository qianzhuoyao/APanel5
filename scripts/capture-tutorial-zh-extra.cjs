/**
 * Extra Chinese screenshots: multi-select, layers, blueprint log/save, more configs.
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const out = path.join(__dirname, "../docs/guide-assets/live-zh");
fs.mkdirSync(out, { recursive: true });

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: path.join(out, name), ...opts });
  console.log("shot", name);
}

async function drag(page, label, x, y) {
  const item = page.getByText(label, { exact: true }).first();
  const box = await item.boundingBox();
  if (!box) return false;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y, { steps: 22 });
  await page.mouse.up();
  await page.waitForTimeout(700);
  return true;
}

async function expand(page, titles) {
  for (const t of titles) {
    const loc = page.getByText(t, { exact: true }).first();
    if (await loc.count()) {
      try {
        await loc.click({ force: true, timeout: 600 });
      } catch (_) {}
    }
  }
  await page.waitForTimeout(250);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(28000);
  await page.addInitScript(() => localStorage.setItem("abuilder.locale", "zh-CN"));
  await page.goto("http://localhost:31011/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // --- materials search ---
  const matSearch = page.getByPlaceholder(/搜索物料/).first();
  if (await matSearch.count()) {
    await matSearch.fill("图");
    await page.waitForTimeout(500);
    await shot(page, "20-search-materials.png", { clip: { x: 0, y: 48, width: 300, height: 500 } });
    await matSearch.fill("");
  }

  // drop three nodes for multi-select
  await page.getByText("图表", { exact: true }).first().click();
  await drag(page, "柱状图", 520, 280);
  await drag(page, "折线图", 780, 280);
  await page.getByText("基础", { exact: true }).first().click();
  await drag(page, "文本", 640, 480);

  // select first
  await page.mouse.click(520, 280);
  await page.waitForTimeout(400);
  // shift click second
  await page.keyboard.down("Shift");
  await page.mouse.click(780, 280);
  await page.mouse.click(640, 480);
  await page.keyboard.up("Shift");
  await page.waitForTimeout(900);
  await shot(page, "21-multiselect-full.png");
  await shot(page, "21b-multiselect-config.png", { clip: { x: 1120, y: 48, width: 310, height: 780 } });

  // clear selection - click blank
  await page.mouse.click(1000, 200);
  await page.waitForTimeout(400);

  // config search demo - select chart
  await page.mouse.click(520, 280);
  await page.waitForTimeout(500);
  const cfgSearch = page.getByPlaceholder(/搜索配置/).first();
  if (await cfgSearch.count()) {
    await cfgSearch.fill("边框");
    await page.waitForTimeout(500);
    await shot(page, "22-search-config.png", { clip: { x: 1120, y: 48, width: 310, height: 780 } });
    await cfgSearch.fill("");
  }

  // node tree search
  await page.getByText("节点树", { exact: true }).first().click();
  await page.waitForTimeout(400);
  const nodeSearch = page.getByPlaceholder(/搜索节点/).first();
  if (await nodeSearch.count()) {
    await nodeSearch.fill("柱");
    await page.waitForTimeout(400);
  }
  await shot(page, "23-node-tree-search.png", { clip: { x: 0, y: 48, width: 300, height: 700 } });
  await page.getByText("物料", { exact: true }).first().click();

  // layers: add layer
  const addLayer = page.getByRole("button", { name: /新增|新建|Add/ }).first();
  // try click + near 图层
  const plus = page.locator('text=图层').locator('xpath=ancestor::*[1]//button').first();
  // broader: buttons in layers area
  const layerPlus = page.locator('[aria-label*="新增"], [title*="新增"], button').filter({ hasText: /^\+$|^新建$|^新增/ }).first();
  if (await layerPlus.count()) {
    await layerPlus.click({ force: true });
    await page.waitForTimeout(600);
  } else {
    // click first + icon near bottom
    await page.mouse.click(270, 740);
    await page.waitForTimeout(200);
  }
  await shot(page, "24-layers-bar.png", { clip: { x: 230, y: 700, width: 900, height: 190 } });

  // try merge button
  const mergeBtn = page.getByText("合并", { exact: true }).first();
  if (await mergeBtn.count()) {
    await mergeBtn.click({ force: true });
    await page.waitForTimeout(700);
    await shot(page, "25-layers-merge.png");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  }

  // context menu on node
  await page.mouse.click(520, 280, { button: "right" });
  await page.waitForTimeout(500);
  await shot(page, "26-canvas-context-node.png");
  await page.keyboard.press("Escape");

  // blank context
  await page.mouse.click(1000, 200, { button: "right" });
  await page.waitForTimeout(500);
  await shot(page, "26b-canvas-context-blank.png");
  await page.keyboard.press("Escape");

  // pie / gauge / table advanced clips
  await page.getByText("图表", { exact: true }).first().click();
  await drag(page, "饼图", 400, 560);
  await page.mouse.click(400, 560);
  await expand(page, ["图表配置 / 基础", "系列", "渐变与渲染", "提示框 Tooltip"]);
  await shot(page, "30-config-pie.png", { clip: { x: 1120, y: 48, width: 310, height: 780 } });

  await drag(page, "仪表盘", 900, 560);
  await page.mouse.click(900, 560);
  await expand(page, ["图表配置 / 基础", "系列", "数据"]);
  await shot(page, "31-config-gauge.png", { clip: { x: 1120, y: 48, width: 310, height: 780 } });

  await page.getByText("基础", { exact: true }).first().click();
  await drag(page, "三维", 300, 200);
  await page.mouse.click(300, 200);
  await expand(page, ["三维场景配置", "场景用途", "模型资源", "相机（预览初始）", "交互"]);
  await shot(page, "32-config-3d.png", { clip: { x: 1120, y: 48, width: 310, height: 780 } });

  await drag(page, "视窗", 1100, 400);
  await page.mouse.click(1100, 400);
  await expand(page, ["视窗配置", "引用源", "拷贝策略", "溢出显示"]);
  await shot(page, "33-config-viewport.png", { clip: { x: 1120, y: 48, width: 310, height: 780 } });

  await drag(page, "引用组件", 200, 650);
  await page.mouse.click(200, 650);
  await expand(page, ["引用组件配置", "引用源", "拷贝策略"]);
  await shot(page, "34-config-reference.png", { clip: { x: 1120, y: 48, width: 310, height: 780 } });

  // Blueprint full
  const sw = page.getByRole("switch", { name: /显示蓝图面板/ });
  await sw.click();
  await page.waitForTimeout(900);
  const handles = await page.evaluate(() =>
    [...document.querySelectorAll('[role="separator"]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    })
  );
  const sep = handles.find((h) => h.w > 200 && h.h < 12);
  if (sep) {
    await page.mouse.move(sep.x + sep.w / 2, sep.y + sep.h / 2);
    await page.mouse.down();
    await page.mouse.move(sep.x + sep.w / 2, 380, { steps: 16 });
    await page.mouse.up();
    await page.waitForTimeout(500);
  }
  await shot(page, "40-blueprint-open.png");

  // add several blueprint nodes via right click
  async function addBpNode(x, y) {
    await page.mouse.click(x, y, { button: "right" });
    await page.waitForTimeout(350);
    const add = page.getByText("添加节点").or(page.getByText("新增节点")).first();
    if (await add.isVisible().catch(() => false)) {
      await add.click();
      await page.waitForTimeout(500);
    } else {
      await page.keyboard.press("Escape");
    }
  }
  await addBpNode(500, 560);
  await addBpNode(720, 560);
  await shot(page, "41-blueprint-nodes.png");

  // click a bp node for config
  await page.mouse.click(520, 560);
  await page.waitForTimeout(600);
  await shot(page, "42-blueprint-node-config.png", { clip: { x: 1120, y: 48, width: 310, height: 780 } });

  // open type dropdown if visible
  const typeSel = page.getByText("配置类型").first();
  if (await typeSel.count()) {
    await typeSel.click({ force: true });
    await page.waitForTimeout(200);
    // click nearby combobox
    const combo = page.locator('[role="combobox"]').last();
    if (await combo.count()) await combo.click();
    await page.waitForTimeout(500);
    await shot(page, "43-blueprint-type-menu.png");
    await page.keyboard.press("Escape");
  }

  // try save blueprint
  const saveBp = page.getByRole("button", { name: /保存蓝图|Save blueprint/i }).first();
  if (await saveBp.count()) {
    await saveBp.click({ force: true });
    await page.waitForTimeout(700);
    await shot(page, "44-blueprint-save-dialog.png");
    await page.keyboard.press("Escape");
  } else {
    // floppy near Untitled
    const saveIcon = page.locator('[aria-label*="保存蓝图"], [aria-label*="Save blueprint"]').first();
    if (await saveIcon.count()) {
      await saveIcon.click({ force: true });
      await page.waitForTimeout(700);
      await shot(page, "44-blueprint-save-dialog.png");
      await page.keyboard.press("Escape");
    }
  }

  // task log panel
  const logBtn = page.getByRole("button", { name: /任务输出日志/ }).or(page.getByText("任务输出日志")).first();
  if (await logBtn.count()) {
    await logBtn.click({ force: true });
    await page.waitForTimeout(800);
    await shot(page, "45-blueprint-log.png");
  }

  // menubar settings language already zh - capture file menu
  await page.getByRole("menuitem", { name: "文件" }).click();
  await page.waitForTimeout(400);
  await shot(page, "50-menu-file.png");
  await page.keyboard.press("Escape");
  await page.getByRole("menuitem", { name: "编辑" }).click();
  await page.waitForTimeout(400);
  await shot(page, "50b-menu-edit.png");
  await page.keyboard.press("Escape");
  await page.getByRole("menuitem", { name: "设置" }).click();
  await page.waitForTimeout(400);
  await shot(page, "50c-menu-settings.png");
  await page.keyboard.press("Escape");

  console.log("done", fs.readdirSync(out).length, "files");
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

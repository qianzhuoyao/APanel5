/**
 * Capture Chinese-UI screenshots for beginner manual, especially config forms.
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const out = path.join(__dirname, "../docs/guide-assets/live-zh");
fs.mkdirSync(out, { recursive: true });

async function shot(page, name, opts = {}) {
  const file = path.join(out, name);
  await page.screenshot({ path: file, ...opts });
  console.log("shot", name);
}

async function dragByText(page, label, x, y) {
  const item = page.getByText(label, { exact: true }).first();
  const box = await item.boundingBox();
  if (!box) {
    console.warn("missing material", label);
    return false;
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y, { steps: 28 });
  await page.mouse.up();
  await page.waitForTimeout(900);
  return true;
}

async function clickNear(page, x, y) {
  await page.mouse.click(x, y);
  await page.waitForTimeout(700);
}

async function expandConfigSections(page) {
  // Click collapsed section headers in right panel (buttons/triggers with chevron)
  const panel = page.locator("text=配置面板").first();
  // Try open common groups by text
  const titles = [
    "节点信息",
    "图表配置 / 基础",
    "图表配置 / 高级",
    "文本配置",
    "网格布局配置",
    "表格配置",
    "音频配置",
    "视频配置",
    "图片配置",
    "几何配置",
    "通用样式 / 背景",
    "通用样式 / 边框",
    "数据",
    "基础显示",
    "文本内容",
    "文字样式",
    "网格参数",
    "1. 数据源",
    "2. 列（顺序与宽度）",
    "3. 外观",
  ];
  for (const t of titles) {
    const loc = page.getByText(t, { exact: true }).first();
    if (await loc.count()) {
      try {
        await loc.click({ force: true, timeout: 800 });
        await page.waitForTimeout(200);
      } catch (_) {}
    }
  }
}

async function clipConfig(page, name) {
  await shot(page, name, { clip: { x: 1120, y: 48, width: 310, height: 780 } });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(30000);
  await page.addInitScript(() => {
    localStorage.setItem("abuilder.locale", "zh-CN");
  });
  await page.goto("http://localhost:31011/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);

  await shot(page, "01-overview.png");
  await shot(page, "05-materials-charts.png", { clip: { x: 0, y: 48, width: 280, height: 760 } });

  await page.getByText("基础", { exact: true }).first().click();
  await page.waitForTimeout(400);
  await shot(page, "05b-materials-basic.png", { clip: { x: 0, y: 48, width: 280, height: 760 } });

  await page.getByText("媒体", { exact: true }).first().click();
  await page.waitForTimeout(400);
  await shot(page, "05c-materials-media.png", { clip: { x: 0, y: 48, width: 280, height: 760 } });

  // Charts + bar
  await page.getByText("图表", { exact: true }).first().click();
  await page.waitForTimeout(300);
  await dragByText(page, "柱状图", 720, 380);
  await clickNear(page, 720, 380);
  await expandConfigSections(page);
  await shot(page, "03-config-chart-full.png");
  await clipConfig(page, "06-config-chart-top.png");

  // scroll config panel to data section
  const scrollables = page.locator('[class*="overflow"]').filter({ hasText: "类目" });
  if (await scrollables.count()) {
    await scrollables.first().evaluate((el) => {
      el.scrollTop = 180;
    });
    await page.waitForTimeout(300);
  } else {
    // fallback: mouse wheel over right panel
    await page.mouse.move(1280, 400);
    await page.mouse.wheel(0, 320);
    await page.waitForTimeout(300);
  }
  await clipConfig(page, "06b-config-chart-data.png");

  await page.mouse.move(1280, 400);
  await page.mouse.wheel(0, 420);
  await page.waitForTimeout(300);
  await clipConfig(page, "06c-config-chart-more.png");

  // Text
  await page.getByText("基础", { exact: true }).first().click();
  await page.waitForTimeout(300);
  await dragByText(page, "文本", 480, 240);
  await clickNear(page, 480, 240);
  await expandConfigSections(page);
  await shot(page, "07-text-full.png");
  await clipConfig(page, "07b-config-text.png");
  await page.mouse.move(1280, 400);
  await page.mouse.wheel(0, 280);
  await page.waitForTimeout(250);
  await clipConfig(page, "07c-config-text-style.png");

  // Grid
  await dragByText(page, "网格布局", 920, 300);
  await clickNear(page, 920, 300);
  await expandConfigSections(page);
  await shot(page, "08-grid-full.png");
  await clipConfig(page, "08b-config-grid.png");

  // Table
  await dragByText(page, "表格", 520, 520);
  await clickNear(page, 520, 520);
  await expandConfigSections(page);
  await shot(page, "09-table-full.png");
  await clipConfig(page, "09b-config-table.png");
  await page.mouse.move(1280, 400);
  await page.mouse.wheel(0, 360);
  await page.waitForTimeout(250);
  await clipConfig(page, "09c-config-table-cols.png");

  // Image
  await dragByText(page, "图片", 300, 480);
  await clickNear(page, 300, 480);
  await expandConfigSections(page);
  await clipConfig(page, "10-config-image.png");

  // Geometry
  await dragByText(page, "几何", 250, 300);
  await clickNear(page, 250, 300);
  await expandConfigSections(page);
  await clipConfig(page, "11-config-geometry.png");

  // Media audio
  await page.getByText("媒体", { exact: true }).first().click();
  await page.waitForTimeout(300);
  await dragByText(page, "音频", 780, 560);
  await clickNear(page, 780, 560);
  await expandConfigSections(page);
  await clipConfig(page, "12-config-audio.png");

  await dragByText(page, "视频", 980, 560);
  await clickNear(page, 980, 560);
  await expandConfigSections(page);
  await clipConfig(page, "13-config-video.png");

  // layers / node tree / named
  await shot(page, "14-layers.png", { clip: { x: 250, y: 720, width: 880, height: 170 } });
  await page.getByText("节点树", { exact: true }).first().click();
  await page.waitForTimeout(400);
  await shot(page, "15-node-tree.png", { clip: { x: 0, y: 48, width: 280, height: 760 } });
  await page.getByText("物料", { exact: true }).first().click();

  const nameInput = page.locator('input[placeholder*="产物"], input[placeholder*="名称"]').first();
  if (await nameInput.count()) {
    await nameInput.fill("新手教程示例");
    await page.waitForTimeout(300);
  }
  await shot(page, "16-named.png");

  // Blueprint
  const sw = page.getByRole("switch", { name: /显示蓝图面板|Show blueprint/i });
  await sw.click();
  await page.waitForTimeout(1000);
  // enlarge blueprint
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
    await page.mouse.move(sep.x + sep.w / 2, 430, { steps: 18 });
    await page.mouse.up();
    await page.waitForTimeout(600);
  }
  await shot(page, "17-blueprint.png");
  await page.mouse.click(700, 620, { button: "right" });
  await page.waitForTimeout(500);
  await shot(page, "17b-blueprint-menu.png");
  const add = page.getByText("添加节点").first();
  if (await add.isVisible().catch(() => false)) {
    await add.click();
    await page.waitForTimeout(800);
  }
  await shot(page, "17c-blueprint-node.png");
  await shot(page, "17d-blueprint-clip.png", { clip: { x: 220, y: 400, width: 980, height: 460 } });

  console.log("files", fs.readdirSync(out).join(", "));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

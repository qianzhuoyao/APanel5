/**
 * Capture beginner-tutorial screenshots from local Abuilder.
 * Requires: pnpm -C apps/web dev on http://localhost:31011
 * Playwright: use NODE_PATH=/tmp/pw-shot/node_modules or install locally.
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const out = path.join(__dirname, "../docs/guide-assets/live");
fs.mkdirSync(out, { recursive: true });

async function shot(page, name, opts = {}) {
  const file = path.join(out, name);
  await page.screenshot({ path: file, ...opts });
  console.log("shot", name);
}

async function clickText(page, text, exact = true) {
  const loc = page.getByText(text, { exact }).first();
  if ((await loc.count()) > 0) {
    await loc.click({ force: true });
    return true;
  }
  return false;
}

async function dragMaterial(page, label, x, y) {
  const item = page.getByText(label, { exact: true }).first();
  const box = await item.boundingBox();
  if (!box) return false;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y, { steps: 30 });
  await page.mouse.up();
  await page.waitForTimeout(900);
  return true;
}

async function selectNear(page, x, y) {
  await page.mouse.click(x, y);
  await page.waitForTimeout(600);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(30000);

  await page.goto("http://localhost:31011/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  // Try switch UI to Chinese for beginner docs
  try {
    await page.getByRole("menuitem", { name: /Settings|设置/ }).click({ timeout: 2000 }).catch(() => {});
    // Menu might be button with text Settings
    const settings = page.locator("text=Settings").first();
    if (await settings.isVisible().catch(() => false)) {
      await settings.click();
      await page.waitForTimeout(400);
      const lang = page.locator("text=Language").first();
      if (await lang.isVisible().catch(() => false)) {
        await lang.hover();
        await page.waitForTimeout(300);
      }
      const zh = page.locator("text=中文").first();
      if (await zh.isVisible().catch(() => false)) {
        await zh.click();
        await page.waitForTimeout(1200);
      } else {
        await page.keyboard.press("Escape");
      }
    }
  } catch (_) {
    /* keep English UI */
  }

  await shot(page, "01-overview.png");

  // Materials Charts tab (default)
  await shot(page, "05-materials-charts.png", {
    clip: { x: 0, y: 56, width: 280, height: 740 },
  });

  // Basic materials
  await clickText(page, "Basic");
  await page.waitForTimeout(500);
  await shot(page, "05b-materials-basic.png", {
    clip: { x: 0, y: 56, width: 280, height: 740 },
  });

  // Media
  await clickText(page, "Media");
  await page.waitForTimeout(500);
  await shot(page, "05c-materials-media.png", {
    clip: { x: 0, y: 56, width: 280, height: 740 },
  });

  // Back to Charts, drop bar chart
  await clickText(page, "Charts");
  await page.waitForTimeout(400);
  await dragMaterial(page, "Bar chart", 720, 400);
  await shot(page, "02-after-drop-chart.png");

  await selectNear(page, 720, 400);
  await shot(page, "03-config-chart.png");
  await shot(page, "06-config-clip.png", {
    clip: { x: 1120, y: 56, width: 310, height: 740 },
  });

  // Drop text
  await clickText(page, "Basic");
  await page.waitForTimeout(300);
  await dragMaterial(page, "Text", 520, 280);
  await selectNear(page, 520, 280);
  await shot(page, "07-text-selected.png");
  await shot(page, "07b-text-config.png", {
    clip: { x: 1120, y: 56, width: 310, height: 740 },
  });

  // Drop grid
  await dragMaterial(page, "Grid layout", 900, 320);
  await selectNear(page, 900, 320);
  await shot(page, "08-grid-selected.png");

  // Layers bar clip
  await shot(page, "09-layers.png", {
    clip: { x: 280, y: 720, width: 860, height: 170 },
  });

  // Node tree
  await clickText(page, "Node tree");
  await page.waitForTimeout(500);
  await shot(page, "10-node-tree.png", {
    clip: { x: 0, y: 56, width: 280, height: 740 },
  });
  await clickText(page, "Materials");
  await page.waitForTimeout(300);

  // Fill product name
  const nameInput = page.locator('input[placeholder*="product" i], input[placeholder*="产物" i]').first();
  if ((await nameInput.count()) > 0) {
    await nameInput.fill("新手教程示例");
    await page.waitForTimeout(400);
  }
  await shot(page, "11-named-product.png");

  // Blueprint toggle
  const toggle = page.locator("[data-blueprint-toggle]").first();
  if ((await toggle.count()) > 0) {
    const sw = toggle.locator('[role="switch"], button, input').first();
    if ((await sw.count()) > 0) await sw.click({ force: true });
    else await toggle.click({ force: true });
    await page.waitForTimeout(2000);
  }
  await shot(page, "04-blueprint.png");

  // Try open blueprint add-node context via right click in blueprint area (bottom half)
  await page.mouse.click(700, 700, { button: "right" });
  await page.waitForTimeout(600);
  await shot(page, "04b-blueprint-context.png");
  await page.keyboard.press("Escape");

  // Theme toggle attempt
  const themeBtn = page.locator('[aria-label*="theme" i], [title*="theme" i]').first();
  if ((await themeBtn.count()) > 0) {
    await themeBtn.click({ force: true });
    await page.waitForTimeout(800);
    await shot(page, "12-light-theme.png");
  }

  console.log("files:", fs.readdirSync(out).join(", "));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const out = path.join(__dirname, "docs/guide-assets/live");
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(25000);
  await page.goto("http://localhost:31011/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(out, "01-overview.png") });

  const bar = page.getByText("Bar chart", { exact: true }).first();
  const barBox = await bar.boundingBox();
  if (barBox) {
    await page.mouse.move(barBox.x + barBox.width / 2, barBox.y + barBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(760, 430, { steps: 25 });
    await page.mouse.up();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(out, "02-after-drop-chart.png") });

  const node = page.locator("[data-element-id], .rv-selectable").first();
  if ((await node.count()) > 0) {
    await node.click({ force: true });
    await page.waitForTimeout(1000);
  } else {
    // click near drop point
    await page.mouse.click(760, 430);
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: path.join(out, "03-config-with-selection.png") });

  const toggle = page.locator("[data-blueprint-toggle]").first();
  if ((await toggle.count()) > 0) {
    const sw = toggle.locator('[role="switch"], button, input').first();
    if ((await sw.count()) > 0) await sw.click({ force: true });
    else await toggle.click({ force: true });
  }
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(out, "04-blueprint.png") });

  await page.screenshot({
    path: path.join(out, "05-materials-clip.png"),
    clip: { x: 0, y: 70, width: 300, height: 720 },
  });

  await browser.close();
  console.log("ok", fs.readdirSync(out).join(", "));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Playwright: verify React panel text config fields stick after edit.
 * Usage: node docs/guide-assets/verify-config-apply.mjs [baseUrl]
 */
import { chromium } from "../../.vendor/node_modules/playwright/index.mjs";

const BASE = process.argv[2] || "http://127.0.0.1:31011/";
const VIEW = { width: 1440, height: 900 };

async function ensureZh(page) {
  await page.evaluate(() => {
    try {
      localStorage.setItem("abuilder.locale", "zh-CN");
    } catch {}
  });
}

async function dragMaterial(page, materialName) {
  const src = page
    .getByRole("button", { name: materialName, exact: true })
    .first();
  await src.waitFor({ state: "visible", timeout: 15000 });
  const box = await src.boundingBox();
  const target = { x: VIEW.width * 0.5, y: VIEW.height * 0.48 };
  if (!box) throw new Error(`no bbox for ${materialName}`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 18 });
  await page.mouse.up();
  await page.waitForTimeout(800);
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

/** Input inside the label that contains the given text. */
async function inputNearLabel(page, labelText) {
  const label = page.locator("label").filter({ hasText: labelText }).first();
  await label.waitFor({ state: "visible", timeout: 15000 });
  const input = label.locator("input").first();
  await input.waitFor({ state: "visible", timeout: 5000 });
  return input;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEW,
    deviceScaleFactor: 1,
    locale: "zh-CN",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e)));

  await page.goto(BASE, { waitUntil: "networkidle", timeout: 120000 });
  await ensureZh(page);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByRole("menuitem", { name: "文件" }).waitFor({ timeout: 30000 });

  await openCategory(page, "基础");
  await dragMaterial(page, "文本");
  await page.mouse.click(VIEW.width * 0.5, VIEW.height * 0.48);
  await page.waitForTimeout(600);

  // Expand text style group if collapsed
  const styleGroup = page.getByText("文字样式", { exact: false }).first();
  if (await styleGroup.count()) {
    await styleGroup.click().catch(() => {});
    await page.waitForTimeout(200);
  }

  const fontSizeInput = await inputNearLabel(page, "字号");
  await fontSizeInput.click({ clickCount: 3 });
  await fontSizeInput.fill("32");
  await fontSizeInput.blur();
  await page.waitForTimeout(700);

  const afterSize = await fontSizeInput.inputValue();
  if (afterSize !== "32") {
    throw new Error(`textFontSize rebound: expected 32, got ${afterSize}`);
  }

  // Color field: text input with hex near 文字颜色
  const colorLabel = page.locator("label, div").filter({ hasText: "文字颜色" }).first();
  await colorLabel.waitFor({ state: "visible", timeout: 10000 });
  // find hex-like input to the right of sidebar
  const inputs = page.locator("input");
  const n = await inputs.count();
  let colorInput = null;
  for (let i = 0; i < n; i++) {
    const el = inputs.nth(i);
    const box = await el.boundingBox();
    if (!box || box.x < VIEW.width * 0.55) continue;
    const val = await el.inputValue().catch(() => "");
    if (/^#([0-9a-fA-F]{3,8})$/.test(val) || val === "") {
      // Prefer existing hex near color controls; skip the font-size 32
      if (val === "32") continue;
      const type = await el.getAttribute("type");
      if (type === "number") continue;
      if (/^#/.test(val) || type === "text" || !type) {
        // Heuristic: empty or hex; take first hex if any
        if (/^#/.test(val)) {
          colorInput = el;
          break;
        }
      }
    }
  }
  if (!colorInput) {
    // Fallback: input inside color field group
    colorInput = page
      .locator("label")
      .filter({ hasText: "文字颜色" })
      .locator("input")
      .first();
    if (!(await colorInput.count())) {
      colorInput = null;
    }
  }

  let afterColor = null;
  if (colorInput && (await colorInput.count())) {
    await colorInput.click({ clickCount: 3 });
    await colorInput.fill("#ff0000");
    await colorInput.blur();
    await page.waitForTimeout(700);
    afterColor = await colorInput.inputValue();
    if (afterColor.toLowerCase() !== "#ff0000") {
      throw new Error(`textColor rebound: expected #ff0000, got ${afterColor}`);
    }
  }

  const canvasHas32px = await page.evaluate(() => {
    const walk = Array.from(document.querySelectorAll("*"));
    return walk.some((n) => {
      const inline = n.getAttribute?.("style") || "";
      if (inline.includes("32px")) return true;
      try {
        return getComputedStyle(n).fontSize === "32px";
      } catch {
        return false;
      }
    });
  });

  // Geometry color-like second check: change alignment via select (should stick)
  const alignTrigger = page
    .locator("label")
    .filter({ hasText: "对齐" })
    .locator('[role="combobox"], button')
    .first();
  let afterAlign = null;
  if (await alignTrigger.count()) {
    await alignTrigger.click();
    await page.waitForTimeout(200);
    const centerOpt = page.getByRole("option", { name: /居中|中/ }).first();
    if (await centerOpt.count()) {
      await centerOpt.click();
      await page.waitForTimeout(500);
      afterAlign = await alignTrigger.innerText().catch(() => "clicked");
    }
  }

  if (pageErrors.length) {
    console.warn("page errors:", pageErrors.slice(0, 5));
  }

  const result = {
    ok: afterSize === "32" && (!afterColor || afterColor.toLowerCase() === "#ff0000"),
    textFontSize: afterSize,
    textColor: afterColor,
    canvasHas32px,
    afterAlign,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
  await browser.close();
}

main().catch((err) => {
  console.error("VERIFY_FAILED", err);
  process.exit(1);
});

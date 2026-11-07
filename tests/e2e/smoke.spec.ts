import { expect, test, type Page } from "@playwright/test";
import { BASE, FULL, REAL, pages } from "./helpers/pages";

const MISSING = "/this-page-does-not-exist/";

async function allImagesLoaded(page: Page) {
  // Lazy images load only near the viewport, so scroll through the page first.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  });
  await page.waitForLoadState("networkidle");
  return page.evaluate(() =>
    [...document.images].every((image) => image.complete && image.naturalWidth > 0),
  );
}

for (const [name, origin] of [
  ["test content", FULL],
  ["real content", REAL],
] as const) {
  for (const path of pages) {
    test(`${path} works on ${name}`, async ({ page, context }) => {
      const errors: string[] = [];
      const thirdParty: string[] = [];
      page.on("console", (message) => {
        const text = message.text();
        const expected404 = path === MISSING && text.includes("404");
        if (message.type() === "error" && !expected404) errors.push(text);
      });
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => {
        if (!request.url().startsWith(origin)) thirdParty.push(request.url());
      });

      const response = await page.goto(`${origin}${path}`);
      expect(response?.status()).toBe(path === MISSING ? 404 : 200);
      expect(await allImagesLoaded(page)).toBe(true);
      expect(errors).toEqual([]);
      expect(thirdParty).toEqual([]);
      expect(await context.cookies()).toEqual([]);
    });
  }
}

test("a missing address shows the not-found page", async ({ page }) => {
  await page.goto(`${FULL}${MISSING}`);
  await expect(page.locator("h1")).toHaveText("Sample not-found heading");
  await expect(page.getByRole("link", { name: "Sample home link" })).toBeVisible();
  await expect(page.locator("main [data-hire]")).toBeVisible();
  await expect(page.locator("#top-bar")).toBeVisible();
  await expect(page.locator("#footer")).toBeVisible();
});

test("everything loads under the base path", async ({ page }) => {
  const failed: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failed.push(response.url());
  });
  await page.goto(`${BASE}/`);
  await expect(page.locator("h1")).toBeVisible();
  expect(await allImagesLoaded(page)).toBe(true);
  expect(failed).toEqual([]);
  const background = await page
    .locator("[data-hire]")
    .first()
    .evaluate((element) => {
      return getComputedStyle(element).backgroundColor;
    });
  expect(background).not.toBe("rgba(0, 0, 0, 0)");
});

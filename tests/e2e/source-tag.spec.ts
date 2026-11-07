import { expect, test } from "@playwright/test";
import siteConfig from "../../site.config";
import { BASE, FULL } from "./helpers/pages";

test("a source tag changes nothing on the page", async ({ page }) => {
  await page.goto(FULL);
  const plain = await page.locator("body").innerText();

  await page.goto(`${FULL}/?src=upwork-chatbot`);
  expect(await page.locator("body").innerText()).toBe(plain);
  for (const button of await page.locator("[data-hire]").all()) {
    await expect(button).toHaveAttribute("href", siteConfig.upworkUrl);
  }
});

test("an unusual source tag never appears in the page", async ({ page }) => {
  const tag = `unusual-${"x".repeat(500)}`;
  await page.goto(`${FULL}/?src=${tag}`);
  expect(await page.locator("body").innerText()).not.toContain(tag);
});

test("the canonical address has no query string", async ({ page }) => {
  await page.goto(`${BASE}/?src=upwork-chatbot`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteConfig.siteUrl}/`,
  );
});

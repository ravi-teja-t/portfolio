import { expect, test } from "@playwright/test";
import siteConfig from "../../site.config";
import { FULL, REAL } from "./helpers/pages";

for (const [name, url] of [
  ["test content", FULL],
  ["real content", REAL],
] as const) {
  test(`every Hire button opens the configured Upwork URL on ${name}`, async ({ page }) => {
    await page.goto(url);
    const buttons = page.locator("[data-hire]");
    expect(await buttons.count()).toBeGreaterThanOrEqual(3);
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute("href", siteConfig.upworkUrl);
      await expect(button).toHaveAttribute("target", "_blank");
      await expect(button).toHaveAttribute("rel", "noopener noreferrer");
      await expect(button).toHaveText(siteConfig.hireLabel);
    }
  });
}

test("a Hire button sits in the top bar, hero and closing section", async ({ page }) => {
  await page.goto(FULL);
  for (const section of ["#top-bar", "#hero", "#closing"]) {
    await expect(page.locator(`${section} [data-hire]`)).toHaveCount(1);
  }
});

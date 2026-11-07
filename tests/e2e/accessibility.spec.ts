import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { EMPTY, FULL, REAL, pages } from "./helpers/pages";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const [name, origin] of [
  ["test content", FULL],
  ["real content", REAL],
  ["empty content", EMPTY],
] as const) {
  for (const path of pages) {
    test(`${path} has no WCAG 2.2 AA violations on ${name}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${origin}${path}`);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

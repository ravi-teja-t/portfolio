import { expect, test } from "@playwright/test";
import { FULL, REAL, pages } from "./helpers/pages";

const ACCENTS = ["rgb(29, 78, 216)", "rgb(26, 67, 184)"];

for (const [name, origin] of [
  ["test content", FULL],
  ["real content", REAL],
] as const) {
  for (const path of pages) {
    test(`only Hire buttons use the accent on ${path} with ${name}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${origin}${path}`);
      const offenders = await page.evaluate((accents) => {
        const properties = [
          "color",
          "backgroundColor",
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
          "outlineColor",
          "fill",
          "stroke",
        ] as const;
        return [...document.querySelectorAll("body *")]
          .filter((element) => !element.closest("[data-hire]"))
          .filter((element) => {
            const style = getComputedStyle(element);
            return properties.some((property) => accents.includes(style[property]));
          })
          .map((element) => element.outerHTML.slice(0, 120));
      }, ACCENTS);
      expect(offenders).toEqual([]);
      await expect(page.locator("[data-hire]").first()).toHaveCSS("background-color", ACCENTS[0]);
    });
  }
}

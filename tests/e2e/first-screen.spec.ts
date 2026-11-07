import { expect, test } from "@playwright/test";
import { EMPTY, FULL, REAL } from "./helpers/pages";

for (const [name, origin] of [
  ["test content", FULL],
  ["empty content", EMPTY],
  ["real content", REAL],
] as const) {
  test(`headline and Hire button fit the first screen on ${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 553 });
    await page.goto(origin);
    await expect(page.locator("h1")).toBeInViewport({ ratio: 1 });
    await expect(page.locator("#hero [data-hire]")).toBeInViewport({ ratio: 1 });
  });

  test(`nothing scrolls sideways at 320 wide on ${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(origin);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test(`every interactive element is at least 44 by 44 on ${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(origin);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll("a, button, summary")]
        .filter((element) => {
          const { width, height } = element.getBoundingClientRect();
          return width > 0 && (width < 44 || height < 44);
        })
        .map((element) => element.outerHTML.slice(0, 100)),
    );
    expect(small).toEqual([]);
  });
}

test("the phone menu reaches every link and closes on selection", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(FULL);
  const menu = page.locator("#top-bar details");
  await expect(menu).not.toHaveAttribute("open", "");
  await menu.locator("summary").click();
  for (const label of ["Work", "Services", "About"]) {
    await expect(menu.getByRole("link", { name: label })).toBeVisible();
  }
  await menu.getByRole("link", { name: "Services" }).click();
  await expect(menu).not.toHaveAttribute("open", "");
});

test("the fixed top bar stays on screen and clears link targets", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(FULL);
  await page.getByRole("link", { name: "See the sample work" }).click();
  await expect(page.locator("#top-bar")).toBeInViewport();
  await page.waitForFunction(() => {
    const heading = document.querySelector("#work h2")?.getBoundingClientRect();
    const bar = document.querySelector("#top-bar")?.getBoundingClientRect();
    return heading && bar && heading.top >= bar.bottom;
  });
});

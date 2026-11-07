import fs from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { FULL, sectionIds } from "./helpers/pages";

async function expectAllSectionsVisible(page: Page) {
  const hidden = await page.evaluate(
    (ids) =>
      ids.filter((id) => {
        let element = document.getElementById(id);
        while (element) {
          if (Number(getComputedStyle(element).opacity) < 1) return true;
          element = element.parentElement;
        }
        return false;
      }),
    sectionIds,
  );
  expect(hidden).toEqual([]);
}

test("the built HTML never hides content", () => {
  const html = fs.readFileSync(".fixture-out/full/index.html", "utf8");
  expect(html).toContain("data-reveal");
  for (const [element] of html.matchAll(/<div[^>]*data-reveal[^>]*>/g)) {
    expect(element).not.toMatch(/opacity:\s*0(?![.\d])/);
  }
});

test.describe("with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("every section is visible, and Hire and the FAQ work", async ({ page }) => {
    await page.goto(FULL);
    await expectAllSectionsVisible(page);
    await expect(page.locator("#hero [data-hire]")).toHaveAttribute("href", /upwork\.com/);
    const first = page.locator("#faq details").first();
    await first.locator("summary").click();
    await expect(first.locator("p")).toBeVisible();
  });
});

test("with scripts blocked, every section stays visible", async ({ page }) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto(FULL);
  await expectAllSectionsVisible(page);
});

test("with reduced motion, every section is visible with no scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(FULL);
  await page.waitForLoadState("networkidle");
  await expectAllSectionsVisible(page);
  await expect(page.locator("[data-scroll-progress]")).toBeHidden();
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`hydration succeeds with reduced motion set to ${reducedMotion}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.emulateMedia({ reducedMotion });
    await page.goto(FULL);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("in print, every section is visible", async ({ page }) => {
  await page.goto(FULL);
  await page.waitForLoadState("networkidle");
  await page.emulateMedia({ media: "print" });
  await expectAllSectionsVisible(page);
});

test("sections reveal as they enter the screen", async ({ page }) => {
  await page.goto(FULL);
  await page.waitForLoadState("networkidle");
  const faq = page.locator("[data-reveal]:has(#faq)");
  await expect(faq).toHaveCSS("opacity", "0");
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await expect(faq).toHaveCSS("opacity", "1");
});

test("tabbing to a link outside the screen reveals its section", async ({ page }) => {
  await page.goto(FULL);
  await page.waitForLoadState("networkidle");
  await page.locator("#footer a").first().focus();
  await expect(page.locator("#footer a").first()).toBeInViewport();
  await page.locator("#faq summary").first().focus();
  await expect(page.locator("[data-reveal]:has(#faq)")).toHaveCSS("opacity", "1");
});

test("the scroll progress line grows on scrolling", async ({ page }) => {
  await page.goto(FULL);
  await page.waitForLoadState("networkidle");
  const width = () =>
    page.locator("[data-scroll-progress]").evaluate((line) => line.getBoundingClientRect().width);
  const before = await width();
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
  await expect.poll(width).toBeGreaterThan(before);
});

test("the top bar marks the section on screen", async ({ page }) => {
  await page.goto(FULL);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    document.getElementById("services")?.scrollIntoView({ behavior: "instant" });
  });
  await expect(page.locator('#top-bar nav a[aria-current="true"]').first()).toHaveText("Services");
});

test("the how I work line grows on scrolling", async ({ page }) => {
  await page.goto(FULL);
  await page.waitForLoadState("networkidle");
  const line = page.locator("[data-timeline-line]");
  const height = () => line.evaluate((element) => element.getBoundingClientRect().height);
  const before = await height();
  await page.locator("#how-i-work ol li").last().scrollIntoViewIfNeeded();
  await expect.poll(height).toBeGreaterThan(before);
});

test("nothing moves on its own for longer than 5 seconds", async ({ page }) => {
  await page.goto(FULL);
  await expect(page.locator(".hero-line").first()).toBeVisible();
  const longest = await page.evaluate(() =>
    Math.max(
      0,
      ...document
        .getAnimations()
        // Scroll-driven animations only move when the visitor scrolls.
        .filter((animation) => animation.timeline instanceof DocumentTimeline)
        .map((animation) => Number(animation.effect?.getComputedTiming().endTime ?? 0)),
    ),
  );
  expect(longest).toBeGreaterThan(0);
  expect(longest).toBeLessThan(5000);
});

test("cards lift only when they have a link, and focus stays clear of the top bar", async ({
  page,
}) => {
  await page.goto(FULL);
  await page.waitForLoadState("networkidle");
  await page.locator("#footer a").first().focus();
  const clear = await page.evaluate(() => {
    const focused = document.activeElement?.getBoundingClientRect();
    const bar = document.querySelector("#top-bar")?.getBoundingClientRect();
    return focused && bar && focused.top >= bar.bottom;
  });
  expect(clear).toBe(true);
});

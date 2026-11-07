import { expect, test } from "@playwright/test";
import { EMPTY } from "./helpers/pages";

test("sections with no content are absent", async ({ page }) => {
  await page.goto(EMPTY);
  for (const id of [
    "proof",
    "services",
    "work",
    "how-i-work",
    "tech-stack",
    "about",
    "testimonials",
    "faq",
  ]) {
    await expect(page.locator(`#${id}`)).toHaveCount(0);
  }
  await expect(page.getByText("See the sample work")).toHaveCount(0);
});

test("required sections are always present", async ({ page }) => {
  await page.goto(EMPTY);
  for (const id of ["top-bar", "hero", "closing", "footer"]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test("no link points to a hidden section", async ({ page }) => {
  await page.goto(EMPTY);
  await expect(page.locator('a[href*="#work"]')).toHaveCount(0);
  await expect(page.locator('a[href*="#services"]')).toHaveCount(0);
  await expect(page.locator('a[href*="#about"]')).toHaveCount(0);
  await expect(page.locator("#top-bar details")).toHaveCount(0);
});

test("an unapproved testimonial appears nowhere", async ({ page }) => {
  await page.goto(EMPTY);
  expect(await page.content()).not.toContain("Sample quote not yet approved");
});

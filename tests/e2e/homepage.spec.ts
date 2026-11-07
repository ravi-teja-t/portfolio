import { expect, test } from "@playwright/test";
import { FULL, sectionIds } from "./helpers/pages";

test("sections appear in the agreed order", async ({ page }) => {
  await page.goto(FULL);
  const found = await page.evaluate(
    (ids) =>
      [...document.querySelectorAll("[id]")]
        .map((element) => element.id)
        .filter((id) => ids.includes(id)),
    sectionIds,
  );
  expect(found).toEqual(sectionIds);
});

test("the page has one h1, holding the headline", async ({ page }) => {
  await page.goto(FULL);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("A fictional headline used only by the test suite.");
});

test("See my work moves to the featured work section", async ({ page }) => {
  await page.goto(FULL);
  const link = page.getByRole("link", { name: "See the sample work" });
  await expect(link).toHaveAttribute("href", "#work");
  await link.click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
});

test("the FAQ uses native expandable questions", async ({ page }) => {
  await page.goto(FULL);
  await expect(page.locator("#faq details summary")).toHaveCount(5);
  const first = page.locator("#faq details").first();
  await first.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(first).not.toHaveAttribute("open", "");
});

test("featured work shows the first three listed case studies in order", async ({ page }) => {
  await page.goto(FULL);
  const cards = page.locator("#work [data-case-study]");
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toContainText("Sample result one.");
});

test("unapproved and unlisted content appears nowhere", async ({ page }) => {
  await page.goto(FULL);
  const html = await page.content();
  for (const hidden of [
    "unapproved sample metric",
    "Sample unlisted result",
    "Sample unlisted client",
    "Sample quote not yet approved",
    "past the featured limit",
  ]) {
    expect(html).not.toContain(hidden);
  }
});

test("testimonials show only the attribution that is present", async ({ page }) => {
  await page.goto(FULL);
  const figures = page.locator("#testimonials figure");
  await expect(figures).toHaveCount(3);
  await expect(figures.nth(0).locator("figcaption")).toHaveText(
    "Sample Person, Sample role, Sample company",
  );
  await expect(figures.nth(1).locator("figcaption")).toHaveText("Sample role only");
  await expect(figures.nth(2).locator("figcaption")).toHaveCount(0);
});

test("the tech stack hides groups with no items", async ({ page }) => {
  await page.goto(FULL);
  await expect(page.locator("#tech-stack")).not.toContainText("Healthcare");
  await expect(page.locator("#tech-stack img")).toHaveCount(4);
});

test("the footer shows the name, year and plain-text founder line", async ({ page }) => {
  await page.goto(FULL);
  const footer = page.locator("#footer");
  await expect(footer).toContainText(String(new Date().getFullYear()));
  await expect(footer).toContainText("Founder of Ango Digital Tech");
  await expect(footer.getByRole("link", { name: /Ango/ })).toHaveCount(0);
});

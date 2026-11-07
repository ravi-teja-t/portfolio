import { expect, test } from "@playwright/test";
import { FULL } from "./helpers/pages";

test("each service card shows its fields, in order", async ({ page }) => {
  await page.goto(FULL);
  const cards = page.locator("#services [data-service]");
  await expect(cards).toHaveCount(4);
  await expect(cards.first()).toContainText("Sample outcome one");
  await expect(cards.first()).toContainText("Sample line one.");
  for (const card of await cards.all()) {
    await expect(card.locator("li")).toHaveCount(3);
  }
});

test("cards with no page have no link and don't lift", async ({ page }) => {
  await page.goto(FULL);
  await expect(page.locator("#services a")).toHaveCount(0);
  await expect(page.locator("#work a")).toHaveCount(0);
  await expect(page.locator(".card-link")).toHaveCount(0);
});

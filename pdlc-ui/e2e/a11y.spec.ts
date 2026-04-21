import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function runAxe(page: import("@playwright/test").Page) {
  // Sonner's transient success toast owns contrast decisions we don't; it
  // auto-dismisses but can still be painted when axe runs mid-flow. Scope
  // axe to the app tree so we assert *our* surfaces, not toast internals.
  const results = await new AxeBuilder({ page })
    .exclude("[data-sonner-toaster]")
    .analyze();
  return results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
}

test.describe("a11y — S1 + S2 surfaces", () => {
  test("board (swim lanes) has no critical/serious axe violations", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: "Board" }),
    ).toBeVisible();
    // Ensure the lane headers actually rendered before running axe, otherwise
    // we'd check a loading state that doesn't represent the real surface.
    await expect(
      page.getByRole("heading", { level: 3, name: "Idea" }),
    ).toBeVisible();
    const blocking = await runAxe(page);
    expect(
      blocking,
      blocking.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toEqual([]);
  });

  test("create dialog (with TipTap editor) has no critical/serious violations", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create new initiative" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const blocking = await runAxe(page);
    expect(
      blocking,
      blocking.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toEqual([]);
  });

  test("parked-transition dialog has no critical/serious violations", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: "Board" }),
    ).toBeVisible();
    // Seed a card so we have something to park.
    const title = `A11y parked ${Date.now()}`;
    await page.getByRole("button", { name: "Create new initiative" }).click();
    await page.getByLabel(/^title/i).fill(title);
    await page.getByRole("button", { name: "Create idea" }).click();
    const card = page.getByRole("listitem").filter({ hasText: title });
    await expect(card).toBeVisible();

    await card.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: /^Park…$/ }).click();
    await expect(
      page.getByRole("dialog", { name: "Park initiative" }),
    ).toBeVisible();

    const blocking = await runAxe(page);
    expect(
      blocking,
      blocking.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toEqual([]);
  });
});

import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function runAxe(page: Page) {
  // Sonner's transient success toast owns contrast decisions we don't.
  const results = await new AxeBuilder({ page })
    .exclude("[data-sonner-toaster]")
    .analyze();
  return results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
}

async function setDensity(
  page: Page,
  mode: "compact" | "comfortable" | "detailed",
) {
  await page
    .getByRole("group", { name: "Card density" })
    .getByRole("button", { name: new RegExp(`^${mode}$`, "i") })
    .click();
}

test.describe("a11y — S3A.1 surfaces", () => {
  test.describe("board across all 3 densities", () => {
    for (const density of ["compact", "comfortable", "detailed"] as const) {
      test(`density="${density}" has no critical/serious violations`, async ({
        page,
      }) => {
        await page.goto("/");
        await expect(page.locator('section[data-lane="idea"]')).toBeVisible();
        await setDensity(page, density);
        const blocking = await runAxe(page);
        expect(
          blocking,
          blocking.map((v) => `${v.id}: ${v.description}`).join("\n"),
        ).toEqual([]);
      });
    }
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

  test("brief wizard summary step has no critical/serious violations", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator('section[data-lane="idea"]')).toBeVisible();
    const title = `A11y brief ${Date.now()}`;
    await page.getByRole("button", { name: "Create new initiative" }).click();
    await page.getByLabel(/^title/i).fill(title);
    await page.getByRole("button", { name: "Create idea" }).click();
    const card = page.getByRole("listitem").filter({ hasText: title }).first();
    await expect(card).toBeVisible();
    await card.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    await page.getByRole("menuitem", { name: "Discovery" }).click();
    const dialog = page.getByRole("dialog", { name: "Product brief" });
    await expect(dialog).toBeVisible();

    // Walk to the summary step so axe asserts the composite UI (chips, edit
    // buttons, dual save buttons) — that surface is new in S3A.1.
    for (const name of [
      /Why does this matter/i,
      /Who is it for/i,
      /What problem are we solving/i,
    ]) {
      const box = page.getByRole("textbox", { name });
      await box.click();
      await box.type("placeholder");
      await dialog.getByRole("button", { name: "Next" }).click();
    }
    await expect(
      dialog.getByTestId("brief-wizard-save-and-start"),
    ).toBeVisible();

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
    await expect(page.locator('section[data-lane="idea"]')).toBeVisible();
    const title = `A11y parked ${Date.now()}`;
    await page.getByRole("button", { name: "Create new initiative" }).click();
    await page.getByLabel(/^title/i).fill(title);
    await page.getByRole("button", { name: "Create idea" }).click();
    const card = page.getByRole("listitem").filter({ hasText: title }).first();
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

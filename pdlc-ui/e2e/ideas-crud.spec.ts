import { expect, test } from "@playwright/test";

/**
 * S1 happy path: create → edit → delete, persistence across refresh.
 * Runs against the `webServer` Playwright starts (see playwright.config.ts).
 */
test.describe("ideas CRUD", () => {
  test("create, edit, delete an idea", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: "Board" }),
    ).toBeVisible();

    const title = `S1 smoke ${Date.now()}`;
    await page.getByRole("button", { name: "Create new initiative" }).click();

    const titleInput = page.getByLabel(/^title/i);
    await titleInput.fill(title);

    const editable = page.getByLabel("Idea body");
    await editable.click();
    await editable.type("Body paragraph");

    await page.getByRole("button", { name: "Create idea" }).click();

    const card = page.getByRole("listitem").filter({ hasText: title });
    await expect(card).toBeVisible();
    await expect(card).toContainText("Body paragraph");
    await expect(card.getByText(/INIT-\d{4}/)).toBeVisible();

    // Persistence survives a full reload.
    await page.reload();
    await expect(
      page.getByRole("listitem").filter({ hasText: title }),
    ).toBeVisible();

    // Edit.
    const actions = page
      .getByRole("listitem")
      .filter({ hasText: title })
      .getByRole("button", { name: /Actions for INIT-/ });
    await actions.click();
    await page.getByRole("menuitem", { name: "Edit" }).click();

    await page.getByLabel(/^title/i).fill(`${title} (edited)`);
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(
      page.getByRole("listitem").filter({ hasText: `${title} (edited)` }),
    ).toBeVisible();

    // Delete.
    await page
      .getByRole("listitem")
      .filter({ hasText: `${title} (edited)` })
      .getByRole("button", { name: /Actions for INIT-/ })
      .click();
    await page.getByRole("menuitem", { name: "Delete…" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(
      page.getByRole("listitem").filter({ hasText: `${title} (edited)` }),
    ).toHaveCount(0);
  });
});

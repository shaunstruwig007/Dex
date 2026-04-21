import { expect, test, type Page } from "@playwright/test";

async function createInitiative(page: Page, title: string) {
  await page.getByRole("button", { name: "Create new initiative" }).click();
  await page.getByLabel(/^title/i).fill(title);
  await page.getByRole("button", { name: "Create idea" }).click();
  const card = page.getByRole("listitem").filter({ hasText: title });
  await expect(card).toBeVisible();
  return card;
}

async function fillRichText(page: Page, name: RegExp, html: string) {
  const box = page.getByRole("textbox", { name });
  await box.click();
  await box.fill(html);
}

test.describe("S3 brief wizard", () => {
  test("opens wizard from Move to → Discovery and completes with revision +1", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Brief wizard ${Date.now()}`;
    const card = await createInitiative(page, title);
    const initialRev = await card.getByText(/rev/).textContent();

    await card.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    const discovery = page.getByRole("menuitem", { name: "Discovery" });
    await expect(discovery).toBeEnabled();
    await discovery.click();

    const dialog = page.getByRole("dialog", { name: "Product brief" });
    await expect(dialog).toBeVisible();

    await fillRichText(page, /What problem/i, "<p>Our problem statement</p>");
    await dialog.getByRole("button", { name: "Next" }).click();

    await fillRichText(
      page,
      /Who are the target users/i,
      "<p>Primary users</p>",
    );
    await dialog.getByRole("button", { name: "Next" }).click();

    await fillRichText(page, /core value proposition/i, "<p>Core value</p>");
    await dialog.getByRole("button", { name: "Next" }).click();

    await fillRichText(page, /How will we know/i, "<p>Success metrics</p>");
    await dialog.getByRole("button", { name: "Next" }).click();

    await fillRichText(
      page,
      /constraints must we respect/i,
      "<p>None beyond usual</p>",
    );
    await dialog.getByRole("button", { name: "Next" }).click();

    await dialog.getByLabel(/explicitly in scope/i).fill("Scope item one");
    await dialog.getByRole("button", { name: "Next" }).click();

    await dialog.getByLabel(/explicitly out of scope/i).fill("");
    await dialog.getByRole("button", { name: "Next" }).click();

    await dialog
      .getByLabel(/assumptions are we making/i)
      .fill("Key assumption");
    await dialog.getByRole("button", { name: "Next" }).click();

    await dialog.getByLabel(/Open questions for discovery/i).fill("");
    await dialog.getByRole("button", { name: "Next" }).click();

    await fillRichText(
      page,
      /Understanding summary/i,
      "<p>We align on the framing above.</p>",
    );
    await dialog.getByRole("button", { name: "Finish" }).click();

    await expect(dialog).toBeHidden();

    const discoveryLane = page.locator('section[data-lane="discovery"]');
    const moved = discoveryLane
      .getByRole("listitem")
      .filter({ hasText: title });
    await expect(moved).toBeVisible();

    const nextRev = await moved.getByText(/rev/).textContent();
    expect(initialRev, "revision label present").toMatch(/rev\s+\d+/);
    expect(nextRev, "revision bumps once").not.toEqual(initialRev);

    await moved.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    await expect(page.getByRole("menuitem", { name: "Design" })).toBeEnabled();
  });

  test("clean cancel closes without confirm; dirty cancel shows discard dialog", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Brief cancel ${Date.now()}`;
    const card = await createInitiative(page, title);

    await card.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    await page.getByRole("menuitem", { name: "Discovery" }).click();

    const dialog = page.getByRole("dialog", { name: "Product brief" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();

    await card.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    await page.getByRole("menuitem", { name: "Discovery" }).click();
    await expect(
      page.getByRole("dialog", { name: "Product brief" }),
    ).toBeVisible();

    await fillRichText(page, /What problem/i, "<p>Some draft text</p>");
    await page
      .getByRole("dialog", { name: "Product brief" })
      .getByRole("button", { name: "Cancel" })
      .click();
    const confirm = page.getByRole("dialog", { name: "Discard changes?" });
    await expect(confirm).toBeVisible();
    await confirm.getByRole("button", { name: "Discard" }).click();
    await expect(confirm).toBeHidden();
    await expect(
      page.getByRole("dialog", { name: "Product brief" }),
    ).toBeHidden();

    const ideaLane = page.locator('section[data-lane="idea"]');
    await expect(
      ideaLane.getByRole("listitem").filter({ hasText: title }),
    ).toBeVisible();
  });
});

import { expect, test, type Page } from "@playwright/test";

/**
 * S3A.1 brief wizard — three required content steps (Why → Who → What) plus
 * a Summary step. Both footer buttons hit the same atomic
 * `POST /api/initiatives/:id/brief` endpoint; "Save brief & start discovery"
 * also moves the card into Discovery on success. Demo honesty (M1): server
 * behaviour is identical for both buttons in S3A.1; the kickoff side-effect
 * lands in S3A.2.
 */

async function createInitiative(page: Page, title: string) {
  await page.getByRole("button", { name: "Create new initiative" }).click();
  await page.getByLabel(/^title/i).fill(title);
  await page.getByRole("button", { name: "Create idea" }).click();
  const card = page.getByRole("listitem").filter({ hasText: title });
  await expect(card.first()).toBeVisible();
  return card.first();
}

async function fillRichText(page: Page, name: RegExp, text: string) {
  // The editor is a contenteditable div with `aria-label={step.label}`.
  const box = page.getByRole("textbox", { name });
  await box.click();
  await box.press("ControlOrMeta+a").catch(() => {});
  await box.press("Delete").catch(() => {});
  await box.type(text);
}

test.describe("S3A.1 brief wizard", () => {
  test("3 required steps + summary; primary save moves card to discovery (rev +1)", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Brief wizard ${Date.now()}`;
    const card = await createInitiative(page, title);
    const initialRev = await card.getByText(/rev/).textContent();

    await card.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    await page.getByRole("menuitem", { name: "Discovery" }).click();

    const dialog = page.getByRole("dialog", { name: "Product brief" });
    await expect(dialog).toBeVisible();

    // The wizard ships the new 3-question order: Why → Who → What.
    // Each step has a "Required" indicator; the rail shows a destructive dot
    // for unanswered required fields, which we assert below.
    await expect(dialog.getByText(/^Required$/i).first()).toBeVisible();

    await fillRichText(page, /Why does this matter/i, "Outcome-shaped thesis");
    await dialog.getByRole("button", { name: "Next" }).click();

    await fillRichText(page, /Who is it for/i, "Frontline ops managers");
    await dialog.getByRole("button", { name: "Next" }).click();

    await fillRichText(
      page,
      /What problem are we solving/i,
      "Pricing decisions take 3+ days",
    );
    await dialog.getByRole("button", { name: "Next" }).click();

    // Summary step: composite renders all three answers as read-only chips
    // with click-to-edit jumps + dual save buttons.
    await expect(
      dialog.getByText(
        /Both buttons save the brief; the primary also moves the card into Discovery/i,
      ),
    ).toBeVisible();

    await dialog.getByTestId("brief-wizard-save-and-start").click();
    await expect(dialog).toBeHidden();

    const discoveryLane = page.locator('section[data-lane="discovery"]');
    const moved = discoveryLane
      .getByRole("listitem")
      .filter({ hasText: title });
    await expect(moved).toBeVisible();

    const nextRev = await moved.getByText(/rev/).textContent();
    expect(initialRev, "revision label present").toMatch(/rev\s+\d+/);
    expect(nextRev, "revision bumps once").not.toEqual(initialRev);

    // Card preview surfaces the truncated problem statement at a glance.
    await expect(moved.getByTestId("card-problem-preview")).toContainText(
      /Pricing decisions/,
    );
  });

  test('"Save brief only" persists answers without leaving idea (S3A.1 demo honesty)', async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Save only ${Date.now()}`;
    const card = await createInitiative(page, title);
    const handle = await card.getAttribute("data-initiative-handle");

    await card.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    await page.getByRole("menuitem", { name: "Discovery" }).click();

    const dialog = page.getByRole("dialog", { name: "Product brief" });
    await expect(dialog).toBeVisible();

    await fillRichText(page, /Why does this matter/i, "Why text");
    await dialog.getByRole("button", { name: "Next" }).click();
    await fillRichText(page, /Who is it for/i, "Who text");
    await dialog.getByRole("button", { name: "Next" }).click();
    await fillRichText(page, /What problem are we solving/i, "What text");
    await dialog.getByRole("button", { name: "Next" }).click();

    // S3A.1: "Save brief only" hits the same endpoint and currently completes
    // the brief. The lifecycle move is the only differentiator at API level —
    // the side-effect kickoff lands in S3A.2.
    await dialog.getByTestId("brief-wizard-save-only").click();
    await expect(dialog).toBeHidden();

    // Reload and confirm the brief preview rendered (proves persistence).
    await page.reload();
    const persisted = page
      .locator(`li[data-initiative-handle="${handle}"]`)
      .first();
    await expect(persisted).toBeVisible();
    await expect(persisted.getByTestId("card-problem-preview")).toContainText(
      /What text/,
    );
  });

  test("required-field guard — Next on empty step keeps focus + shows alert", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Required guard ${Date.now()}`;
    const card = await createInitiative(page, title);

    await card.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    await page.getByRole("menuitem", { name: "Discovery" }).click();

    const dialog = page.getByRole("dialog", { name: "Product brief" });
    await expect(dialog).toBeVisible();

    // Press Next without typing anything — should surface a required alert
    // and remain on step 1.
    await dialog.getByRole("button", { name: "Next" }).click();
    await expect(dialog.getByRole("alert").first()).toContainText(/required/i);
    await expect(
      dialog.getByRole("textbox", { name: /Why does this matter/i }),
    ).toBeVisible();
  });

  test("clean cancel closes; dirty cancel shows discard dialog", async ({
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

    await fillRichText(page, /Why does this matter/i, "Some draft");
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

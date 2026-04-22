import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * S3A.1 cross-lane drag-and-drop — `@dnd-kit/core` only (Q-alt.1).
 *
 * Coverage:
 *   - Pointer drag from a non-source lane to an illegal target is a no-op
 *     (the lane visually dims while the drag is in flight).
 *   - Pointer drag from `discovery` → `design` (after seeding a brief) moves
 *     the card and bumps its revision.
 *   - Pointer drag onto the source lane is a silent no-op (Q-P2.1
 *     `same_lifecycle` is filtered before any API call fires).
 *   - Keyboard-only drag (`Space` to pick up, arrow keys to navigate, `Space`
 *     to drop) executes the same legality matrix and lands the card.
 *
 * Within-lane reorder still uses native HTML5 drag + `Alt+↑/↓` and is
 * covered indirectly by the existing swim-lanes / ideas-crud specs.
 */

async function createInitiative(page: Page, title: string): Promise<Locator> {
  await page.getByRole("button", { name: "Create new initiative" }).click();
  await page.getByLabel(/^title/i).fill(title);
  await page.getByRole("button", { name: "Create idea" }).click();
  const card = page.getByRole("listitem").filter({ hasText: title }).first();
  await expect(card).toBeVisible();
  return card;
}

async function seedBriefForHandle(page: Page, handle: string) {
  const id = await page
    .locator(`li[data-initiative-handle="${handle}"]`)
    .first()
    .getAttribute("data-initiative-id");
  expect(id, `data-initiative-id for ${handle}`).not.toBeNull();
  const response = await page.request.post("/api/test/seed-brief", {
    data: { id },
  });
  expect(response.status(), "seed-brief helper must be enabled").toBe(200);
  await page.reload();
  await expect(page.locator('section[data-lane="idea"]')).toBeVisible();
}

async function moveViaMenu(page: Page, handle: string, label: string) {
  const card = page
    .locator(`li[data-initiative-handle="${handle}"]`)
    .first();
  await card.getByRole("button", { name: /Actions for INIT-/ }).click();
  await page.getByRole("menuitem", { name: "Move to…" }).hover();
  await page.getByRole("menuitem", { name: label }).click();
}

async function pointerDrag(page: Page, source: Locator, target: Locator) {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  expect(sourceBox && targetBox, "drag boxes resolved").toBeTruthy();
  if (!sourceBox || !targetBox) return;

  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2,
  );
  await page.mouse.down();
  // dnd-kit PointerSensor activation distance = 6px (board-dnd.tsx).
  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2 + 12,
    sourceBox.y + sourceBox.height / 2 + 12,
    { steps: 5 },
  );
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 10 },
  );
  await page.mouse.up();
}

test.describe("S3A.1 cross-lane DnD", () => {
  test("pointer drag idea → develop is a no-op (illegal forward edge)", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Illegal DnD ${Date.now()}`;
    const card = await createInitiative(page, title);
    const handle = await card.getAttribute("data-initiative-handle");

    const developLane = page.locator('section[data-lane="develop"]');
    await pointerDrag(page, card, developLane);

    // Card stays in idea (illegal target — no API call fires; the lane
    // dimmed while the drag was in flight).
    await expect(
      page
        .locator('section[data-lane="idea"]')
        .locator(`li[data-initiative-handle="${handle}"]`),
    ).toBeVisible();
    await expect(
      developLane.locator(`li[data-initiative-handle="${handle}"]`),
    ).toHaveCount(0);
  });

  test("pointer drag discovery → design moves the card and bumps revision", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `DnD chain ${Date.now()}`;
    const card = await createInitiative(page, title);
    const handle = (await card.getAttribute(
      "data-initiative-handle",
    )) as string;

    await seedBriefForHandle(page, handle);
    await moveViaMenu(page, handle, "Discovery");

    const inDiscovery = page
      .locator('section[data-lane="discovery"]')
      .locator(`li[data-initiative-handle="${handle}"]`);
    await expect(inDiscovery).toBeVisible();
    const startRev = await inDiscovery.getByText(/rev/).textContent();

    const designLane = page.locator('section[data-lane="design"]');
    await pointerDrag(page, inDiscovery, designLane);

    const inDesign = page
      .locator('section[data-lane="design"]')
      .locator(`li[data-initiative-handle="${handle}"]`);
    await expect(inDesign).toBeVisible();
    const endRev = await inDesign.getByText(/rev/).textContent();
    expect(endRev, "revision bumps after cross-lane DnD").not.toEqual(startRev);
  });

  test("pointer drag onto source lane is a silent no-op (same_lifecycle)", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `DnD self ${Date.now()}`;
    const card = await createInitiative(page, title);
    const handle = (await card.getAttribute(
      "data-initiative-handle",
    )) as string;

    const startRev = await card.getByText(/rev/).textContent();
    const ideaLane = page.locator('section[data-lane="idea"]');
    await pointerDrag(page, card, ideaLane);

    const after = page
      .locator('section[data-lane="idea"]')
      .locator(`li[data-initiative-handle="${handle}"]`)
      .first();
    await expect(after).toBeVisible();
    const endRev = await after.getByText(/rev/).textContent();
    // No API call fired — revision is unchanged.
    expect(endRev).toEqual(startRev);
  });

  test("keyboard-only DnD: Space → arrow → Space lands a legal cross-lane move", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Keyboard DnD ${Date.now()}`;
    const card = await createInitiative(page, title);
    const handle = (await card.getAttribute(
      "data-initiative-handle",
    )) as string;

    await seedBriefForHandle(page, handle);
    await moveViaMenu(page, handle, "Discovery");

    const inDiscovery = page
      .locator('section[data-lane="discovery"]')
      .locator(`li[data-initiative-handle="${handle}"]`);
    await expect(inDiscovery).toBeVisible();
    await inDiscovery.focus();
    // dnd-kit KeyboardSensor: Space picks up; Right arrow steps one lane;
    // Space drops. The hand-rolled coordinate getter (board-dnd.tsx) snaps
    // a single Right press to the next column to the right.
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");

    await expect(
      page
        .locator('section[data-lane="design"]')
        .locator(`li[data-initiative-handle="${handle}"]`),
    ).toBeVisible();
  });
});

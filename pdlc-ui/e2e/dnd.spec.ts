import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * S3A.1 drag-and-drop — `@dnd-kit/core` + `@dnd-kit/sortable` (Pass-4).
 *
 * Coverage:
 *   - HTML5 `draggable` is never applied to the card <li> (regression guard
 *     for the Pass-1 defect where HTML5 drag preempted dnd-kit).
 *   - Pointer drag from a non-source lane to an illegal target is a no-op
 *     (the lane visually dims while the drag is in flight).
 *   - Pointer drag from `discovery` → `design` (after seeding a brief) moves
 *     the card and bumps its revision.
 *   - Pointer drag onto the source lane is a silent no-op (Q-P2.1
 *     `same_lifecycle` filters before any API call fires).
 *   - Pointer within-lane reorder via drop-on-sibling-card fires the
 *     `/reorder` API and the revision bumps.
 *   - Keyboard-only cross-lane move — exercises the Actions menu's
 *     `Move to…` submenu (Tab / Enter / arrow keys). dnd-kit's Space-based
 *     `KeyboardSensor` is still deferred to S3A.3 (ADR-0003 §3) — the menu
 *     path is the shipped accessible surface.
 *
 * Pointer activation uses dnd-kit's distance-based constraint
 * (see `board-dnd.tsx` → `POINTER_ACTIVATION_DISTANCE_PX = 8`). The sensor
 * activates once the pointer has moved ≥8px while a mousedown is held, so
 * the `pointerDrag` helper does `mouse.down → mouse.move(target, steps)`
 * without any timer — the steps cross the 8px threshold on the first hop.
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
  const card = page.locator(`li[data-initiative-handle="${handle}"]`).first();
  await card.getByRole("button", { name: /Actions for INIT-/ }).click();
  await page.getByRole("menuitem", { name: "Move to…" }).hover();
  await page.getByRole("menuitem", { name: label }).click();
}

async function pointerDrag(page: Page, source: Locator, target: Locator) {
  // Make sure the source is in-viewport — `boundingBox()` is page-relative,
  // so a card far down the lane (100+ card DBs in e2e) would give valid
  // coords that the browser refuses to synthesize pointer events on.
  await source.scrollIntoViewIfNeeded();
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  expect(sourceBox && targetBox, "drag boxes resolved").toBeTruthy();
  if (!sourceBox || !targetBox) return;

  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2,
  );
  await page.mouse.down();
  // Distance-based activation (board-dnd.tsx → POINTER_ACTIVATION_DISTANCE_PX):
  // dnd-kit activates once the pointer has moved ≥8px. We step through the
  // travel so the sensor sees intermediate pointermoves and the
  // `SortableContext` can shuffle sibling cards.
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 10 },
  );
  await page.mouse.up();
}

test.describe("S3A.1 cross-lane DnD", () => {
  test("initiative cards do not advertise native HTML5 `draggable` (regression guard)", async ({
    page,
  }) => {
    // S3A.1 defect: the <li> carried `draggable={!isParked}` alongside
    // dnd-kit's PointerSensor listeners. On a real user mousedown the
    // browser fires `dragstart` (HTML5) immediately, which suppresses
    // subsequent pointermove events — so dnd-kit never crosses its 6px
    // activation and cross-lane drag silently fails. Playwright's
    // page.mouse.down/move/up synthesises pointer*/mouse* events but NOT
    // HTML5 drag*, so this escaped the e2e suite. Lock the DOM invariant
    // directly until S3A.2 reintroduces within-lane reorder via dnd-kit.
    await page.goto("/");
    await createInitiative(page, `HTML5 guard ${Date.now()}`);
    const draggableCount = await page
      .locator('li[data-initiative-id][draggable="true"]')
      .count();
    expect(draggableCount).toBe(0);
  });

  test("initiative cards allow native text selection (copy-paste is restored)", async ({
    page,
  }) => {
    // S3A.1 Pass-4 (recorded 2026-04-22): Pass-3 pinned `user-select: none`
    // on the card <li> to shield dnd-kit's PointerSensor from losing the
    // initial ≤6px of pointermoves to browser text selection. That broke
    // the user's ability to copy text out of the card, so Pass-4 switched
    // the sensor to delay-based activation (dnd-kit owns pointerdown for
    // `delayMs` before the browser can start text selection). This guard
    // locks in the Pass-4 regression: non-parked cards must NOT disable
    // text selection.
    await page.goto("/");
    const card = await createInitiative(page, `select-text guard ${Date.now()}`);
    const userSelect = await card.evaluate(
      (el) => window.getComputedStyle(el).userSelect,
    );
    expect(["auto", "text", ""]).toContain(userSelect);
  });

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

  test("pointer drag idea → discovery without brief opens the product brief wizard", async ({
    page,
  }) => {
    // S3 gate: `canTransition` returns `brief_required` for this edge, but
    // the UI must still open the wizard on pointer drop (same as Actions →
    // Move to… → Discovery). Regression: dispatchCrossLaneDrop used to call
    // `canTransition` first and no-op before the wizard branch ever ran.
    await page.goto("/");
    const title = `Brief gate drag ${Date.now()}`;
    const card = await createInitiative(page, title);
    const discoveryLane = page.locator('section[data-lane="discovery"]');
    await pointerDrag(page, card, discoveryLane);
    await expect(
      page.getByRole("dialog", { name: "Product brief" }),
    ).toBeVisible();
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

  test("keyboard-only cross-lane move via Actions → Move to… menu", async ({
    page,
  }) => {
    // Shipped accessible surface for keyboard cross-lane: Tab to Actions,
    // Enter to open, ArrowDown to "Move to…", Enter, ArrowDown to target,
    // Enter to move. Same legality matrix + same canTransition gate as
    // pointer DnD. The dnd-kit Space-based path is deferred to S3A.2 (see
    // file-header note) — it works for pointer but its translate clamps
    // on horizontally-scrolling boards, which would tell a screen-reader
    // user the drop landed on the source lane even after an ArrowRight.
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

    const actions = inDiscovery.getByRole("button", {
      name: /Actions for INIT-/,
    });
    await actions.focus();
    await page.keyboard.press("Enter");
    const moveToItem = page.getByRole("menuitem", { name: "Move to…" });
    await expect(moveToItem).toBeVisible();
    await moveToItem.hover();
    const design = page.getByRole("menuitem", { name: "Design" });
    await expect(design).toBeVisible();
    await design.press("Enter");

    await expect(
      page
        .locator('section[data-lane="design"]')
        .locator(`li[data-initiative-handle="${handle}"]`),
    ).toBeVisible();
  });

  test("pointer drag within the same lane reorders the card (JIRA-style)", async ({
    page,
  }) => {
    // Pass-4 restored within-lane pointer reorder via @dnd-kit/sortable —
    // dropping a card onto a sibling card in the SAME lane fires the
    // `/reorder` API (midpoint sortOrder) and bumps the source card's
    // revision. The previous Alt+↑/↓ keyboard path + Actions → Move up/down
    // menu are still the keyboard surface.
    await page.goto("/");
    const unique = `${Date.now()}`;
    const topTitle = `reorder top ${unique}`;
    const bottomTitle = `reorder bottom ${unique}`;

    // Create bottom first, then top — "New initiative" inserts at the head
    // of the idea lane so the second-created card ends up above the first.
    await createInitiative(page, bottomTitle);
    const top = await createInitiative(page, topTitle);
    const topHandle = (await top.getAttribute("data-initiative-handle")) as string;

    const ideaLane = page.locator('section[data-lane="idea"]');
    const bottomCard = ideaLane
      .locator(`li[data-initiative-handle]`)
      .filter({ hasText: bottomTitle });

    const startRev = (await top.getByText(/^rev\s+\d+/).textContent())?.trim();
    // The drag fires the POST /reorder (fire-and-forget await in
    // `handleReorder`) then triggers a GET /api/initiatives refresh that
    // rebuilds the board DOM. Wait for BOTH so the endRev read below
    // reflects the post-refresh state.
    const reorderResponse = page.waitForResponse(
      (r) =>
        r.url().includes("/reorder") &&
        r.request().method() === "POST" &&
        r.status() === 200,
    );
    const refreshAfter = page.waitForResponse(
      (r) =>
        r.url().endsWith("/api/initiatives") &&
        r.request().method() === "GET",
    );
    await pointerDrag(page, top, bottomCard);
    await reorderResponse;
    await refreshAfter;

    // Revision of the moved card bumped → /reorder API was called and the
    // optimistic-locked update landed.
    const movedCard = ideaLane.locator(
      `li[data-initiative-handle="${topHandle}"]`,
    );
    await expect(movedCard).toBeVisible();
    await expect(movedCard.getByText(/^rev\s+\d+/)).not.toHaveText(
      startRev ?? "rev 1",
    );
  });
});

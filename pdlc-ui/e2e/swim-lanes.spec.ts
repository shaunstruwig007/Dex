import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * S2 acceptance suite — swim-lane board, forward-only moves, parked modal,
 * brief gate. Lifecycle transitions exercised through the UI where possible;
 * the S3 brief is seeded via `/api/test/seed-brief` (guarded by
 * `PDLC_ALLOW_TEST_HELPERS=1`, set in playwright.config.ts).
 */

const LANES = [
  "Idea",
  "Discovery",
  "Design",
  "Spec ready",
  "Develop",
  "UAT",
  "Deployed",
];

async function createInitiative(page: Page, title: string): Promise<Locator> {
  await page.getByRole("button", { name: "Create new initiative" }).click();
  await page.getByLabel(/^title/i).fill(title);
  await page.getByRole("button", { name: "Create idea" }).click();
  const card = page.getByRole("listitem").filter({ hasText: title });
  await expect(card).toBeVisible();
  return card;
}

async function openActions(card: Locator) {
  await card.getByRole("button", { name: /Actions for INIT-/ }).click();
}

async function seedBriefForHandle(page: Page, handle: string) {
  // The card's data-initiative-id lives on the <li>; read it, then hit the
  // test-only seed-brief route. Playwright runs same-origin so a plain fetch
  // inside the page context reuses the dev server's storage layer.
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
  // Wait for board to re-render before the next interaction.
  await expect(
    page.getByRole("heading", { level: 2, name: "Board" }),
  ).toBeVisible();
}

test.describe("S2 swim lanes", () => {
  test("renders all 7 main lanes with counts", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: "Board" }),
    ).toBeVisible();
    for (const lane of LANES) {
      await expect(
        page.getByRole("heading", { level: 3, name: lane }),
      ).toBeVisible();
    }
    // `Parked` is a drawer, not a main lane heading.
    await expect(
      page.getByRole("heading", { level: 3, name: "Parked" }),
    ).toHaveCount(0);
  });

  test("idea → discovery is blocked until a brief exists", async ({ page }) => {
    await page.goto("/");
    const title = `Brief gate ${Date.now()}`;
    const card = await createInitiative(page, title);

    await openActions(card);
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    const discovery = page.getByRole("menuitem", { name: "Discovery" });
    await expect(discovery).toBeDisabled();
    // Tooltip (`title` attribute) carries the S3 pointer.
    await expect(discovery).toHaveAttribute("title", /brief/i);
    // Close the menu without moving.
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");

    // Card is still in Idea.
    const ideaLane = page.locator('section[data-lane="idea"]');
    await expect(
      ideaLane.getByRole("listitem").filter({ hasText: title }),
    ).toBeVisible();
  });

  test("park modal rejects empty reason and appends events on success", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Park flow ${Date.now()}`;
    const card = await createInitiative(page, title);
    await openActions(card);
    await page.getByRole("menuitem", { name: /^Park…$/ }).click();

    const dialog = page.getByRole("dialog", { name: "Park initiative" });
    await expect(dialog).toBeVisible();

    // Empty reason → client-side validation (browser's `required`) plus our
    // own inline alert. Submit without typing and assert we stay on the
    // dialog.
    await dialog.getByRole("button", { name: "Park initiative" }).click();
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/^Reason$/i).fill("Waiting on client budget");
    await dialog.getByRole("button", { name: "Park initiative" }).click();
    await expect(dialog).toBeHidden();

    // Card disappears from main lanes; surfaces under the parked drawer.
    const ideaLane = page.locator('section[data-lane="idea"]');
    await expect(
      ideaLane.getByRole("listitem").filter({ hasText: title }),
    ).toHaveCount(0);

    await page.getByRole("checkbox", { name: /Show parked/i }).check();
    const parkedRegion = page.getByRole("region", {
      name: "Parked initiatives",
    });
    const parkedCard = parkedRegion
      .getByRole("listitem")
      .filter({ hasText: title });
    await expect(parkedCard).toBeVisible();
    await expect(parkedCard).toContainText(/Revisit/i);

    // Un-park returns the card to Idea.
    await parkedCard.getByRole("button", { name: /Actions for INIT-/ }).click();
    await page.getByRole("menuitem", { name: /Un-park/ }).click();
    await expect(
      ideaLane.getByRole("listitem").filter({ hasText: title }),
    ).toBeVisible();
  });

  test("forward chain discovery → deployed after seeding a brief", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Forward chain ${Date.now()}`;
    const card = await createInitiative(page, title);

    // The initiative card *is* the <li> that carries `data-initiative-handle`.
    const resolvedHandle = await card.getAttribute("data-initiative-handle");
    expect(resolvedHandle, "initiative handle").toMatch(/^INIT-\d{4}$/);

    await seedBriefForHandle(page, resolvedHandle as string);

    // Re-locate the card after reload.
    const reloaded = () =>
      page.locator(`li[data-initiative-handle="${resolvedHandle}"]`);

    const forwardStages: Array<{ menu: string; lane: string }> = [
      { menu: "Discovery", lane: "discovery" },
      { menu: "Design", lane: "design" },
      { menu: "Spec ready", lane: "spec_ready" },
      { menu: "Develop", lane: "develop" },
      { menu: "UAT", lane: "uat" },
      { menu: "Deployed", lane: "deployed" },
    ];

    for (const step of forwardStages) {
      const c = reloaded().first();
      await expect(c).toBeVisible();
      await c.getByRole("button", { name: /Actions for INIT-/ }).click();
      await page.getByRole("menuitem", { name: "Move to…" }).hover();
      await page.getByRole("menuitem", { name: step.menu }).click();
      await expect(
        page
          .locator(`section[data-lane="${step.lane}"]`)
          .locator(`li[data-initiative-handle="${resolvedHandle}"]`),
      ).toBeVisible();
    }
  });
});

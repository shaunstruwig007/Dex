import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * S3A.1 swim-lane acceptance — chrome-light shell, 7 main lanes + parked
 * rail (collapsed by default), forward-only moves, parked modal, brief
 * gate. Lifecycle transitions exercised through the UI; the S3 brief is
 * seeded via `/api/test/seed-brief` (guarded by `PDLC_ALLOW_TEST_HELPERS=1`,
 * set in playwright.config.ts).
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
  await expect(card.first()).toBeVisible();
  return card.first();
}

async function openActions(card: Locator) {
  await card.getByRole("button", { name: /Actions for INIT-/ }).click();
}

async function expandParkedRail(page: Page) {
  const toggle = page.getByRole("button", { name: /Expand parked rail/i });
  if (await toggle.isVisible().catch(() => false)) {
    await toggle.click();
  }
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

test.describe("S3A.1 swim lanes", () => {
  test("renders all 7 main lanes with counts; parked rail starts collapsed", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator('section[data-lane="idea"]')).toBeVisible();
    for (const lane of LANES) {
      await expect(
        page.getByRole("heading", { level: 3, name: lane }),
      ).toBeVisible();
    }
    // Parked is the right-edge rail, not a main lane.
    await expect(
      page.getByRole("heading", { level: 3, name: "Parked" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Expand parked rail/i }),
    ).toBeVisible();
  });

  test("idea → discovery opens the product brief wizard (S3)", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Brief gate ${Date.now()}`;
    const card = await createInitiative(page, title);

    await openActions(card);
    await page.getByRole("menuitem", { name: "Move to…" }).hover();
    const discovery = page.getByRole("menuitem", { name: "Discovery" });
    await expect(discovery).toBeEnabled();
    await discovery.click();

    const dialog = page.getByRole("dialog", { name: "Product brief" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();

    const ideaLane = page.locator('section[data-lane="idea"]');
    await expect(
      ideaLane.getByRole("listitem").filter({ hasText: title }),
    ).toBeVisible();
  });

  test("park modal rejects empty reason and surfaces card in parked rail", async ({
    page,
  }) => {
    await page.goto("/");
    const title = `Park flow ${Date.now()}`;
    const card = await createInitiative(page, title);
    await openActions(card);
    await page.getByRole("menuitem", { name: /^Park…$/ }).click();

    const dialog = page.getByRole("dialog", { name: "Park initiative" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Park initiative" }).click();
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/^Reason$/i).fill("Waiting on client budget");
    await dialog.getByRole("button", { name: "Park initiative" }).click();
    await expect(dialog).toBeHidden();

    const ideaLane = page.locator('section[data-lane="idea"]');
    await expect(
      ideaLane.getByRole("listitem").filter({ hasText: title }),
    ).toHaveCount(0);

    await expandParkedRail(page);
    const parkedList = page.getByRole("list", { name: "Parked initiatives" });
    const parkedCard = parkedList
      .getByRole("listitem")
      .filter({ hasText: title });
    await expect(parkedCard).toBeVisible();
    await expect(parkedCard).toContainText(/Revisit/i);

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

    const resolvedHandle = await card.getAttribute("data-initiative-handle");
    expect(resolvedHandle, "initiative handle").toMatch(/^INIT-\d{4}$/);

    await seedBriefForHandle(page, resolvedHandle as string);

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

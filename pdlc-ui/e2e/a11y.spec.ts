import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function runAxe(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
}

test.describe("a11y — S1 surfaces", () => {
  test("ideas list has no critical/serious axe violations", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: "Ideas" }),
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
    await page.getByRole("button", { name: "Create new idea" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const blocking = await runAxe(page);
    expect(
      blocking,
      blocking.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toEqual([]);
  });
});

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { eventSchema, initiativeSchema } from "./initiative";

const __dir = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(
  __dir,
  "../../../plans/PDLC_UI/fixtures/initiative-example.json",
);

describe("initiativeSchema", () => {
  it("parses golden fixture", () => {
    const raw = JSON.parse(readFileSync(fixturePath, "utf8"));
    const parsed = initiativeSchema.safeParse(raw);
    expect(parsed.success, JSON.stringify(parsed.error?.format())).toBe(true);
  });
});

describe("eventSchema", () => {
  it("accepts create + delete kinds (S1 minimum)", () => {
    const now = "2026-04-21T10:00:00.000Z";
    expect(
      eventSchema.safeParse({
        at: now,
        by: "shaun",
        kind: "create",
        payload: {},
      }).success,
    ).toBe(true);
    expect(
      eventSchema.safeParse({
        at: now,
        by: "shaun",
        kind: "delete",
        payload: {},
      }).success,
    ).toBe(true);
  });

  it("rejects unknown kinds", () => {
    const result = eventSchema.safeParse({
      at: "2026-04-21T10:00:00.000Z",
      by: "shaun",
      kind: "invented_kind",
      payload: {},
    });
    expect(result.success).toBe(false);
  });

  it("requires a non-empty `by`", () => {
    const result = eventSchema.safeParse({
      at: "2026-04-21T10:00:00.000Z",
      by: "",
      kind: "create",
    });
    expect(result.success).toBe(false);
  });
});

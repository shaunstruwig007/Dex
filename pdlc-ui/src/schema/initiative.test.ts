import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  briefSchema,
  eventSchema,
  initiativeSchema,
  missingForCompleteBrief,
} from "./initiative";

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

  it("accepts empty brief object on a fresh card", () => {
    const raw = JSON.parse(readFileSync(fixturePath, "utf8")) as Record<
      string,
      unknown
    >;
    raw.brief = {};
    raw.lifecycle = "idea";
    raw.revision = 1;
    raw.discovery = {};
    raw.events = [
      {
        at: "2026-04-21T10:00:00.000Z",
        by: "shaun",
        kind: "create",
        payload: { handle: "INIT-0001" },
      },
    ];
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
        payload: { handle: "INIT-0001" },
      }).success,
    ).toBe(true);
    expect(
      eventSchema.safeParse({
        at: now,
        by: "shaun",
        kind: "delete",
        payload: { handle: "INIT-0001" },
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

  it("enforces skill_run payload shape", () => {
    const ok = eventSchema.safeParse({
      at: "2026-04-21T10:00:00.000Z",
      by: "shaun",
      kind: "skill_run",
      payload: { skill: "pdlc-brief-custom", iteration: 1 },
    });
    expect(ok.success).toBe(true);

    const bad = eventSchema.safeParse({
      at: "2026-04-21T10:00:00.000Z",
      by: "shaun",
      kind: "skill_run",
      payload: { skill: "pdlc-brief-custom" },
    });
    expect(bad.success).toBe(false);
  });
});

// S3A.1 — briefCompleteRefine (Q2): brief.complete === true must imply
// problem + targetUsers + coreValue envelopes are populated.
describe("briefSchema — completeness invariant (S3A.1)", () => {
  const env = (value: string) => ({
    value,
    confidence: "high" as const,
    source: "user" as const,
  });
  const completeBrief = {
    problem: env("<p>p</p>"),
    targetUsers: env("<p>u</p>"),
    coreValue: env("<p>v</p>"),
    complete: true,
  };

  it("accepts an empty brief object", () => {
    expect(briefSchema.safeParse({}).success).toBe(true);
  });

  it("accepts a brief with only the 3 required envelopes when complete", () => {
    expect(briefSchema.safeParse(completeBrief).success).toBe(true);
  });

  it("rejects complete=true when any required envelope is empty", () => {
    const r1 = briefSchema.safeParse({
      ...completeBrief,
      problem: env("<p></p>"),
    });
    expect(r1.success).toBe(false);
    const r2 = briefSchema.safeParse({
      ...completeBrief,
      targetUsers: undefined,
    });
    expect(r2.success).toBe(false);
  });

  it("missingForCompleteBrief lists the empty fields", () => {
    expect(missingForCompleteBrief({ ...completeBrief })).toEqual([]);
    expect(
      missingForCompleteBrief({
        ...completeBrief,
        coreValue: env("<p></p>"),
      }),
    ).toEqual(["coreValue"]);
  });
});


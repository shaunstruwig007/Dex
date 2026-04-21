import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { initiativeSchema } from "./initiative";

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

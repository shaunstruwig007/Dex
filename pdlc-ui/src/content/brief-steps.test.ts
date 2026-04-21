import { describe, expect, it } from "vitest";
import {
  assertRequiredFlagsInContent,
  briefStepsFileSchema,
  loadBriefSteps,
  REQUIRED_BRIEF_FIELDS,
} from "./brief-steps";

describe("brief-steps", () => {
  it("parses bundled JSON and rejects unknown top-level keys via strict()", () => {
    const steps = loadBriefSteps();
    expect(steps.version).toBe(1);
    expect(steps.steps.length).toBeGreaterThan(0);
    expect(() =>
      briefStepsFileSchema.parse({
        version: 1,
        steps: steps.steps,
        extra: 1,
      }),
    ).toThrow();
  });

  it("marks required-for-complete fields as required in content", () => {
    const { steps } = loadBriefSteps();
    assertRequiredFlagsInContent(steps);
    for (const f of REQUIRED_BRIEF_FIELDS) {
      const step = steps.find((s) => s.field === f);
      expect(step?.required, f).toBe(true);
    }
  });
});

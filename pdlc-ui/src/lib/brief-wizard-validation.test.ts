import { describe, expect, it } from "vitest";
import { validateBriefWizardAnswers } from "./brief-wizard-validation";

describe("validateBriefWizardAnswers", () => {
  const base = {
    problem: "<p>a</p>",
    targetUsers: "<p>b</p>",
    coreValue: "<p>c</p>",
    successDefinition: "<p>d</p>",
    constraints: "<p></p>",
    scopeIn: ["x"],
    scopeOut: [],
    assumptions: ["y"],
    understandingSummary: "<p></p>",
    openQuestions: [],
  };

  it("returns empty when all required fields are populated", () => {
    expect(validateBriefWizardAnswers(base)).toEqual([]);
  });

  it("returns field ids for empty HTML prose", () => {
    expect(
      validateBriefWizardAnswers({ ...base, problem: "<p></p>" }),
    ).toContain("problem");
  });

  it("requires at least one scopeIn and one assumption line", () => {
    expect(
      validateBriefWizardAnswers({ ...base, scopeIn: ["", "  "] }),
    ).toContain("scopeIn");
    expect(validateBriefWizardAnswers({ ...base, assumptions: [] })).toContain(
      "assumptions",
    );
  });
});

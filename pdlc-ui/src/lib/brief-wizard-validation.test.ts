import { describe, expect, it } from "vitest";
import {
  briefWizardAnswersSchema,
  validateBriefWizardAnswers,
} from "./brief-wizard-validation";

describe("validateBriefWizardAnswers", () => {
  // S3A.1 narrowed required-for-complete to the 3-field set
  // (`problem`, `targetUsers`, `coreValue`). Legacy keys + `openQuestions`
  // are optional in the wizard payload (Q1 option b).
  const required = {
    problem: "<p>a</p>",
    targetUsers: "<p>b</p>",
    coreValue: "<p>c</p>",
  };

  it("returns empty when the 3 required fields are populated", () => {
    expect(validateBriefWizardAnswers(required)).toEqual([]);
  });

  it.each([
    ["problem", { ...required, problem: "<p></p>" }, "problem"],
    ["targetUsers", { ...required, targetUsers: "<p></p>" }, "targetUsers"],
    ["coreValue", { ...required, coreValue: "<p></p>" }, "coreValue"],
  ])("flags missing %s when prose is blank", (_label, answers, field) => {
    expect(validateBriefWizardAnswers(answers)).toContain(field);
  });

  it("ignores legacy fields that the wizard no longer surfaces", () => {
    const withLegacy = {
      ...required,
      successDefinition: "<p></p>",
      scopeIn: [],
      assumptions: [],
      openQuestions: [],
      scopeOut: [],
      constraints: "<p></p>",
      understandingSummary: "<p></p>",
    };
    expect(validateBriefWizardAnswers(withLegacy)).toEqual([]);
  });
});

describe("briefWizardAnswersSchema (Q1 option b)", () => {
  it("accepts a payload with only the 3 required content fields", () => {
    const parsed = briefWizardAnswersSchema.parse({
      problem: "<p>a</p>",
      targetUsers: "<p>b</p>",
      coreValue: "<p>c</p>",
    });
    expect(parsed.openQuestions).toBeUndefined();
    expect(parsed.scopeIn).toBeUndefined();
    expect(parsed.successDefinition).toBeUndefined();
  });

  it("still accepts legacy payloads with all fields populated", () => {
    const parsed = briefWizardAnswersSchema.parse({
      problem: "<p>a</p>",
      targetUsers: "<p>b</p>",
      coreValue: "<p>c</p>",
      successDefinition: "<p>d</p>",
      constraints: "<p>e</p>",
      scopeIn: ["one"],
      scopeOut: ["two"],
      assumptions: ["three"],
      understandingSummary: "<p>f</p>",
      openQuestions: ["four"],
    });
    expect(parsed.scopeIn).toEqual(["one"]);
    expect(parsed.openQuestions).toEqual(["four"]);
  });
});

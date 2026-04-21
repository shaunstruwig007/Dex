import { z } from "zod";

/** Wizard + `POST .../brief` body — shared client/server shape. */
export const briefWizardAnswersSchema = z.object({
  problem: z.string(),
  targetUsers: z.string(),
  coreValue: z.string(),
  successDefinition: z.string(),
  constraints: z.string(),
  scopeIn: z.array(z.string()),
  scopeOut: z.array(z.string()),
  assumptions: z.array(z.string()),
  understandingSummary: z.string(),
  openQuestions: z.array(z.string()),
});

export type BriefWizardAnswersInput = z.infer<typeof briefWizardAnswersSchema>;

function textFromHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Server-side guard — mirrors required-for-complete in schema doc §4.2. */
export function validateBriefWizardAnswers(
  answers: BriefWizardAnswersInput,
): string[] {
  const missing: string[] = [];
  if (textFromHtml(answers.problem).length === 0) missing.push("problem");
  if (textFromHtml(answers.targetUsers).length === 0)
    missing.push("targetUsers");
  if (textFromHtml(answers.coreValue).length === 0) missing.push("coreValue");
  if (textFromHtml(answers.successDefinition).length === 0) {
    missing.push("successDefinition");
  }
  const scopeIn = answers.scopeIn.map((s) => s.trim()).filter(Boolean);
  if (scopeIn.length === 0) missing.push("scopeIn");
  const assumptions = answers.assumptions.map((s) => s.trim()).filter(Boolean);
  if (assumptions.length === 0) missing.push("assumptions");
  return missing;
}

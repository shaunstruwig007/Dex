import { z } from "zod";

/**
 * Wizard + `POST .../brief` body — shared client/server shape.
 *
 * S3A.1 narrowing (Q1 option b — see [s3a.1 plan]):
 * - The wizard only surfaces 3 required content steps (`problem`,
 *   `targetUsers`, `coreValue`) + a summary step (`understandingSummary`).
 * - Legacy fields (`successDefinition`, `constraints`, `scopeIn`, `scopeOut`,
 *   `assumptions`) and `openQuestions` are **optional** in the payload so
 *   - existing callers / fixtures that still send them keep working;
 *   - the new wizard can omit them entirely;
 *   - the server's `mergeDiscoveryDraftQuestions` short-circuits cleanly when
 *     `openQuestions` is undefined / missing (no merge, no event).
 */
export const briefWizardAnswersSchema = z.object({
  problem: z.string(),
  targetUsers: z.string(),
  coreValue: z.string(),
  successDefinition: z.string().optional(),
  constraints: z.string().optional(),
  scopeIn: z.array(z.string()).optional(),
  scopeOut: z.array(z.string()).optional(),
  assumptions: z.array(z.string()).optional(),
  understandingSummary: z.string().optional(),
  openQuestions: z.array(z.string()).optional(),
});

export type BriefWizardAnswersInput = z.infer<typeof briefWizardAnswersSchema>;

function textFromHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Server-side guard — mirrors `REQUIRED_FOR_COMPLETE_BRIEF` in
 * `@/schema/initiative` and the schema doc §4.2 (3 required fields).
 * Returns the field names that still need content to set `brief.complete`.
 */
export function validateBriefWizardAnswers(
  answers: BriefWizardAnswersInput,
): string[] {
  const missing: string[] = [];
  if (textFromHtml(answers.problem).length === 0) missing.push("problem");
  if (textFromHtml(answers.targetUsers).length === 0)
    missing.push("targetUsers");
  if (textFromHtml(answers.coreValue).length === 0) missing.push("coreValue");
  return missing;
}

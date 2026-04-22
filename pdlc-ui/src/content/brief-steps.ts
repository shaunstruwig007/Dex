import { z } from "zod";
import raw from "../../content/pdlc-brief-steps.json";

const stepTypeSchema = z.enum(["richtext", "text", "list"]);

export const briefStepSchema = z
  .object({
    id: z.string().min(1),
    round: z.number().int().min(1).max(3),
    field: z.enum([
      "problem",
      "targetUsers",
      "coreValue",
      "successDefinition",
      "constraints",
      "scopeIn",
      "scopeOut",
      "assumptions",
      "understandingSummary",
      "openQuestions",
    ]),
    type: stepTypeSchema,
    label: z.string().min(1),
    help: z.string(),
    required: z.boolean(),
  })
  .strict();

export const briefStepsFileSchema = z
  .object({
    version: z.literal(1),
    steps: z.array(briefStepSchema).min(1),
  })
  .strict();

export type BriefStep = z.infer<typeof briefStepSchema>;
export type BriefStepsFile = z.infer<typeof briefStepsFileSchema>;

/**
 * Required-for-complete fields (wizard + server + schema doc).
 *
 * S3A.1 narrows the wizard to **why → who → what** — `coreValue`,
 * `targetUsers`, `problem` — plus a summary step. Legacy fields stay optional
 * on the JSON (no longer rendered by the wizard) and on the runtime
 * `briefSchema`. See `pdlc-ui/content/pdlc-brief-steps.json` for ordering.
 */
export const REQUIRED_BRIEF_FIELDS = [
  "problem",
  "targetUsers",
  "coreValue",
] as const satisfies readonly BriefStep["field"][];

export function loadBriefSteps(): BriefStepsFile {
  return briefStepsFileSchema.parse(raw);
}

/** Ensures JSON carries `required: true` for every contract field. */
export function assertRequiredFlagsInContent(steps: BriefStep[]): void {
  const byField = new Map(steps.map((s) => [s.field, s]));
  for (const f of REQUIRED_BRIEF_FIELDS) {
    const step = byField.get(f);
    if (!step) {
      throw new Error(`brief-steps: missing step for required field "${f}"`);
    }
    if (!step.required) {
      throw new Error(
        `brief-steps: field "${f}" must have required: true in pdlc-brief-steps.json`,
      );
    }
  }
}

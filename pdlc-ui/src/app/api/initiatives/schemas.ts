import { z } from "zod";
import { briefWizardAnswersSchema } from "@/lib/brief-wizard-validation";
import { lifecycleSchema } from "@/schema/initiative";

export const createInitiativeBody = z.object({
  title: z.string().min(1, "title_required"),
  body: z.string().optional().default(""),
});
export type CreateInitiativeBody = z.infer<typeof createInitiativeBody>;

export const updateInitiativeBody = z.object({
  expectedRevision: z.number().int().min(1),
  title: z.string().min(1, "title_required").optional(),
  body: z.string().optional(),
});
export type UpdateInitiativeBody = z.infer<typeof updateInitiativeBody>;

export const deleteInitiativeBody = z.object({
  expectedRevision: z.number().int().min(1),
  note: z.string().optional(),
});
export type DeleteInitiativeBody = z.infer<typeof deleteInitiativeBody>;

/**
 * S2 — stage transition. `parkedIntent` + `parkedReason` are required on any
 * `→ parked` move; the repository re-validates via `canTransition` so we don't
 * need a conditional schema here.
 */
export const transitionInitiativeBody = z.object({
  expectedRevision: z.number().int().min(1),
  to: lifecycleSchema,
  parkedIntent: z.enum(["revisit", "wont_consider"]).optional(),
  parkedReason: z.string().optional(),
  note: z.string().optional(),
});
export type TransitionInitiativeBody = z.infer<typeof transitionInitiativeBody>;

export const reorderInitiativeBody = z.object({
  expectedRevision: z.number().int().min(1),
  sortOrder: z.number().int(),
});
export type ReorderInitiativeBody = z.infer<typeof reorderInitiativeBody>;

export const saveBriefAndTransitionBody = z.object({
  expectedRevision: z.number().int().min(1),
  answers: briefWizardAnswersSchema,
  now: z.string().datetime().optional(),
});
export type SaveBriefAndTransitionBody = z.infer<
  typeof saveBriefAndTransitionBody
>;

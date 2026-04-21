import { z } from "zod";

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

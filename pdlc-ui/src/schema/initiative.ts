import { z } from "zod";

/**
 * Initiative schema — runtime contract for pdlc-ui.
 * Source of truth: plans/PDLC_UI/schema-initiative-v0.md
 *
 * Canonical field case is camelCase (R16). Any root-field or event-kind change
 * MUST update the schema doc and regenerate the JSON Schema in the same PR.
 */

export const lifecycleSchema = z.enum([
  "idea",
  "discovery",
  "design",
  "spec_ready",
  "develop",
  "uat",
  "deployed",
  "parked",
]);
export type Lifecycle = z.infer<typeof lifecycleSchema>;

/**
 * Event kinds — S1 ships "create" and "delete" (seed).
 * "stage_transition" joins in S2; "field_edit" / "skill_run" / "review" are
 * reserved per schema-initiative-v0.md §6.
 */
export const eventKindSchema = z.enum([
  "create",
  "delete",
  "stage_transition",
  "field_edit",
  "skill_run",
  "review",
]);
export type EventKind = z.infer<typeof eventKindSchema>;

export const eventSchema = z.object({
  at: z.string(),
  by: z.string().min(1),
  kind: eventKindSchema,
  payload: z.record(z.string(), z.unknown()).default({}),
});
export type InitiativeEvent = z.infer<typeof eventSchema>;

const recordObject = z.record(z.string(), z.unknown());

export const initiativeSchema = z.object({
  schemaVersion: z.literal(1),
  revision: z.number().int().min(1),
  id: z.string().min(1),
  handle: z.string().regex(/^INIT-\d{4}$/),
  title: z.string(),
  body: z.string(),
  lifecycle: lifecycleSchema,
  parkedIntent: z.enum(["revisit", "wont_consider"]).nullable(),
  parkedReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  gate: recordObject,
  brief: recordObject,
  discovery: recordObject,
  design: recordObject,
  spec: recordObject,
  release: recordObject,
  sourceRefs: z.array(recordObject),
  attachments: z.array(recordObject),
  events: z.array(eventSchema),
  linkedPrdPath: z.string().nullable(),
  strategyPillarIds: z.array(z.string()),
  strategyWarning: z.string().nullable(),
});

export type Initiative = z.infer<typeof initiativeSchema>;

/** Empty-stage-object factory — keeps shape consistent with the golden fixture. */
export function emptyInitiativeStages() {
  return {
    gate: {},
    brief: {},
    discovery: {},
    design: {},
    spec: {},
    release: {},
  } satisfies Pick<
    Initiative,
    "gate" | "brief" | "discovery" | "design" | "spec" | "release"
  >;
}

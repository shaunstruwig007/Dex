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
 * Event kinds — closed enum. S1 shipped "create" + "delete"; S2 activates
 * "stage_transition" (lane moves) and "field_edit" (sortOrder reorders).
 * "skill_run" / "review" are reserved per schema-initiative-v0.md §6.
 * Adding a kind requires updating §6 + the golden fixture in the same PR.
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

const atSchema = z.string();
const bySchema = z.string().min(1);

/**
 * Discriminated union — `skill_run` payload is enforced (S3).
 * Other kinds use structured cores + passthrough for forward-compatible extras.
 */
export const eventSchema = z.discriminatedUnion("kind", [
  z.object({
    at: atSchema,
    by: bySchema,
    kind: z.literal("create"),
    payload: z.object({ handle: z.string() }).passthrough(),
  }),
  z.object({
    at: atSchema,
    by: bySchema,
    kind: z.literal("delete"),
    payload: z.object({ handle: z.string() }).passthrough(),
  }),
  z.object({
    at: atSchema,
    by: bySchema,
    kind: z.literal("stage_transition"),
    payload: z
      .object({
        from: lifecycleSchema,
        to: lifecycleSchema,
      })
      .passthrough(),
  }),
  z.object({
    at: atSchema,
    by: bySchema,
    kind: z.literal("field_edit"),
    payload: z
      .object({
        field: z.string(),
        before: z.unknown().nullable(),
        after: z.unknown(),
      })
      .passthrough(),
  }),
  z.object({
    at: atSchema,
    by: bySchema,
    kind: z.literal("skill_run"),
    payload: z.object({
      skill: z.string(),
      iteration: z.number().int().min(1),
    }),
  }),
  z.object({
    at: atSchema,
    by: bySchema,
    kind: z.literal("review"),
    payload: z.record(z.string(), z.unknown()),
  }),
]);
export type InitiativeEvent = z.infer<typeof eventSchema>;

const recordObject = z.record(z.string(), z.unknown());

const confidenceSchema = z.enum(["high", "med", "low"]).default("high");
const sourceSchema = z
  .enum(["user", "agent_draft", "meeting_cited", "signal_cited", "imported"])
  .default("user");

/** HTML or plain string in `value` — UI renders via RichTextRenderer when HTML. */
const stringFieldEnvelopeSchema = z.object({
  value: z.string(),
  confidence: confidenceSchema,
  source: sourceSchema,
  sourceRef: z.string().nullable().optional(),
  reviewedBy: z.string().nullable().optional(),
  reviewedAt: z.string().nullable().optional(),
  updatedAt: z.string().optional(),
});

const stringListFieldEnvelopeSchema = z.object({
  value: z.array(z.string()),
  confidence: confidenceSchema,
  source: sourceSchema,
  sourceRef: z.string().nullable().optional(),
  reviewedBy: z.string().nullable().optional(),
  reviewedAt: z.string().nullable().optional(),
  updatedAt: z.string().optional(),
});

const assumptionRowSchema = z.object({
  text: z.string(),
  validation: z.string().nullable().optional(),
  confidence: confidenceSchema,
  source: sourceSchema,
  reviewedBy: z.string().nullable().optional(),
});

/**
 * `brief` — S3A.1 narrows the **required-for-complete** set to three fields
 * (`problem`, `targetUsers`, `coreValue`). Legacy keys (`scopeIn`, `scopeOut`,
 * `assumptions`, `constraints`, `successDefinition`, `understandingSummary`)
 * stay optional on the object so existing rows still parse — see
 * schema-initiative-v0 §4.2.
 *
 * Empty `{}` remains valid for fresh initiatives. The `briefCompleteRefine`
 * below enforces the parse-time invariant on cards whose `complete === true`.
 */
const REQUIRED_FOR_COMPLETE = ["problem", "targetUsers", "coreValue"] as const;
type RequiredForComplete = (typeof REQUIRED_FOR_COMPLETE)[number];

function envelopeHasText(
  envelope: z.infer<typeof stringFieldEnvelopeSchema> | undefined,
): boolean {
  if (!envelope) return false;
  const text = envelope.value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0;
}

/**
 * Shared `brief.complete === true` ⇒ all 3 required envelopes present + non-empty
 * invariant. Called from both `briefSchema.superRefine` (parse-time) and
 * `saveBriefAndTransition` in the repository (server-side guard) so the
 * contract is enforced in exactly one place.
 *
 * Returns the list of missing field names (empty array means "complete is OK").
 */
export function missingForCompleteBrief(
  brief: Pick<
    z.infer<ReturnType<typeof briefObject>>,
    RequiredForComplete | "complete"
  >,
): RequiredForComplete[] {
  const missing: RequiredForComplete[] = [];
  for (const f of REQUIRED_FOR_COMPLETE) {
    if (!envelopeHasText(brief[f])) missing.push(f);
  }
  return missing;
}

function briefObject() {
  return z
    .object({
      problem: stringFieldEnvelopeSchema.optional(),
      targetUsers: stringFieldEnvelopeSchema.optional(),
      coreValue: stringFieldEnvelopeSchema.optional(),
      scopeIn: stringListFieldEnvelopeSchema.optional(),
      scopeOut: stringListFieldEnvelopeSchema.optional(),
      assumptions: z.array(assumptionRowSchema).optional(),
      constraints: stringFieldEnvelopeSchema.optional(),
      successDefinition: stringFieldEnvelopeSchema.optional(),
      understandingSummary: stringFieldEnvelopeSchema.optional(),
      complete: z.boolean().optional(),
      reviewedAt: z.string().nullable().optional(),
      reviewedBy: z.string().nullable().optional(),
    })
    .strict();
}

export const briefSchema = briefObject().superRefine((brief, ctx) => {
  if (brief.complete !== true) return;
  const missing = missingForCompleteBrief(brief);
  for (const field of missing) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `brief.${field} is required when brief.complete is true`,
      path: [field],
    });
  }
});

export type BriefState = z.infer<typeof briefSchema>;
export const REQUIRED_FOR_COMPLETE_BRIEF = REQUIRED_FOR_COMPLETE;

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
  sortOrder: z.number().int().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  gate: recordObject,
  brief: briefSchema,
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

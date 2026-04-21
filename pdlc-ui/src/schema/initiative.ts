import { z } from "zod";

/** Lifecycle values — must match plans/PDLC_UI/schema-initiative-v0.md */
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
  events: z.array(recordObject),
  linkedPrdPath: z.string().nullable(),
  strategyPillarIds: z.array(z.string()),
  strategyWarning: z.string().nullable(),
});

export type Initiative = z.infer<typeof initiativeSchema>;

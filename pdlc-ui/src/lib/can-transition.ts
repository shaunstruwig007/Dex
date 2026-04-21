import type { Initiative, Lifecycle } from "@/schema/initiative";

/**
 * canTransition — pure Sprint 2 forward-move + parked matrix.
 *
 * Authority: plans/PDLC_UI/lifecycle-transitions.md (canonical order) and
 * plans/PDLC_UI/sprint-backlog.md § Sprint 2 (S2 scope = forward only).
 *
 * No I/O, no imports from `@/storage/*`. Callers (repository, API, UI menu
 * logic) pass the pre-computed `context` so the function stays testable and
 * the UI can call it with derived state during render.
 *
 * Sprint 2 contract:
 * - Forward edges only (backward moves are Sprint 8 — they are rejected here
 *   with `illegal_transition`).
 * - `idea → discovery` is blocked until the product brief gate is satisfied
 *   (Sprint 3 wires the real wizard; S2 uses `hasBrief` as a derived flag).
 * - Any `* → parked` requires both `parkedIntent ∈ {revisit, wont_consider}`
 *   and a non-empty trimmed `parkedReason`.
 * - `parked → idea` is the only un-park path; it clears parked fields
 *   (the repository handles the actual clear on a successful transition).
 *
 * TODO(S3): replace `hasBrief` with a stronger gate when the product-brief
 *   wizard lands. Any change to the derivation must also update any UI call
 *   sites in the same PR (R16 guardrail 1).
 */

export type CanTransitionContext = {
  /** `true` when the initiative has a completed product brief. */
  hasBrief: boolean;
  /** Required on any `→ parked` transition. */
  parkedIntent?: "revisit" | "wont_consider" | null;
  /** Required on any `→ parked` transition; trimmed non-empty. */
  parkedReason?: string | null;
};

export type CanTransitionReason =
  | "same_lifecycle"
  | "illegal_transition"
  | "brief_required"
  | "parked_requires_intent_and_reason";

export type CanTransitionResult =
  | { ok: true }
  | { ok: false; reason: CanTransitionReason; message: string };

/** Forward-only edges, non-parked. */
const FORWARD_EDGES: ReadonlyMap<Lifecycle, ReadonlySet<Lifecycle>> = new Map([
  ["idea", new Set<Lifecycle>(["discovery"])],
  ["discovery", new Set<Lifecycle>(["design"])],
  ["design", new Set<Lifecycle>(["spec_ready"])],
  ["spec_ready", new Set<Lifecycle>(["develop"])],
  ["develop", new Set<Lifecycle>(["uat"])],
  ["uat", new Set<Lifecycle>(["deployed"])],
  ["deployed", new Set<Lifecycle>([])],
  // parked's only out-edge is the un-park → idea handled separately below.
  ["parked", new Set<Lifecycle>([])],
]);

/** Anything in this set can be parked. `parked` itself cannot be re-parked. */
const CAN_PARK: ReadonlySet<Lifecycle> = new Set<Lifecycle>([
  "idea",
  "discovery",
  "design",
  "spec_ready",
  "develop",
  "uat",
  "deployed",
]);

export function canTransition(
  from: Lifecycle,
  to: Lifecycle,
  context: CanTransitionContext,
): CanTransitionResult {
  if (from === to) {
    return {
      ok: false,
      reason: "same_lifecycle",
      message: "Initiative is already in this lane.",
    };
  }

  // Parked branch — intent + reason required regardless of source.
  if (to === "parked") {
    if (!CAN_PARK.has(from)) {
      return {
        ok: false,
        reason: "illegal_transition",
        message: `Cannot move from ${from} to parked.`,
      };
    }
    const reasonTrimmed = (context.parkedReason ?? "").trim();
    if (
      !context.parkedIntent ||
      (context.parkedIntent !== "revisit" &&
        context.parkedIntent !== "wont_consider") ||
      reasonTrimmed.length === 0
    ) {
      return {
        ok: false,
        reason: "parked_requires_intent_and_reason",
        message:
          "Parking requires an intent (revisit or wont_consider) and a reason.",
      };
    }
    return { ok: true };
  }

  // Un-park: parked → idea only (keeps the S2 matrix tight; full rewind = S8).
  if (from === "parked") {
    if (to === "idea") return { ok: true };
    return {
      ok: false,
      reason: "illegal_transition",
      message: `Un-park goes to idea only; ${to} is blocked in Sprint 2.`,
    };
  }

  // Forward-only from here.
  const allowed = FORWARD_EDGES.get(from) ?? new Set<Lifecycle>();
  if (!allowed.has(to)) {
    return {
      ok: false,
      reason: "illegal_transition",
      message: `Forward-only in Sprint 2: ${from} → ${to} is not allowed.`,
    };
  }

  // S3 gate: idea → discovery requires a completed product brief.
  if (from === "idea" && to === "discovery" && !context.hasBrief) {
    return {
      ok: false,
      reason: "brief_required",
      message: "Complete the product brief in Sprint 3.",
    };
  }

  return { ok: true };
}

/**
 * Derive `hasBrief` from an initiative. Sprint 2 uses a permissive heuristic:
 * the brief stage object has at least one populated key. Sprint 3 replaces
 * this with the wizard-complete flag; keep this call shape stable so S3
 * touches one site (R16 guardrail 1).
 */
export function deriveHasBrief(initiative: Pick<Initiative, "brief">): boolean {
  const brief = initiative.brief as Record<string, unknown> | undefined;
  if (!brief) return false;
  return Object.keys(brief).length > 0;
}

export const FORWARD_TARGETS: ReadonlyMap<
  Lifecycle,
  ReadonlyArray<Lifecycle>
> = new Map(
  Array.from(FORWARD_EDGES.entries()).map(([k, v]) => [
    k,
    Array.from(v).sort(),
  ]),
);

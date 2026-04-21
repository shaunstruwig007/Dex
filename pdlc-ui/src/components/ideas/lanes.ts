import type { Lifecycle } from "@/schema/initiative";

/**
 * Canonical lane order for the S2 board. Matches
 * plans/PDLC_UI/lifecycle-transitions.md § "Canonical column order".
 * `parked` is intentionally not a main lane — it renders in a separate
 * drawer when the "Show parked" filter toggle is on.
 */
export const LIFECYCLE_ORDER: readonly Lifecycle[] = [
  "idea",
  "discovery",
  "design",
  "spec_ready",
  "develop",
  "uat",
  "deployed",
  "parked",
] as const;

export const MAIN_LANES: readonly Lifecycle[] = LIFECYCLE_ORDER.filter(
  (lane) => lane !== "parked",
);

export const NON_PARKED_LANES: ReadonlySet<Lifecycle> = new Set(MAIN_LANES);

export const LANE_LABELS: Record<Lifecycle, string> = {
  idea: "Idea",
  discovery: "Discovery",
  design: "Design",
  spec_ready: "Spec ready",
  develop: "Develop",
  uat: "UAT",
  deployed: "Deployed",
  parked: "Parked",
};

export const LANE_DESCRIPTIONS: Record<Lifecycle, string> = {
  idea: "Raw problems and opportunities",
  discovery: "Understanding the problem space",
  design: "Shaping the solution",
  spec_ready: "Ready for engineering",
  develop: "Being built",
  uat: "User acceptance testing",
  deployed: "Shipped",
  parked: "Paused with intent + reason",
};

/** Used by the reorder helper to compute midpoint sortOrder values. */
export const SORT_ORDER_STEP = 1000;

import type { Initiative } from "@/schema/initiative";
import { SORT_ORDER_STEP } from "./lanes";

/**
 * Compute a new `sortOrder` that places `moved` between the cards that end up
 * above/below it in the target lane. We use integer spacing (default 1000) so
 * midpoint inserts stay integer-safe for a while; when two neighbours end up
 * too close we fall back to a re-index pass at a higher layer (not needed in
 * S2's fixture-sized board).
 *
 * Rules:
 * - Same-lane reorder and cross-lane drop placement both use this helper
 *   (see `ideas-board.tsx` → `handleDragEnd` / `dispatchCrossLaneDrop`).
 * - `above` / `below` may be null (dropping at the start / end of a lane).
 * - Any non-null neighbour's `sortOrder === null` is treated as its position
 *   in lane order × SORT_ORDER_STEP so the first drag assigns sensible values.
 */
export function computeMidpointSortOrder(
  lane: Initiative[],
  movedId: string,
  above: Initiative | null,
  below: Initiative | null,
): number {
  const resolve = (card: Initiative | null): number | null => {
    if (!card) return null;
    if (card.sortOrder !== null && Number.isFinite(card.sortOrder)) {
      return card.sortOrder;
    }
    const index = lane.findIndex((item) => item.id === card.id);
    return (index + 1) * SORT_ORDER_STEP;
  };

  const prev = resolve(above);
  const next = resolve(below);

  if (prev === null && next === null) {
    // Empty lane — seed with a mid-range value.
    return SORT_ORDER_STEP;
  }
  if (prev === null) return (next as number) - SORT_ORDER_STEP;
  if (next === null) return prev + SORT_ORDER_STEP;

  const midpoint = Math.trunc((prev + next) / 2);
  // Collision: nudge so we never return the neighbour's own value.
  if (midpoint === prev) return prev + 1;
  if (midpoint === next) return next - 1;
  void movedId;
  return midpoint;
}

/**
 * Cross-lane drop: place at the **top** of the target lane (first list slot).
 * Uses the same midpoint math as within-lane reorder so the moved card sorts
 * before every card that currently has only implicit `sortOrder: null` rows.
 */
export function sortOrderForCrossLaneLaneTop(
  targetLane: Initiative[],
  movedId: string,
): number {
  const below = targetLane[0] ?? null;
  return computeMidpointSortOrder(targetLane, movedId, null, below);
}

/**
 * Cross-lane drop onto a card in the target lane — insert **before** or
 * **after** that card using the same midpoint strategy as within-lane reorder.
 */
export function sortOrderForCrossLaneNearCard(
  targetLane: Initiative[],
  movedId: string,
  overCard: Initiative,
  insertBefore: boolean,
): number {
  const toIndex = targetLane.findIndex((i) => i.id === overCard.id);
  if (toIndex === -1) {
    return sortOrderForCrossLaneLaneTop(targetLane, movedId);
  }
  if (insertBefore) {
    const above = toIndex > 0 ? targetLane[toIndex - 1] : null;
    const below = targetLane[toIndex];
    return computeMidpointSortOrder(targetLane, movedId, above, below);
  }
  const above = targetLane[toIndex];
  const below =
    toIndex + 1 < targetLane.length ? targetLane[toIndex + 1] : null;
  return computeMidpointSortOrder(targetLane, movedId, above, below);
}

/**
 * Return the neighbours an item should land between for an arrow-key swap.
 * For `direction: "up"` the item trades places with the card above; this
 * function returns the `above` (the card that used to be 2 positions up, or
 * null) and `below` (the card it swaps with).
 */
export function neighboursForSwap(
  lane: Initiative[],
  id: string,
  direction: "up" | "down",
): { above: Initiative | null; below: Initiative | null } | null {
  const idx = lane.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  if (direction === "up") {
    if (idx === 0) return null;
    return {
      above: idx >= 2 ? lane[idx - 2] : null,
      below: lane[idx - 1],
    };
  }
  if (idx === lane.length - 1) return null;
  return {
    above: lane[idx + 1],
    below: idx + 2 < lane.length ? lane[idx + 2] : null,
  };
}

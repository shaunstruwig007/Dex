"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import type { Initiative, Lifecycle } from "@/schema/initiative";
import { canTransition, deriveHasBrief } from "@/lib/can-transition";
import { useBoardDensity } from "@/lib/use-board-density";
import { InitiativeCard } from "./initiative-card";
import { SwimLane, type SwimLaneDropState } from "./swim-lane";
import { BriefWizardDialog } from "./brief-wizard-dialog";
import { ParkedTransitionDialog } from "./parked-transition-dialog";
import { ParkedRail, useParkedRail } from "./parked-rail";
import { BoardDensityToggle } from "./board-density-toggle";
import { InitiativeFormDialog } from "./initiative-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { LANE_LABELS, MAIN_LANES } from "./lanes";
import { computeMidpointSortOrder, neighboursForSwap } from "./reorder";
import {
  BoardDndProvider,
  isDragData,
  isLaneDropData,
  lifecycleFromSortableContainerOverId,
  type DragData,
} from "./board-dnd";
import type {
  CreateResponse,
  DeleteResponse,
  IdeasApiError,
  ListResponse,
  UpdateResponse,
} from "./types";

type DialogState =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; initiative: Initiative };

type TransitionResponse = { initiative: Initiative };
type ReorderResponse = { initiative: Initiative };

async function parseResponse<T>(
  response: Response,
): Promise<
  { ok: true; data: T } | { ok: false; error: IdeasApiError; status: number }
> {
  const json = (await response.json().catch(() => ({}))) as unknown;
  if (response.ok) return { ok: true, data: json as T };
  return {
    ok: false,
    status: response.status,
    error: (json as IdeasApiError) ?? { error: `http_${response.status}` },
  };
}

function humanError(err: IdeasApiError, status: number): string {
  if (status === 409 && err.error === "revision_conflict") {
    return "Someone else saved first. Reload to see the latest version.";
  }
  if (err.error === "brief_required") {
    return "Complete the product brief before moving to discovery.";
  }
  if (err.error === "parked_requires_intent_and_reason") {
    return "Parking requires an intent and a non-empty reason.";
  }
  if (err.error === "illegal_transition") {
    return "That move is not allowed yet.";
  }
  if (err.error === "same_lifecycle") {
    return "The initiative is already in that lane.";
  }
  if (err.error === "title_required") return "Title is required.";
  if (err.error === "invalid_body")
    return "Please check the form and try again.";
  if (err.error === "not_found") return "That initiative no longer exists.";
  return `Could not complete the request (${err.error}).`;
}

export function IdeasBoard() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ kind: "closed" });
  const [pendingDelete, setPendingDelete] = useState<Initiative | null>(null);
  const [pendingPark, setPendingPark] = useState<Initiative | null>(null);
  const [briefWizardTarget, setBriefWizardTarget] = useState<Initiative | null>(
    null,
  );
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null);
  const { density, setDensity } = useBoardDensity();
  const parkedRail = useParkedRail();

  const refresh = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/initiatives", { cache: "no-store" });
    const parsed = await parseResponse<ListResponse>(res);
    if (!parsed.ok) {
      setLoadError(humanError(parsed.error, parsed.status));
      return;
    }
    setInitiatives(parsed.data.initiatives);
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const byLane = useMemo(() => {
    const map: Record<Lifecycle, Initiative[]> = {
      idea: [],
      discovery: [],
      design: [],
      spec_ready: [],
      develop: [],
      uat: [],
      deployed: [],
      parked: [],
    };
    for (const item of initiatives) {
      map[item.lifecycle].push(item);
    }
    return map;
  }, [initiatives]);

  const parkedCount = byLane.parked.length;

  const handleCreate = useCallback(
    async (values: { title: string; body: string }) => {
      const res = await fetch("/api/initiatives", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const parsed = await parseResponse<CreateResponse>(res);
      if (!parsed.ok) {
        return {
          ok: false as const,
          message: humanError(parsed.error, parsed.status),
        };
      }
      toast.success(`Created ${parsed.data.initiative.handle}`);
      await refresh();
      return { ok: true as const };
    },
    [refresh],
  );

  const handleEdit = useCallback(
    async (target: Initiative, values: { title: string; body: string }) => {
      const res = await fetch(`/api/initiatives/${target.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expectedRevision: target.revision,
          title: values.title,
          body: values.body,
        }),
      });
      const parsed = await parseResponse<UpdateResponse>(res);
      if (!parsed.ok) {
        if (parsed.status === 409) await refresh();
        return {
          ok: false as const,
          message: humanError(parsed.error, parsed.status),
        };
      }
      toast.success(`Updated ${parsed.data.initiative.handle}`);
      await refresh();
      return { ok: true as const };
    },
    [refresh],
  );

  const handleDelete = useCallback(
    async (target: Initiative) => {
      const res = await fetch(`/api/initiatives/${target.id}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ expectedRevision: target.revision }),
      });
      const parsed = await parseResponse<DeleteResponse>(res);
      if (!parsed.ok) {
        if (parsed.status === 409) await refresh();
        return {
          ok: false as const,
          message: humanError(parsed.error, parsed.status),
        };
      }
      toast.success(`Deleted ${parsed.data.deleted.handle}`);
      await refresh();
      return { ok: true as const };
    },
    [refresh],
  );

  const handleTransition = useCallback(
    async (
      target: Initiative,
      to: Lifecycle,
      extras?: {
        parkedIntent?: "revisit" | "wont_consider";
        parkedReason?: string;
      },
    ) => {
      const res = await fetch(`/api/initiatives/${target.id}/transition`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expectedRevision: target.revision,
          to,
          ...extras,
        }),
      });
      const parsed = await parseResponse<TransitionResponse>(res);
      if (!parsed.ok) {
        if (parsed.status === 409) await refresh();
        return {
          ok: false as const,
          message: humanError(parsed.error, parsed.status),
        };
      }
      toast.success(
        `${parsed.data.initiative.handle} → ${LANE_LABELS[parsed.data.initiative.lifecycle]}`,
      );
      await refresh();
      return { ok: true as const };
    },
    [refresh],
  );

  const handleBriefWizardCompleted = useCallback(
    async (next: Initiative) => {
      toast.success(
        `${next.handle} → ${LANE_LABELS[next.lifecycle]} (brief saved)`,
      );
      await refresh();
    },
    [refresh],
  );

  const handleReorder = useCallback(
    async (target: Initiative, sortOrder: number) => {
      const res = await fetch(`/api/initiatives/${target.id}/reorder`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expectedRevision: target.revision,
          sortOrder,
        }),
      });
      const parsed = await parseResponse<ReorderResponse>(res);
      if (!parsed.ok) {
        if (parsed.status === 409) await refresh();
        toast.error(humanError(parsed.error, parsed.status));
        return;
      }
      await refresh();
    },
    [refresh],
  );

  // Within-lane pointer reorder rides on the same `@dnd-kit/sortable`
  // context as cross-lane (S3A.1 Pass-4 — see `board-dnd.tsx` header +
  // ADR-0003). This `buildArrowSwap` helper still powers the `Alt+↑/↓`
  // keyboard path and the `Actions → Move up/down` menu items, both of
  // which sidestep dnd-kit entirely.
  function buildArrowSwap(lifecycle: Lifecycle, card: Initiative) {
    const lane = byLane[lifecycle];
    return {
      canReorderUp: lane[0]?.id !== card.id,
      canReorderDown: lane[lane.length - 1]?.id !== card.id,
      onReorderUp: () => {
        const neighbours = neighboursForSwap(lane, card.id, "up");
        if (!neighbours) return;
        const sort = computeMidpointSortOrder(
          lane,
          card.id,
          neighbours.above,
          neighbours.below,
        );
        void handleReorder(card, sort);
      },
      onReorderDown: () => {
        const neighbours = neighboursForSwap(lane, card.id, "down");
        if (!neighbours) return;
        const sort = computeMidpointSortOrder(
          lane,
          card.id,
          neighbours.above,
          neighbours.below,
        );
        void handleReorder(card, sort);
      },
    };
  }

  // ── Cross-lane DnD (dnd-kit) ───────────────────────────────────────────
  // Memo the cross-lane legality matrix while a drag is in flight so the
  // dragOver visual highlight stays cheap and the legality check matches
  // the menu's `Move to…` submenu exactly.
  const dragLegalityByLane = useMemo(() => {
    if (!activeDrag) return null;
    const card = initiatives.find((i) => i.id === activeDrag.initiativeId);
    if (!card) return null;
    const hasBrief = deriveHasBrief(card);
    const map = new Map<
      Lifecycle | "parked-rail",
      { ok: boolean; reason: string | null }
    >();
    for (const lane of MAIN_LANES) {
      if (lane === card.lifecycle) {
        map.set(lane, { ok: false, reason: null });
        continue;
      }
      const result = canTransition(card.lifecycle, lane, {
        hasBrief,
        // Satisfy the parked branch with valid placeholders so non-parked
        // lanes return their actual reason, not the parked guardrail.
        parkedIntent: "revisit",
        parkedReason: "__menu",
      });
      map.set(lane, {
        ok: result.ok,
        reason: result.ok ? null : result.message,
      });
    }
    const parkedResult = canTransition(card.lifecycle, "parked", {
      hasBrief,
      parkedIntent: "revisit",
      parkedReason: "__menu",
    });
    map.set("parked-rail", {
      ok: parkedResult.ok,
      reason: parkedResult.ok ? null : parkedResult.message,
    });
    return map;
  }, [activeDrag, initiatives]);

  function laneDropState(lifecycle: Lifecycle): SwimLaneDropState {
    if (!dragLegalityByLane) return "idle";
    const result = dragLegalityByLane.get(lifecycle);
    if (!result) return "idle";
    // The card's source lane has `reason: null` — same_lifecycle is silent.
    if (!result.ok && result.reason === null) return "idle";
    return result.ok ? "legal" : "illegal";
  }

  function laneIllegalReason(lifecycle: Lifecycle): string | null {
    if (!dragLegalityByLane) return null;
    return dragLegalityByLane.get(lifecycle)?.reason ?? null;
  }

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current;
    if (isDragData(data)) {
      setActiveDrag(data);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const dragData = event.active.data.current;
      setActiveDrag(null);
      if (!isDragData(dragData)) return;

      const card = initiatives.find((i) => i.id === dragData.initiativeId);
      if (!card) return;

      const overId = event.over?.id;
      const overData = event.over?.data.current;

      // Branch A — drop on a lane container (empty lane / parked rail /
      // outer lane body). `overData.laneId` identifies the target.
      if (isLaneDropData(overData)) {
        const targetLifecycle: Lifecycle =
          overData.laneId === "parked-rail" ? "parked" : overData.laneId;

        // Same lane as source — silent no-op. Within-lane reorder via
        // drop-on-empty-space is undefined; users drop on a sibling card
        // instead (Branch B).
        if (targetLifecycle === card.lifecycle) return;

        dispatchCrossLaneDrop(card, targetLifecycle);
        return;
      }

      // Branch A′ — pointer released over lane chrome where collision picked
      // the `SortableContext` container (`id={\`lane-${lifecycle}\`}`) instead
      // of `board-lane-drop-*` (see ADR-0003 / `board-dnd.tsx` duplicate-id
      // fix). Without this branch, cross-lane drops "stick" visually then snap
      // back because `handleDragEnd` no-ops when `over` is not `card-*`.
      const sortableLane = lifecycleFromSortableContainerOverId(
        overId == null ? undefined : String(overId),
      );
      if (sortableLane !== null) {
        if (sortableLane === card.lifecycle) return;
        dispatchCrossLaneDrop(card, sortableLane);
        return;
      }

      // Branch B — drop on a sibling card. For within-lane this is reorder;
      // for cross-lane it's still a transition (we use the sibling's lane
      // as the target, which @dnd-kit/sortable already tracks via the
      // `sortable.containerId` on `overData`).
      if (typeof overId !== "string") return;
      const overCardId =
        typeof overId === "string" && overId.startsWith("card-")
          ? overId.slice("card-".length)
          : null;
      if (!overCardId) return;
      const overCard = initiatives.find((i) => i.id === overCardId);
      if (!overCard) return;

      if (overCard.lifecycle === card.lifecycle) {
        // WITHIN-LANE REORDER — compute midpoint sortOrder between the
        // neighbour that ends up above the moved card and the one below.
        // dnd-kit-sortable tells us the displacement direction via
        // `event.active.rect.top` vs `event.over.rect.top` but the simpler
        // read is: if the dragged card's original index was above the
        // target's original index, it's moving DOWN → sits just below
        // target; otherwise moving UP → sits just above target.
        const lane = byLane[card.lifecycle];
        const fromIndex = lane.findIndex((i) => i.id === card.id);
        const toIndex = lane.findIndex((i) => i.id === overCard.id);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
          return;
        }
        const movingDown = fromIndex < toIndex;
        const above = movingDown
          ? lane[toIndex]
          : toIndex >= 1
            ? lane[toIndex - 1]
            : null;
        const below = movingDown
          ? toIndex + 1 < lane.length
            ? lane[toIndex + 1]
            : null
          : lane[toIndex];
        const nextSort = computeMidpointSortOrder(
          lane,
          card.id,
          above,
          below,
        );
        void handleReorder(card, nextSort);
        return;
      }

      // Cross-lane drop onto a sibling card — treat the sibling's lane as
      // the transition target, then apply the same gate/wizard/park rules
      // as a drop on the lane container.
      dispatchCrossLaneDrop(card, overCard.lifecycle);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleTransition, handleReorder, initiatives, byLane],
  );

  /**
   * Apply the cross-lane transition rules that were Branch A of Pass-3:
   * - same-lane → silent no-op (caller already filtered but double-check)
   * - illegal gate → silent no-op (lane was dimmed during drag)
   * - `idea → discovery` without a complete brief → open wizard
   * - `→ parked` → open the parked intent + reason modal
   * - otherwise → straight transition API call
   */
  function dispatchCrossLaneDrop(card: Initiative, targetLifecycle: Lifecycle) {
    if (targetLifecycle === card.lifecycle) return;
    const hasBrief = deriveHasBrief(card);
    const gate = canTransition(card.lifecycle, targetLifecycle, {
      hasBrief,
      parkedIntent: "revisit",
      parkedReason: "__menu",
    });
    if (!gate.ok) return;
    if (
      card.lifecycle === "idea" &&
      targetLifecycle === "discovery" &&
      !hasBrief
    ) {
      setBriefWizardTarget(card);
      return;
    }
    if (targetLifecycle === "parked") {
      setPendingPark(card);
      return;
    }
    void handleTransition(card, targetLifecycle);
  }

  const editTarget = dialog.kind === "edit" ? dialog.initiative : null;
  const dialogOpen = dialog.kind !== "closed";
  const dialogMode = useMemo(
    () =>
      dialog.kind === "edit"
        ? { kind: "edit" as const, initiative: dialog.initiative }
        : { kind: "create" as const },
    [dialog],
  );

  // Card rendered inside the `<DragOverlay>` — a floating duplicate of the
  // dragged card that follows the pointer (JIRA-like lift). The source
  // card stays in its slot and fades (via `isDragging` → `opacity-40` in
  // `InitiativeCard`) so sibling cards can shuffle around it during
  // within-lane reorder.
  const activeDragCard = useMemo(() => {
    if (!activeDrag) return null;
    return initiatives.find((i) => i.id === activeDrag.initiativeId) ?? null;
  }, [activeDrag, initiatives]);

  return (
    <BoardDndProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDrag(null)}
    >
      <section
        aria-label="PDLC board"
        className="flex h-full min-h-0 w-full"
        data-board-density={density}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/50"
            style={{
              paddingInline: "var(--board-gutter-x)",
              paddingBlock: "10px",
            }}
          >
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-muted-foreground">
                Drag cards between lanes or use the card menu. Parking needs an
                intent + reason.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BoardDensityToggle value={density} onChange={setDensity} />
              <Button
                type="button"
                size="sm"
                onClick={() => setDialog({ kind: "create" })}
                aria-label="Create new initiative"
              >
                New initiative
              </Button>
            </div>
          </div>

          {loading ? (
            <p
              className="px-4 py-3 text-sm text-muted-foreground"
              aria-live="polite"
            >
              Loading…
            </p>
          ) : loadError ? (
            <div
              role="alert"
              className="m-4 flex flex-col gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <span>{loadError}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refresh()}
                className="self-start"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div
              role="region"
              aria-label="Lifecycle lanes"
              tabIndex={0}
              className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{
                paddingInline: "var(--board-gutter-x)",
                paddingBlock: "12px",
              }}
            >
              <div
                className="grid h-full min-w-[1960px] gap-3"
                style={{
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(var(--board-lane-min), 1fr))",
                }}
              >
                {MAIN_LANES.map((lifecycle) => {
                  const cards = byLane[lifecycle];
                  const dropState = laneDropState(lifecycle);
                  // SortableContext per lane — the card ids must match the
                  // `id` passed to `useSortable` in `useCardSortable`
                  // (`card-${uuid}`). This is what lets dnd-kit shuffle
                  // sibling cards around the dragged card on pointermove,
                  // and it's why we can detect over-card (within-lane)
                  // vs over-lane (cross-lane) in `handleDragEnd`.
                  return (
                    <SortableContext
                      key={lifecycle}
                      id={`lane-${lifecycle}`}
                      items={cards.map((c) => `card-${c.id}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <SwimLane
                        lifecycle={lifecycle}
                        count={cards.length}
                        dropState={dropState}
                        illegalReason={laneIllegalReason(lifecycle)}
                      >
                        {cards.map((card) => {
                          const hasBrief = deriveHasBrief(card);
                          const arrow = buildArrowSwap(lifecycle, card);
                          return (
                            <InitiativeCard
                              key={card.id}
                              initiative={card}
                              hasBrief={hasBrief}
                              canReorderUp={arrow.canReorderUp}
                              canReorderDown={arrow.canReorderDown}
                              onEdit={() =>
                                setDialog({ kind: "edit", initiative: card })
                              }
                              onDelete={() => setPendingDelete(card)}
                              onTransition={(to) => {
                                void handleTransition(card, to);
                              }}
                              onOpenBriefWizard={() =>
                                setBriefWizardTarget(card)
                              }
                              onRequestPark={() => setPendingPark(card)}
                              onReorderUp={arrow.onReorderUp}
                              onReorderDown={arrow.onReorderDown}
                            />
                          );
                        })}
                      </SwimLane>
                    </SortableContext>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <ParkedRail
          state={parkedRail.state}
          onToggle={parkedRail.toggle}
          parkedCount={parkedCount}
        >
          {byLane.parked.length === 0 ? (
            <p className="rounded-md border border-dashed border-border px-2 py-6 text-center text-[11px] text-muted-foreground">
              Nothing parked.
            </p>
          ) : (
            // Parked cards are rendered in a SortableContext so the rail
            // participates in the same dnd-kit collision layer as the main
            // lanes — you can drop a lane card onto a parked card to park
            // it. Parked cards themselves are `disabled` on the sortable
            // hook (see `initiative-card.tsx` → `isParked` guard) so they
            // can't be dragged out; the Actions menu is the unpark path.
            <SortableContext
              id="lane-parked"
              items={byLane.parked.map((c) => `card-${c.id}`)}
              strategy={verticalListSortingStrategy}
            >
              <ul
                aria-label="Parked initiatives"
                className="flex flex-col gap-2"
              >
                {byLane.parked.map((card) => (
                  <InitiativeCard
                    key={card.id}
                    initiative={card}
                    hasBrief={deriveHasBrief(card)}
                    onEdit={() => setDialog({ kind: "edit", initiative: card })}
                    onDelete={() => setPendingDelete(card)}
                    onTransition={(to) => {
                      void handleTransition(card, to);
                    }}
                    onOpenBriefWizard={() => setBriefWizardTarget(card)}
                    onRequestPark={() => setPendingPark(card)}
                  />
                ))}
              </ul>
            </SortableContext>
          )}
        </ParkedRail>

        {/*
         * DragOverlay — the floating duplicate card that follows the
         * pointer during a drag. It's portalled to `document.body` by
         * dnd-kit so it doesn't get clipped by lane/rail scroll containers,
         * which is what makes the lift feel JIRA-native. The `dropAnimation`
         * default is a 250ms settle; we keep it because that's the JIRA
         * reference in the user's validation video.
         */}
        <DragOverlay>
          {activeDragCard ? (
            <div className="pointer-events-none w-[var(--board-lane-min)] rotate-[0.5deg] opacity-95 shadow-2xl">
              <InitiativeCard
                initiative={activeDragCard}
                hasBrief={deriveHasBrief(activeDragCard)}
                onEdit={() => undefined}
                onDelete={() => undefined}
                onTransition={() => undefined}
                onOpenBriefWizard={() => undefined}
                onRequestPark={() => undefined}
              />
            </div>
          ) : null}
        </DragOverlay>

        <InitiativeFormDialog
          open={dialogOpen}
          mode={dialogMode}
          onOpenChange={(next) => {
            if (!next) setDialog({ kind: "closed" });
          }}
          onSubmit={(values) =>
            editTarget ? handleEdit(editTarget, values) : handleCreate(values)
          }
        />
        <DeleteConfirmDialog
          open={pendingDelete !== null}
          initiative={pendingDelete}
          onOpenChange={(next) => {
            if (!next) setPendingDelete(null);
          }}
          onConfirm={async () => {
            if (!pendingDelete) return { ok: true };
            return handleDelete(pendingDelete);
          }}
        />
        <ParkedTransitionDialog
          open={pendingPark !== null}
          initiative={pendingPark}
          onOpenChange={(next) => {
            if (!next) setPendingPark(null);
          }}
          onSubmit={async ({ parkedIntent, parkedReason }) => {
            if (!pendingPark) return { ok: true };
            return handleTransition(pendingPark, "parked", {
              parkedIntent,
              parkedReason,
            });
          }}
        />
        <BriefWizardDialog
          open={briefWizardTarget !== null}
          initiative={briefWizardTarget}
          onOpenChange={(next) => {
            if (!next) setBriefWizardTarget(null);
          }}
          onCompleted={(next) => {
            setBriefWizardTarget(null);
            void handleBriefWizardCompleted(next);
          }}
        />
      </section>
    </BoardDndProvider>
  );
}

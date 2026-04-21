"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Initiative, Lifecycle } from "@/schema/initiative";
import { deriveHasBrief } from "@/lib/can-transition";
import { InitiativeCard } from "./initiative-card";
import { SwimLane } from "./swim-lane";
import { ParkedTransitionDialog } from "./parked-transition-dialog";
import { ParkedFilterToggle } from "./parked-filter-toggle";
import { InitiativeFormDialog } from "./initiative-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { LANE_LABELS, MAIN_LANES } from "./lanes";
import { computeMidpointSortOrder, neighboursForSwap } from "./reorder";
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
    return "Complete the product brief in Sprint 3 before moving to discovery.";
  }
  if (err.error === "parked_requires_intent_and_reason") {
    return "Parking requires an intent and a non-empty reason.";
  }
  if (err.error === "illegal_transition") {
    return "That move isn't allowed in Sprint 2 (forward-only).";
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
  const [showParked, setShowParked] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    id: string;
    position: "above" | "below";
  } | null>(null);
  const dragLaneRef = useRef<Lifecycle | null>(null);

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

  // ── Drag handlers ──────────────────────────────────────────────────────
  function buildDragHandlers(lifecycle: Lifecycle, card: Initiative) {
    return {
      onDragStart: (event: React.DragEvent<HTMLLIElement>) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", card.id);
        dragLaneRef.current = lifecycle;
        setDraggingId(card.id);
      },
      onDragEnd: () => {
        setDraggingId(null);
        setDropTarget(null);
        dragLaneRef.current = null;
      },
      onDragOver: (event: React.DragEvent<HTMLLIElement>) => {
        if (dragLaneRef.current !== lifecycle) return;
        if (draggingId === card.id) return;
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const position = event.clientY < midpoint ? "above" : "below";
        setDropTarget({ id: card.id, position });
      },
      onDragLeave: () => {
        setDropTarget((prev) => (prev?.id === card.id ? null : prev));
      },
      onDrop: (event: React.DragEvent<HTMLLIElement>) => {
        event.preventDefault();
        const movedId = event.dataTransfer.getData("text/plain");
        if (!movedId || dragLaneRef.current !== lifecycle) return;
        if (movedId === card.id) return;
        const lane = byLane[lifecycle];
        const moved = lane.find((i) => i.id === movedId);
        if (!moved) return;
        const target = dropTarget ?? {
          id: card.id,
          position: "below" as const,
        };
        const targetIdx = lane.findIndex((i) => i.id === target.id);
        if (targetIdx === -1) return;

        // Build the new lane order and resolve neighbour cards for midpoint.
        const withoutMoved = lane.filter((i) => i.id !== movedId);
        const insertAt =
          target.position === "above"
            ? withoutMoved.findIndex((i) => i.id === target.id)
            : withoutMoved.findIndex((i) => i.id === target.id) + 1;
        const above = insertAt > 0 ? withoutMoved[insertAt - 1] : null;
        const below =
          insertAt < withoutMoved.length ? withoutMoved[insertAt] : null;
        if (above?.id === movedId || below?.id === movedId) return;

        const nextSort = computeMidpointSortOrder(
          lane,
          movedId,
          above ?? null,
          below ?? null,
        );
        setDraggingId(null);
        setDropTarget(null);
        dragLaneRef.current = null;
        void handleReorder(moved, nextSort);
      },
    };
  }

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

  const editTarget = dialog.kind === "edit" ? dialog.initiative : null;
  const dialogOpen = dialog.kind !== "closed";
  const dialogMode = useMemo(
    () =>
      dialog.kind === "edit"
        ? { kind: "edit" as const, initiative: dialog.initiative }
        : { kind: "create" as const },
    [dialog],
  );

  return (
    <section aria-label="PDLC board" className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Board</h2>
          <p className="text-sm text-muted-foreground">
            Forward-only moves. Parking requires an intent + reason.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ParkedFilterToggle
            showParked={showParked}
            onChange={setShowParked}
            parkedCount={parkedCount}
          />
          <Button
            type="button"
            onClick={() => setDialog({ kind: "create" })}
            aria-label="Create new initiative"
          >
            New initiative
          </Button>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Loading…
        </p>
      ) : loadError ? (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
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
        <>
          <div
            role="region"
            aria-label="Lifecycle lanes"
            // axe's `scrollable-region-focusable` rule: a horizontally
            // scrollable container must be keyboard-reachable so users who
            // can't swipe or use a mouse can still pan the lanes.
            tabIndex={0}
            className="flex gap-3 overflow-x-auto pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {MAIN_LANES.map((lifecycle) => {
              const cards = byLane[lifecycle];
              return (
                <SwimLane
                  key={lifecycle}
                  lifecycle={lifecycle}
                  count={cards.length}
                >
                  {cards.map((card) => {
                    const hasBrief = deriveHasBrief(card);
                    const drag = buildDragHandlers(lifecycle, card);
                    const arrow = buildArrowSwap(lifecycle, card);
                    const indicator =
                      dropTarget?.id === card.id ? dropTarget.position : null;
                    return (
                      <InitiativeCard
                        key={card.id}
                        initiative={card}
                        hasBrief={hasBrief}
                        dragging={draggingId === card.id}
                        dropIndicator={indicator}
                        canReorderUp={arrow.canReorderUp}
                        canReorderDown={arrow.canReorderDown}
                        onEdit={() =>
                          setDialog({ kind: "edit", initiative: card })
                        }
                        onDelete={() => setPendingDelete(card)}
                        onTransition={(to) => {
                          void handleTransition(card, to);
                        }}
                        onRequestPark={() => setPendingPark(card)}
                        onReorderUp={arrow.onReorderUp}
                        onReorderDown={arrow.onReorderDown}
                        {...drag}
                      />
                    );
                  })}
                </SwimLane>
              );
            })}
          </div>

          {showParked && (
            <section
              aria-label="Parked initiatives"
              className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-3"
            >
              <header className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold tracking-tight">Parked</h3>
                <span className="text-[11px] text-muted-foreground">
                  Paused with intent + reason. Un-park returns the card to Idea.
                </span>
              </header>
              {byLane.parked.length === 0 ? (
                <p className="rounded-md border border-dashed border-border px-2 py-6 text-center text-[11px] text-muted-foreground">
                  Nothing parked.
                </p>
              ) : (
                <ul
                  aria-label="Parked initiatives"
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {byLane.parked.map((card) => (
                    <InitiativeCard
                      key={card.id}
                      initiative={card}
                      hasBrief={deriveHasBrief(card)}
                      onEdit={() =>
                        setDialog({ kind: "edit", initiative: card })
                      }
                      onDelete={() => setPendingDelete(card)}
                      onTransition={(to) => {
                        void handleTransition(card, to);
                      }}
                      onRequestPark={() => setPendingPark(card)}
                    />
                  ))}
                </ul>
              )}
            </section>
          )}
        </>
      )}

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
    </section>
  );
}

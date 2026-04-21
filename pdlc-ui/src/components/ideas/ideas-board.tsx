"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RichTextRenderer } from "@/components/rich-text/rich-text-renderer";
import type { Initiative } from "@/schema/initiative";
import { InitiativeFormDialog } from "./initiative-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
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
  if (err.error === "title_required") return "Title is required.";
  if (err.error === "invalid_body")
    return "Please check the form and try again.";
  if (err.error === "not_found") return "That idea no longer exists.";
  return `Could not complete the request (${err.error}).`;
}

export function IdeasBoard() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ kind: "closed" });
  const [pendingDelete, setPendingDelete] = useState<Initiative | null>(null);

  const refresh = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/initiatives?lifecycle=idea", {
      cache: "no-store",
    });
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
    <section aria-label="Ideas" className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Ideas</h2>
          <p className="text-sm text-muted-foreground">
            Initiatives with lifecycle{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              idea
            </code>
            . Board lanes arrive in Sprint 2.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setDialog({ kind: "create" })}
          aria-label="Create new idea"
        >
          New idea
        </Button>
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
      ) : initiatives.length === 0 ? (
        <EmptyState onCreate={() => setDialog({ kind: "create" })} />
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Idea list">
          {initiatives.map((i) => (
            <li key={i.id}>
              <IdeaCard
                initiative={i}
                onEdit={() => setDialog({ kind: "edit", initiative: i })}
                onDelete={() => setPendingDelete(i)}
              />
            </li>
          ))}
        </ul>
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
    </section>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">No ideas yet</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Capture the first idea. Title is required; body supports rich text.
        </p>
        <Button type="button" className="self-start" onClick={onCreate}>
          Create the first idea
        </Button>
      </CardContent>
    </Card>
  );
}

function IdeaCard({
  initiative,
  onEdit,
  onDelete,
}: {
  initiative: Initiative;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const hasBody = initiative.body.trim().length > 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {initiative.handle}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {initiative.lifecycle}
            </Badge>
            <span className="text-xs text-muted-foreground">
              rev {initiative.revision}
            </span>
          </div>
          <CardTitle className="truncate text-base">
            {initiative.title}
          </CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${initiative.handle}`}
            title="Actions"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 w-8 p-0",
            )}
          >
            <MoreHorizontal className="size-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Delete…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      {hasBody && (
        <CardContent>
          <RichTextRenderer html={initiative.body} />
        </CardContent>
      )}
    </Card>
  );
}

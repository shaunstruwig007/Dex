"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import type { Initiative } from "@/schema/initiative";

type Mode = { kind: "create" } | { kind: "edit"; initiative: Initiative };

export function InitiativeFormDialog({
  open,
  mode,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  mode: Mode;
  onOpenChange: (next: boolean) => void;
  onSubmit: (values: {
    title: string;
    body: string;
  }) => Promise<{ ok: true } | { ok: false; message: string }>;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (mode.kind === "edit") {
      setTitle(mode.initiative.title);
      setBody(mode.initiative.body);
    } else {
      setTitle("");
      setBody("");
    }
    setError(null);
    queueMicrotask(() => titleRef.current?.focus());
  }, [open, mode]);

  const titleTrimmed = title.trim();
  const canSubmit = titleTrimmed.length > 0 && !submitting;
  const titleId = "initiative-title";
  const bodyLabelId = "initiative-body-label";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const result = await onSubmit({ title: titleTrimmed, body });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode.kind === "create" ? "New idea" : "Edit idea"}
          </DialogTitle>
          <DialogDescription>
            Title is plain text (required). Body supports rich text — paste is
            cleaned of styles and fonts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={titleId}>
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id={titleId}
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="One-line description"
              autoComplete="off"
              required
              maxLength={200}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span
              id={bodyLabelId}
              className="text-sm font-medium text-foreground"
            >
              Body
            </span>
            <RichTextEditor
              value={body}
              onChange={setBody}
              ariaLabel="Idea body"
            />
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {submitting
                ? "Saving…"
                : mode.kind === "create"
                  ? "Create idea"
                  : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

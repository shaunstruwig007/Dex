"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Initiative } from "@/schema/initiative";

export type ParkIntent = "revisit" | "wont_consider";

export type ParkSubmit = (values: {
  parkedIntent: ParkIntent;
  parkedReason: string;
}) => Promise<{ ok: true } | { ok: false; message: string }>;

export function ParkedTransitionDialog({
  open,
  initiative,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  initiative: Initiative | null;
  onOpenChange: (next: boolean) => void;
  onSubmit: ParkSubmit;
}) {
  const [intent, setIntent] = useState<ParkIntent>("revisit");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setIntent("revisit");
      setReason("");
      setFormError(null);
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length === 0) {
      setFormError("Reason is required.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    const result = await onSubmit({
      parkedIntent: intent,
      parkedReason: trimmed,
    });
    setSubmitting(false);
    if (result.ok) {
      onOpenChange(false);
    } else {
      setFormError(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Park initiative</DialogTitle>
          <DialogDescription>
            {initiative
              ? `"${initiative.title}" (${initiative.handle}) leaves the main flow. Pick an intent and describe why.`
              : null}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">Intent</legend>
            <RadioGroup
              value={intent}
              onValueChange={(next) => setIntent(next as ParkIntent)}
              className="flex flex-col gap-2"
            >
              <Label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="revisit" /> Revisit later
              </Label>
              <Label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="wont_consider" /> Won&apos;t consider
              </Label>
            </RadioGroup>
          </fieldset>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="park-reason" className="text-sm font-medium">
              Reason
            </Label>
            <Textarea
              id="park-reason"
              aria-required="true"
              required
              minLength={1}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this being parked?"
              rows={4}
            />
          </div>
          {formError && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {formError}
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
            <Button
              type="submit"
              variant="destructive"
              disabled={submitting || !initiative}
            >
              {submitting ? "Parking…" : "Park initiative"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

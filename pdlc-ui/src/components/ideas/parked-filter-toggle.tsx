"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function ParkedFilterToggle({
  showParked,
  onChange,
  parkedCount,
}: {
  showParked: boolean;
  onChange: (next: boolean) => void;
  parkedCount: number;
}) {
  return (
    <Label
      htmlFor="show-parked"
      className="flex items-center gap-2 text-xs text-muted-foreground select-none"
    >
      <Checkbox
        id="show-parked"
        checked={showParked}
        onCheckedChange={(next) => onChange(Boolean(next))}
      />
      Show parked
      <span
        className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px]"
        aria-label={`${parkedCount} parked initiatives`}
      >
        {parkedCount}
      </span>
    </Label>
  );
}

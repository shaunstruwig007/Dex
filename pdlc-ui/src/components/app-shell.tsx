"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import { AppFooter } from "@/components/app-footer";

export function AppShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              PDLC Orchestration
            </h1>
            <Badge variant="secondary">Sprint 0 — shell</Badge>
          </div>
          <nav aria-label="Main" className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "inline-flex items-center gap-1.5",
                )}
                aria-label="Open menu"
              >
                <Menu className="size-4" />
                Menu
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Board</DropdownMenuLabel>
                <DropdownMenuItem disabled>
                  Swim lanes (Sprint 2)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    toast.info("Placeholder — initiative CRUD is Sprint 1")
                  }
                >
                  New initiative…
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                )}
              >
                About this shell
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Orchestration shell</DialogTitle>
                  <DialogDescription>
                    This route validates layout, tokens, shadcn primitives,
                    focus rings, and keyboard access. Initiative CRUD and lanes
                    ship in later sprints.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Welcome</CardTitle>
            <CardDescription>
              Bar A foundation — contracts, CI, health routes, and UI baseline
              (R18) are wired. Data directory:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                pdlc-ui/data/
              </code>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Use <kbd className="font-mono text-xs">Tab</kbd> to move focus;
              activate controls with{" "}
              <kbd className="font-mono text-xs">Enter</kbd> or{" "}
              <kbd className="font-mono text-xs">Space</kbd>.{" "}
              <span className="text-foreground">Measured contrast ratios</span>{" "}
              are logged in{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                docs/ui-notes.md
              </code>
              .
            </p>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => toast.success("Toast wired")}
              >
                Show toast
              </Button>
              <Button variant="secondary" type="button">
                Secondary
              </Button>
              <Button variant="outline" type="button">
                Outline
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
}

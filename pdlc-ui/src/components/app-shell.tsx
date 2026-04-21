import { Badge } from "@/components/ui/badge";
import { IdeasBoard } from "@/components/ideas/ideas-board";
import { AppFooter } from "@/components/app-footer";

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              PDLC Orchestration
            </h1>
            <Badge variant="secondary">Sprint 1 — idea capture</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
        <IdeasBoard />
      </main>

      <AppFooter />
    </div>
  );
}

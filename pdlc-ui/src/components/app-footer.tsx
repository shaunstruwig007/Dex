import pkg from "../../package.json";

export function AppFooter() {
  const gitSha = process.env.GIT_SHA ?? "local";

  return (
    <footer className="border-t border-border bg-card px-4 py-3 text-muted-foreground text-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
        <span>PDLC UI · v{pkg.version}</span>
        <span className="font-mono text-xs" title="Build identifier">
          {gitSha}
        </span>
        <a
          className="text-[color:var(--color-link)] underline underline-offset-4 hover:text-[color:var(--color-link-hover)]"
          href="/api/health"
        >
          /api/health
        </a>
      </div>
    </footer>
  );
}

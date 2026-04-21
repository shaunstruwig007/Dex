# ADR 0001 — Application stack + persistence (Sprint 0)

## Status

Accepted

## Context

[plans/PDLC_UI/tech-stack.md](../../../../plans/PDLC_UI/tech-stack.md) recommends a coherent default: **Next.js 15 (App Router) + React 19 + TypeScript strict + Tailwind CSS v4 + shadcn/ui (Base UI) + TipTap + Zod + Vitest + Playwright**. Persistence MVP targets **SQLite** (`better-sqlite3` + Drizzle) with WAL + `busy_timeout`; JSON file store with atomic rename remains the documented fallback if ICT blocks SQLite on the deployment host.

## Decision

1. **Ratify** the tech-stack defaults for `pdlc-ui`: Next.js 15, React 19, TS strict, Tailwind v4, shadcn/ui as installed by `shadcn init` (Base UI primitives), TipTap v3 for rich text (read-only demo in S0; body field in S1), **Zod** for runtime validation + JSON Schema export for CI golden fixture checks.
2. **Persistence:** target **SQLite + Drizzle** for Sprint 1 write path. If ICT forbids native modules on the host, **fallback** to a single JSON file per environment with `schemaVersion` + atomic rename writes — document the pivot in a superseding ADR note in the same PR.
3. **Package manager:** **npm** (pnpm unavailable in initial bootstrap environment); lockfile `package-lock.json` committed. Revisit pnpm in a future ADR if the team standardises on pnpm.

## Consequences

- S1 implements CRUD + `revision` + `events[]` against the store chosen here.
- CI runs `npm run schema:validate` on every PR (`plans/PDLC_UI/fixtures/initiative-example.json` vs generated JSON Schema).
- Drizzle + `better-sqlite3` land in S1, not S0 (S0 ships empty migration stub only).

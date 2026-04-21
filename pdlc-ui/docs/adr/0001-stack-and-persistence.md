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
- **S1 implementation split (added 2026-04-21):**
  - **Query surface:** Drizzle ORM (`drizzle-orm/better-sqlite3`) over a shared `better-sqlite3` handle — see [`src/storage/schema.ts`](../../src/storage/schema.ts) and [`src/storage/repository.ts`](../../src/storage/repository.ts). The query builder owns all reads/writes in the repository so we get typed columns + composable filters (handy from S2 onwards when lifecycle filters branch out).
  - **Migrations:** Raw SQL files in [`src/storage/migrations/*.sql`](../../src/storage/migrations/) applied by the hand-rolled runner in [`src/storage/migrate.ts`](../../src/storage/migrate.ts). We keep a single migration story that is easy to review in PRs; `drizzle-kit` is installed (see [`drizzle.config.ts`](../../drizzle.config.ts)) but only for ad-hoc introspection. Any column change requires matching edits in `migrations/` **and** `schema.ts` in the same PR (R16 guardrail 1).
  - **Body serialization:** Initiative `body` is stored as **sanitized HTML** (TipTap's output). The renderer (`components/rich-text/rich-text-renderer.tsx`) and editor share the same extension set (`components/rich-text/extensions.ts`), and paste hygiene (`components/rich-text/paste-hygiene.ts`) strips styles/fonts on input. Rationale: TipTap is a structured editor (not a Markdown editor); storing HTML avoids a lossy round-trip through Markdown and keeps the R18 minimum toolbar reversible. Trade-off: body is not directly queryable in SQL. If full-text search lands later, introduce a derived `body_text` column populated on write — do **not** change the canonical `body` format without a superseding ADR.

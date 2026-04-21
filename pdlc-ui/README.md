# PDLC Orchestration UI (`pdlc-ui`)

Steerco-facing **orchestration shell** for the Wyzetalk PDLC — separate from Dex day-to-day editing. Spec: [plans/PDLC_UI/plan.md](../plans/PDLC_UI/plan.md).

**Start here (non-technical / vibe-coding):** [Operator cheatsheet — what to open in the browser & when to run scripts](./docs/OPERATOR_CHEATSHEET.md)

## How to run locally

**Requirements:** Node **22** (see `.nvmrc`), npm 10+.

```bash
cd pdlc-ui
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health: [http://localhost:3000/api/health](http://localhost:3000/api/health).

**Production-like build:**

```bash
GIT_SHA=$(git rev-parse HEAD 2>/dev/null || echo local) npm run build
npm run start
```

## Where data lives

- **Sprint 1:** `data/pdlc.db` — SQLite (WAL) via `better-sqlite3`, with a Drizzle ORM query surface on top (`src/storage/schema.ts` + `src/storage/repository.ts`) per [ADR-0001](./docs/adr/0001-stack-and-persistence.md). Override with `PDLC_DB_PATH`. Migrations are raw SQL under `src/storage/migrations/`; run `npm run db:migrate` to apply pending ones (also applied lazily on first API request via `/api/ready`).
- **Backups:** `backups/` (gitignored contents; created by `scripts/backup-daily.sh`). See [docs/BACKUP_RUNBOOK.md](./docs/BACKUP_RUNBOOK.md).

## Environment variables

See [`.env.example`](./.env.example). **No secrets in git** — real keys live in an ICT-approved store.

| Variable       | Purpose                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| `GIT_SHA`      | Optional build identifier (footer + `/api/health`). CI sets from `github.sha`. |
| `PDLC_DB_PATH` | SQLite file path (default `./data/pdlc.db`). Used by local + CI.               |

## Dependency upgrade policy

- **Patch:** monthly batch (Dependabot optional).
- **Minor / major:** require PR + smoke test (`npm test`, `npm run schema:validate`); **major** needs an ADR if it changes runtime or build contracts.

## Sprint 0 kick-off decisions (Day 1)

Captured from [plans/PDLC_UI/plan.md § Sprint 0 kick-off decisions](../plans/PDLC_UI/plan.md):

- **Canonical JSON field case:** **camelCase** (e.g. `parkedIntent`, `parkedReason`). Legacy snake_case in prose is deprecated — update when touched.
- **Initiative human ID:** `handle` format **`INIT-NNNN`** (zero-padded, monotonic) in addition to internal `id`.
- **Event / audit log:** `events[]` on each initiative, typed `{ at, by, kind, payload }` per [schema-initiative-v0 §6](../plans/PDLC_UI/schema-initiative-v0.md#6-events--append-only-audit). **S1 kinds: `create`, `delete`**; `stage_transition` in S2. Hard-deleted initiatives write a tombstone to `deleted_initiative_events`.
- **Attachments — MVP:** **links only** (Figma, Claude Design, SharePoint). No binary uploads; approved hosts documented in [docs/OPERATIONS.md](./docs/OPERATIONS.md).
- **Backup cadence:** daily automated snapshot + ad-hoc before demos; **30-day** retention — [docs/BACKUP_RUNBOOK.md](./docs/BACKUP_RUNBOOK.md).
- **Time zone:** **UTC** stored, **SAST** displayed (README line; full UX in Sprint 1+).
- **Git host + CI runner:** **GitHub + GitHub Actions** — [docs/adr/0002-git-host-ci-runner.md](./docs/adr/0002-git-host-ci-runner.md).
- **Accessibility:** **WCAG 2.1 AA** + full keyboard navigation; measured ratios in [docs/ui-notes.md](./docs/ui-notes.md); **axe-core Playwright** wired in Sprint 0 and **required for every shipped user-visible surface from Sprint 1 onward** (critical + serious violations fail CI).
- **Devices:** **desktop** browsers only (Chrome / Edge / Safari current). Mobile deferred.
- **PII:** initiative text may include staff + client names; retention policy deferred until data owner named; delete path = CRUD (Sprint 1).
- **Schema evolution (JSON path):** `schemaVersion` + one-shot scripts under `scripts/migrations/` (see README there).
- **Undo last move:** **out of scope** — backward moves + pre-wipe snapshots (Sprint 8) cover rework.
- **First real initiative (Steerco demo):** candidate named during **Sprint 7** per plan.

## Scripts

| Script                    | Purpose                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `npm run lint`            | ESLint                                                                                |
| `npm run format:check`    | Prettier                                                                              |
| `npm run typecheck`       | `tsc --noEmit`                                                                        |
| `npm run schema:validate` | Regenerate JSON Schema + validate `../plans/PDLC_UI/fixtures/initiative-example.json` |
| `npm run db:migrate`      | Apply pending SQLite migrations under `src/storage/migrations/`                       |
| `npm test`                | Vitest                                                                                |
| `npm run test:e2e:a11y`   | Playwright + axe smoke (ideas list, create dialog) + ideas CRUD smoke                 |

## Related docs

- [docs/OPERATOR_CHEATSHEET.md](./docs/OPERATOR_CHEATSHEET.md) — **what to open in the browser**; when you run scripts vs when CI does
- [docs/OPERATIONS.md](./docs/OPERATIONS.md) — deploy, rollback, audit policy
- [docs/BACKUP_RUNBOOK.md](./docs/BACKUP_RUNBOOK.md) — backup + restore
- [docs/adr/README.md](./docs/adr/README.md) — ADR index
- [plans/PDLC_UI/plan-mode-prelude.md](../plans/PDLC_UI/plan-mode-prelude.md) — Plan-mode preamble

## Opening a PR (sprint traceability)

| Sprint | PR body                                                  |
| ------ | -------------------------------------------------------- |
| S0     | [docs/SPRINT_S0_PR_BODY.md](./docs/SPRINT_S0_PR_BODY.md) |
| S1     | [docs/SPRINT_S1_PR_BODY.md](./docs/SPRINT_S1_PR_BODY.md) |

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

- **Sprint 0:** `data/` exists for backups discipline; persistence ships **Sprint 1** (SQLite or JSON — see [docs/adr/0001-stack-and-persistence.md](./docs/adr/0001-stack-and-persistence.md)).
- **Backups:** `backups/` (gitignored contents; created by `scripts/backup-daily.sh`).

## Environment variables

See [`.env.example`](./.env.example). **No secrets in git** — real keys live in an ICT-approved store.

| Variable  | Purpose                                                                        |
| --------- | ------------------------------------------------------------------------------ |
| `GIT_SHA` | Optional build identifier (footer + `/api/health`). CI sets from `github.sha`. |

## Dependency upgrade policy

- **Patch:** monthly batch (Dependabot optional).
- **Minor / major:** require PR + smoke test (`npm test`, `npm run schema:validate`); **major** needs an ADR if it changes runtime or build contracts.

## Sprint 0 kick-off decisions (Day 1)

Captured from [plans/PDLC_UI/plan.md § Sprint 0 kick-off decisions](../plans/PDLC_UI/plan.md):

- **Canonical JSON field case:** **camelCase** (e.g. `parkedIntent`, `parkedReason`). Legacy snake_case in prose is deprecated — update when touched.
- **Initiative human ID:** `handle` format **`INIT-NNNN`** (zero-padded, monotonic) in addition to internal `id`.
- **Event / audit log:** `events[]` on each initiative — **seeded in Sprint 1** (stage transitions `{ at, by, from, to, note? }` + create/delete).
- **Attachments — MVP:** **links only** (Figma, Claude Design, SharePoint). No binary uploads; approved hosts documented in [docs/OPERATIONS.md](./docs/OPERATIONS.md).
- **Backup cadence:** daily automated snapshot + ad-hoc before demos; **30-day** retention — [docs/BACKUP_RUNBOOK.md](./docs/BACKUP_RUNBOOK.md).
- **Time zone:** **UTC** stored, **SAST** displayed (README line; full UX in Sprint 1+).
- **Git host + CI runner:** **GitHub + GitHub Actions** — [docs/adr/0002-git-host-ci-runner.md](./docs/adr/0002-git-host-ci-runner.md).
- **Accessibility:** **WCAG 2.1 AA** + full keyboard navigation; measured ratios in [docs/ui-notes.md](./docs/ui-notes.md); **axe-core Playwright** in CI (Bar B extension, wired Sprint 0).
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
| `npm test`                | Vitest                                                                                |
| `npm run test:e2e:a11y`   | Playwright + axe smoke on `/`                                                         |

## Related docs

- [docs/OPERATOR_CHEATSHEET.md](./docs/OPERATOR_CHEATSHEET.md) — **what to open in the browser**; when you run scripts vs when CI does
- [docs/OPERATIONS.md](./docs/OPERATIONS.md) — deploy, rollback, audit policy
- [docs/BACKUP_RUNBOOK.md](./docs/BACKUP_RUNBOOK.md) — backup + restore
- [docs/adr/README.md](./docs/adr/README.md) — ADR index
- [plans/PDLC_UI/plan-mode-prelude.md](../plans/PDLC_UI/plan-mode-prelude.md) — Plan-mode preamble

## Opening a PR (Sprint S0 traceability)

Paste the body from [docs/SPRINT_S0_PR_BODY.md](./docs/SPRINT_S0_PR_BODY.md) into the GitHub PR description.

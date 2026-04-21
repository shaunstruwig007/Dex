# OPERATIONS — `pdlc-ui` (MVP)

**Local browser URLs & “when do I run scripts?”** → [OPERATOR_CHEATSHEET.md](./OPERATOR_CHEATSHEET.md)

## Deploy (localhost / internal VM)

1. `cd pdlc-ui && npm ci && npm run build`
2. Set `GIT_SHA` at build time for traceability: `GIT_SHA=$(git rev-parse HEAD) npm run build`
3. Run: `npm run start` (port **3000**). Process manager (systemd, PM2) wraps the same command on the host.
4. Health: `GET /api/health` — JSON with `status`, `gitSha`, `version`, `uptime`. Readiness stub: `GET /api/ready`.

## Rollback

1. Stop the Node process.
2. Restore previous build artefact (keep last good `.next/` tarball or container image tag).
3. Restore data from backup per [BACKUP_RUNBOOK.md](./BACKUP_RUNBOOK.md) if schema or store changed.

## Logs

- **Application:** stdout JSON (structured logging lands post-S0).
- **Reverse proxy / TLS:** ICT-managed; document access path here when known.

## Environment

- Copy `.env.example` → `.env` (never commit `.env`). Dummy values only in git.
- `PDLC_DB_PATH` controls the SQLite file location (default `./data/pdlc.db`).

## Persistence (Sprint 1)

- **Engine:** SQLite via `better-sqlite3`, per [ADR-0001](./adr/0001-stack-and-persistence.md).
- **Query layer:** **Drizzle ORM** (`drizzle-orm/better-sqlite3`) wraps the same handle. Typed table definitions live in [`src/storage/schema.ts`](../src/storage/schema.ts); all repository reads/writes go through the query builder ([`src/storage/repository.ts`](../src/storage/repository.ts)).
- **Pragmas on open (`src/storage/db.ts`):** `journal_mode=WAL`, `busy_timeout=5000`, `foreign_keys=ON`. Both `openSqlite()` (raw handle, used by the migration runner + tests) and `openDrizzle()` (query surface) share one cached connection — pragmas apply once.
- **Single-writer assumption:** one Next.js process owns the DB file. WAL lets multiple readers run alongside the writer; `busy_timeout` absorbs incidental overlapping writes. Do **not** point a second process at the same file until a writer-coordination strategy is agreed in a follow-up ADR.
- **Migrations:** hand-written SQL under [`src/storage/migrations/`](../src/storage/migrations/) applied by [`src/storage/migrate.ts`](../src/storage/migrate.ts). Run via `npm run db:migrate` or lazily on first API request (see [`src/storage/init.ts`](../src/storage/init.ts)). Migration state lives in `schema_migrations`. `drizzle-kit` ([`drizzle.config.ts`](../drizzle.config.ts)) is installed for introspection only — we do **not** use `drizzle-kit push` or the generator; any column change requires a new `NNN_description.sql` file + matching `schema.ts` edits in the same PR.
- **Readiness probe:** `GET /api/ready` runs `ensureStorageReady()` and returns `503` if any migration is pending.
- **Hard delete (Bar A):** initiatives removed by `DELETE /api/initiatives/[id]` are removed from the row, and a `delete` event is appended to `deleted_initiative_events` for the audit trail.

## Time zone

- **UTC** stored in APIs and persistence; **SAST** displayed in UI (Sprint 1+).

## PII

- Initiative content may include **staff and client names**. Retention policy deferred until a data owner is named; **delete** path is initiative CRUD (Sprint 1 — hard delete + audit event).

## Security audit policy

- **`npm audit`:** run locally and in CI weekly; **warn** on moderate; **block merge** on critical unless waived in PR with ICT sign-off and ADR note.
- **`gitleaks` / secret scanning:** **not** in CI for Sprint 0 — run locally before push; track “add gitleaks to CI” in project slice log before internal-host (Bar B) rollout.

## Branch protection (GitHub)

When policy allows, enable on `main`:

- [ ] Require pull request before merging
- [ ] Require status checks: **pdlc-ui CI** job green
- [ ] Do not allow bypassing the above settings

See [ADR-0002](./adr/0002-git-host-ci-runner.md).

## UI shell (Sprint 0)

- Shell reflects **`/anthropic-frontend-design`** direction (see PR + [ui-notes.md](./ui-notes.md)).
- **Measured contrast** and keyboard traversal logged in `ui-notes.md`.

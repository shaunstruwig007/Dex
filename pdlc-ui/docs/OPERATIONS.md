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

## Time zone

- **UTC** stored in APIs and persistence; **SAST** displayed in UI (Sprint 1+).

## PII

- Initiative content may include **staff and client names**. Retention policy deferred until a data owner is named; **delete** path is initiative CRUD (Sprint 1).

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

## Sprint S0 — Spike + shell + contracts

**Branch:** `feat/s0-foundation`

### Plan mode traceability

- [plans/PDLC_UI/plan-mode-prelude.md](../../plans/PDLC_UI/plan-mode-prelude.md)
- [plans/PDLC_UI/tech-stack.md](../../plans/PDLC_UI/tech-stack.md)
- [plans/PDLC_UI/seeds/s0-foundation.md](../../plans/PDLC_UI/seeds/s0-foundation.md)
- Inline seed: [plans/PDLC_UI/sprint-backlog.md § Sprint 0](../../plans/PDLC_UI/sprint-backlog.md)

### Summary

- Scaffold `pdlc-ui` (Next.js 15 + React 19 + TS strict + Tailwind v4 + shadcn/ui + TipTap read-only dev route).
- R18 `tokens.css` + measured contrast / keyboard notes in `docs/ui-notes.md`.
- Zod initiative schema → JSON Schema; CI validates `plans/PDLC_UI/fixtures/initiative-example.json`.
- ADR-0001 (stack + persistence), ADR-0002 (GitHub Actions + branch protection checklist).
- `OPERATIONS.md`, `BACKUP_RUNBOOK.md`, `.env.example`, `/api/health` + `/api/ready`, backup script, README kick-off block.

### Explicitly out of scope

Initiative CRUD, swim lanes, brief wizard, full migrations, Docker prod image, gitleaks in CI (documented policy only).

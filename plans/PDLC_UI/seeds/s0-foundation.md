> **FROZEN 2026-04-24 — pdlc-ui parked.** The live plan is [`plans/skill-pipeline/README.md`](../../skill-pipeline/README.md). This seed does not drive current work.

Read plans/PDLC_UI/plan-mode-prelude.md first (mandatory reading, R16/R18 non-negotiables, output expectations). Then execute Sprint S0 — Spike + shell + contracts. Branch: feat/s0-foundation.

Stack + UI primitives (do not coin a stack yourself):
Treat plans/PDLC_UI/tech-stack.md as the recommended default. ADR-0001 ratifies or overrides — do not start coding before ADR-0001 is drafted in the same PR. If S0 keeps the recommended defaults, install the full tech-stack.md list (Next.js 15 + React 19 + TS strict + TailwindCSS + tokens.css + shadcn/ui + TipTap + Zod + SQLite via better-sqlite3 + Drizzle + Vitest + Playwright + ESLint/Prettier).

Bar split (from sprint-backlog § Sprint 0):
- Bar A minimum (MUST ship to unlock S1): runnable pdlc-ui/ shell (one route, no console errors); plans/PDLC_UI/schema-initiative-v0.md committed + one golden example initiative JSON that CI validates; pdlc-ui/README.md (how to run, where data lives, env vars, dependency upgrade policy, "Kick-off decisions" block — see below); pdlc-ui/docs/adr/README.md + 0000-template.md + 0001-stack-and-persistence.md; pdlc-ui/src/styles/tokens.css seeded per tech-stack.md § UI primitives (all required semantic colour tokens with AA-validated values + typography scale + focus-ring token) AND shadcn/ui core primitives installed (Button, Input, Dialog, DropdownMenu, Toast, Badge, Card, Tooltip at minimum); atomic-write helper stub + pdlc-ui/scripts/backup-daily.sh (cp -r data/ backups/$(date)) with 30-day retention referenced in BACKUP_RUNBOOK.
- Bar B extensions (land in S0 if trivial, otherwise track in slice log; required before Bar B sprints): pdlc-ui/docs/OPERATIONS.md (deploy/rollback outline, health URL, logs, branch protection checklist — R16 §7–8); pdlc-ui/docs/BACKUP_RUNBOOK.md (owner = Shaun, daily cadence, 30-day retention, restore-drill steps; SQLite path = WAL + busy_timeout + VACUUM INTO; JSON path = atomic rename + restore-from-backup); .env.example (dummy keys only); /api/health liveness + /api/ready stub; build GIT_SHA or package.json version exposed via /api/health JSON or UI footer; CI required on PR (lint + format + typecheck + JSON schema validate); npm/pnpm audit + gitleaks policy documented; axe-core Playwright a11y smoke test wired (green CI gate).

Kick-off decisions block (must appear in pdlc-ui/README.md — one bullet each, from plan.md § Sprint 0 kick-off decisions):
camelCase canonical; handle ID format (e.g. INIT-0042); events[] seeded in S1; attachments = links-only in MVP; backup cadence = daily + 30-day retention; timezone = UTC stored / SAST displayed; git host + CI runner (record in an ADR); WCAG 2.1 AA + keyboard nav (keyboard-only for Bar A); desktop browsers only; PII note (staff + client names may appear, retention deferred until data owner named); schemaVersion + JSON migration stub in pdlc-ui/scripts/migrations/; no undo stack (rely on backward moves + pre-wipe snapshots); first real initiative TBC at S7.

ADRs to file in S0:
- ADR-0001: stack choice + persistence (SQLite vs JSON) — include decision, context, consequences, and which Bar A minimum deliverables follow.
- ADR-0002 (or README line if truly trivial): git host + CI runner choice, branch protection plan.
- ADR-0003 (or README line): UTC stored, SAST displayed.

Schema requirements in this sprint:
plans/PDLC_UI/schema-initiative-v0.md must include schemaVersion (1), revision (integer, starts at 1), id, handle, title, body, lifecycle, createdAt, updatedAt, and placeholder stage sub-objects (gate, brief, discovery, design, spec, release), sourceRefs[], attachments[], events[]. Commit one golden fixture file (e.g. plans/PDLC_UI/fixtures/initiative-example.json) and wire CI to validate it against the schema — failing validation blocks merge.

UI (R18):
Read .claude/skills/anthropic-frontend-design/SKILL.md before styling the shell. The shell MUST demonstrate the R18 baseline in working form: tokens.css wired (every colour comes from a token, no hardcoded hex in components); measured AA contrast ratios (numbers, not "looks fine") logged in pdlc-ui/docs/ui-notes.md for text-on-surface, link-on-surface, and text-on-primary; visible 2 px focus ring on every interactive element; shell route completable by keyboard only; shadcn/ui primitives installed and used for Button + Dialog + DropdownMenu + Toast. TipTap library installed + a minimal read-only page validates the build pipeline — the editor is NOT yet wired to real content (that arrives with S1 body field + S3 brief wizard).

DoD (Plan must produce tasks closing each):
- [ ] Fresh clone → README steps → app loads in browser, no console errors.
- [ ] Shell reflects /anthropic-frontend-design direction; tokens.css drives every colour; measured AA contrast ratios logged in pdlc-ui/docs/ui-notes.md; keyboard-only traversal recorded.
- [ ] schema-initiative-v0.md + golden fixture committed; CI enforces schema validation (failing CI = no merge).
- [ ] BACKUP_RUNBOOK.md names owner + restore drill (Bar B extension — defer only if internal-host rollout is far away).
- [ ] pdlc-ui/docs/adr/README.md + ADR-0001 filed; tech-stack.md defaults either kept or explicitly overridden in ADR-0001.
- [ ] .env.example + OPERATIONS.md + /api/health route live (R17 seed; Bar B extension).
- [ ] Kick-off decisions block present in pdlc-ui/README.md.
- [ ] shadcn/ui core primitives installed; TipTap installed + read-only demo builds (editor wiring defers to S1/S3).
- [ ] Branch feat/s0-foundation open; PR description cites Sprint S0 + links plan-mode-prelude.md + tech-stack.md + this seed.

Explicitly OUT of S0 (do not scope-creep):
- Initiative CRUD (S1), swim lanes (S2), `pdlc-brief-custom` wizard (S3), PRD generation, backward moves, canTransition matrix, design review gate, hard gates of any kind.
- Full SQLite migration chain beyond an empty-DB migration; production Docker; staging environment; headless agent execution (R15 = Phase 2); R12 company-strategy surfaces; R13 vault continuous sync.
- TipTap wired to real content (arrives S1 body + S3 brief wizard); dark theme (post-MVP); mobile layouts (desktop-only).

Post-merge ceremony:
- Append one line to 04-Projects/PDLC_Orchestration_UI.md Slice log with "Tech: next sprint must preserve schemaVersion=1, handle format, revision field, events[] append contract, tokens.css semantic names."
- Tick Sprint 0 in plans/PDLC_UI/plan.md Progress log.

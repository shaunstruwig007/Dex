Read plans/PDLC_UI/plan-mode-prelude.md first. Then execute Sprint S1 — Idea capture + persistence (Bar A). Branch: feat/s1-idea-capture.

Bar: A. Goal: real write-safety for initiatives (title + body only this sprint), not docs.

Persistence (follow ADR-0001 from S0 — do NOT re-open the stack/store decision):
- If SQLite: enable WAL, set busy_timeout, ship initial migration + runner + schema_migrations table; document single-writer assumption in OPERATIONS.md.
- If JSON: atomic rename write pattern (tmp file + fsync + rename); schemaVersion on file; corruption recovery path = restore from backup (runbook already present).
- Initiative record fields per plans/PDLC_UI/schema-initiative-v0.md: id (uuid/nanoid), handle (monotonic, unique, format INIT-NNNN), title, body, lifecycle='idea', createdAt, updatedAt, revision (starts at 1, +1 on every successful save — optimistic-lock ready for S2).

CRUD scope (Bar A — do not add lanes or transitions):
- Create modal: title required (non-empty, trimmed, PLAIN TEXT only per R18); body optional, edited via TipTap rich-text editor with the R18 minimum toolbar (Bold, Italic, Underline, H2, H3, bulleted list, numbered list, link, inline code, clear formatting) — per tech-stack.md § UI primitives.
- Card + list VIEW surfaces rendered content (TipTap read-only or sanitised HTML) — NEVER raw markdown (R18).
- List or single-column view of cards in lifecycle='idea' (no full board yet — stage badge only).
- Edit: inline or modal; update bumps revision; reject on stale revision with clear message.
- Delete: confirm dialog; soft-delete optional, hard-delete acceptable for Bar A.

Audit log (events[] seeded THIS sprint per plan.md § Sprint 0 kick-off decisions):
- Append {at, by='shaun', kind, payload} on create, delete, and stage transitions (stage transitions land with S2 moves).
- Minimum kinds this sprint: 'create', 'delete'. stage_transition joins in S2.

UI (Implementation standard + R18):
- Read .claude/skills/anthropic-frontend-design/SKILL.md before building the modal + list.
- Use shadcn/ui primitives from S0; every colour reads tokens.css; visible 2 px focus ring on all interactive elements; keyboard nav end-to-end.
- TipTap editor wired to body with R18 minimum toolbar; paste hygiene on (strip styles / fonts / colours); content stored as markdown (or sanitised HTML per ADR-0001); card + list render through content renderer, never raw markdown.

DoD:
- [ ] Create → appears after refresh; edit → persists with revision bumped; delete → gone.
- [ ] handle visible on card + list; unique across initiatives.
- [ ] Optimistic lock works: stale revision update is rejected with clear UX.
- [ ] events[] written for create + delete (stage_transition reserved for S2).
- [ ] SQLite WAL + migration OR JSON atomic + schemaVersion in place per ADR-0001.
- [ ] TipTap rich-text editor on body with full R18 toolbar; cards + list render content through the renderer (no raw markdown surfaces anywhere).
- [ ] Paste hygiene verified (paste from Word / Docs / webpage strips styles and keeps only toolbar-supported marks).
- [ ] Modal + list pass the /anthropic-frontend-design bar (no default AI-slop styling); axe-core Playwright smoke test passes (if wired in S0).
- [ ] No swim lanes, no column moves, no brief wizard in this PR.

Schema + docs same-PR discipline:
- If this sprint adds any initiative field not already in schema-initiative-v0.md, update that file in the SAME PR (R16 guardrail 1).

Explicitly OUT: swim lanes (S2), column moves, `pdlc-brief-custom` wizard, design fields, spec fields, release notes, R13 vault sync.

Post-merge: Slice log line + tick S1 Progress in plan.md.

# PDLC UI — Plan mode seed files (detailed reference)

> **FROZEN 2026-04-24 — pdlc-ui parked.** The live plan is [`plans/skill-pipeline/README.md`](../../skill-pipeline/README.md). Sprint seeds S0–S9 in this folder are preserved for reference; they do not drive current work.

**These files are not what you paste into Cursor.** The paste target is the short **Plan mode seed** prompt inside each sprint block in [`../sprint-backlog.md`](../sprint-backlog.md). That prompt tells Cursor to **read** the sprint's seed file here (among others) before producing a plan.

## Why the indirection

Every sprint's scope shifts based on what the previous sprint actually shipped:

- **ADR-0001** in S0 picks SQLite vs JSON — S1's write path depends on it.
- **S5–S6** produce `pdlc-ui/docs/design-system.md v0.1` — S7+ consume it.
- **S6** introduces `designReview` — **S8**'s `canTransition` matrix must reconcile it.

If the paste carried the whole seed inline, every drift would force editing the paste. Instead the paste is a short **"read these files in order, then adapt"** prompt; Cursor picks up the current state of each referenced file on every run.

## What lives where

| Artefact | Location | Role |
|----------|----------|------|
| **Pasteable prompt** | [`../sprint-backlog.md`](../sprint-backlog.md) § **Plan mode seed** inside each sprint block | The one thing you copy and paste. ~10 lines. Lists files for Cursor to read. |
| **Detailed seed** | `s#-<slug>.md` (this folder) | Read by Cursor via the paste prompt. Full Bar split, ADR list, DoD checkboxes, Explicitly OUT, kick-off decisions. |
| **Shared preamble** | [`../plan-mode-prelude.md`](../plan-mode-prelude.md) | Read by Cursor first — R16 / R18 non-negotiables, branch-per-cycle, camelCase, output expectations. |
| **Scope source of truth** | [`../sprint-backlog.md`](../sprint-backlog.md) § sprint block — Goal / DoD / Out / Risks | Backlog DoD wins when a seed lags. |
| **Previous-sprint reality** | [`../../04-Projects/PDLC_Orchestration_UI.md`](../../04-Projects/PDLC_Orchestration_UI.md) **Slice log** | What the last sprint *actually* shipped. Cursor diffs this against the seed and flags invalidated DoD items before Build. |

## Naming

File names mirror the recommended branch (`feat/s<n>-<slug>`): `s3-brief-wizard.md` ↔ `feat/s3-brief-wizard`. Keep them in lockstep if a branch is renamed.

## Editing discipline

- **Do not paste a seed file directly** into Cursor Plan mode. Paste the prompt from the backlog — it carries the list of files to read, including this one.
- Seed edits are **isolated commits** so git history on `sprint-backlog.md` stays focused on Goal / DoD / Out / Risks changes.
- Any new rule that applies to **every** sprint goes into [`../plan-mode-prelude.md`](../plan-mode-prelude.md) — never duplicated into each seed.
- When the backlog's DoD for a sprint changes, update that sprint's seed file in the **same PR** ([R16 guardrail 1](../plan.md#engineering-governance-cto--tech-lead--anti-drift)).

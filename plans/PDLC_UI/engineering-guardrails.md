# PDLC UI — engineering guardrails (cross-sprint, R16)

**Scope:** Tech-lead / CTO-hat guardrails that apply to **every** sprint to prevent **pattern drift**, **schema silos**, and **one-off implementations** between sprints. Complements Steerco **product** governance in [`plan.md`](./plan.md) **R16**.

**Not this file's job:** the UI / a11y standard (see [`implementation-standard.md`](./implementation-standard.md)) or the stack / UI-primitives spec (see [`tech-stack.md`](./tech-stack.md)). This file is **process and gates**.

**Companions:**

- Requirement authority: [`plan.md` R16 + R17](./plan.md#requirements)
- Plan-mode enforcement form: [`plan-mode-prelude.md`](./plan-mode-prelude.md)

---

## 1. Guardrail table (minimum bar)

| Guardrail | Rule |
|-----------|------|
| **Lifecycle & schema** | Code changes to **`lifecycle`** values, transition matrix, or initiative **shape** ship **with** updates to [`schema-initiative-v0.md`](./schema-initiative-v0.md) and [`lifecycle-transitions.md`](./lifecycle-transitions.md) in the **same PR** (default). |
| **ADRs** | **`pdlc-ui/docs/adr/`** — numbered markdown (`0001-store-sqlite.md`); **title + context + decision + consequences**. Required for: persistence choice, framework, auth, hosting, anything costly to reverse. |
| **CI** | From **S0**: lint + format + typecheck; **JSON schema validate** golden fixture. From **S8**: **`canTransition`** unit tests in CI (already DoD). |
| **Plan mode traceability** | PR description states **Sprint S#** and links the **Plan mode seed** block (inline in [`sprint-backlog.md`](./sprint-backlog.md) § Sprint #) + [`plan-mode-prelude.md`](./plan-mode-prelude.md). |
| **Design system after S6** | New UI **consumes** `pdlc-ui/docs/design-system.md` / shared primitives; exception = **ADR or PR note** with reason. |
| **Sprint handoff** | Slice log +1 line: *"Tech: next sprint must preserve X (API Y, component Z)"* — reduces context loss for solo work. |
| **R17 split (S0 vs S1)** | **S0:** `.env.example`, **`/health`** (+ **`/ready`** stub), **version/build id** wired or documented, **OPERATIONS.md** (deploy/rollback outline), CI **required** (not optional) for lint + schema validate, **audit policy** documented. **S1:** persistence **write path** meets SQLite **WAL / busy_timeout / migrations** or JSON **atomic + schemaVersion**; **`revision`** on initiative; extend runbook for **live** data. |
| **Branch per cycle** | **No feature work committed directly on `main`** (repo default). Each sprint / shippable increment uses a **named branch** (`feat/s<N>-<slug>` or `sprint/<N>-<slug>`); integrate via **PR** only. Solo developer: same rule — protects `main` as always-integratable. |
| **Merge gate** | **No merge to default** until **CI is green**. Enable **branch protection** (require status checks before merge) on the host when ICT / repo policy allows; document in **OPERATIONS.md** (S0). |
| **MoneyPenny (PR gatekeeper)** | Before declaring a **`pdlc-ui/`** PR merge-ready, run **`/moneypenny-custom`** (see [`skill-agent-map.md` § Engineering](./skill-agent-map.md#engineering--merge-gate-pdlc-ui-repo) and [`../../.claude/skills/moneypenny-custom/SKILL.md`](../../.claude/skills/moneypenny-custom/SKILL.md)). Modes: (A) CI green loop, (B) R16 same-PR audit, (C) review-comment triage, (D) post-merge Slice-log close-out. **Not** a substitute for human judgment on product trade-offs. |

## 2. Hotfix — only exception to branch-per-cycle

- `hotfix/*` branch cut from a **tagged release**.
- Still PR + **same CI** gates.
- ICT emergency bypass only with **post-hoc ADR** in the slice log.

## 3. Sprint 0 vs later — avoid S0 bloat

**S0** installs the **rails**:

- ADRs (`pdlc-ui/docs/adr/README.md` + first ADR for stack / persistence).
- CI required on PR (lint + format + typecheck + JSON schema validate golden fixture).
- `schema-initiative-v0.md` committed + validated.
- `/health` + `/ready` stub, `.env.example`, `BACKUP_RUNBOOK.md`, `OPERATIONS.md` one-pager.

**S0 does not** need: full staging environment, Docker production image, migration history beyond "empty DB", or advanced security scanning — those land in **S1** (first real writes) or **S2** (multi-entity stress) unless ICT forces earlier.

**Principle:** get the **skeleton and contracts** right in S0; get **data safety and deploy parity** right before Steerco sees writes at scale (latest end of S1).

## 4. End-of-sprint ceremony (5 minutes)

- Schema still matches app? (If no, same-PR discipline was broken — file an ADR-note.)
- Any new magic string (colour, lifecycle value, event kind) introduced without a home?
- ADR filed for every big choice this sprint?
- `main` only advanced by **merged PR with green CI** (not direct sprint pushes)?
- Sprint **smoke checklist** added or updated under `pdlc-ui/docs/smoke/` (`S<n>-<slug>.md`) so the next-you knows what to click — see [smoke/README.md](../../pdlc-ui/docs/smoke/README.md).
- If the sprint shipped via PR, did **`/moneypenny-custom`** (or equivalent R16 audit) run before merge?

---

*Extracted 2026-04-21 from `sprint-backlog.md` so R16 guardrails live in their own reference file and grow independently of sprint-specific content.*

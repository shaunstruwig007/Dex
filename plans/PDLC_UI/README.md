# PDLC Orchestration UI — improvement plans

**Purpose:** Working area for **`/dex-improve`** outputs and derived implementation plans for the **Steerco-facing PDLC orchestration UI** (thin slices, vibe-coding friendly).

| Doc | Role |
|-----|------|
| [plan.md](./plan.md) | Main **Dex improvement** workshop — requirements, capability match, steps, acceptance criteria |
| [company_strategy.md](./company_strategy.md) | **WT company strategy** (working draft for future **R12**; not Dex `pillars.yaml`) |
| [lifecycle-transitions.md](./lifecycle-transitions.md) | **`spec_ready`**, forward/backward moves, **`parked`**, post-MVP **company strategy** |
| [sprint-backlog.md](./sprint-backlog.md) | **Sprints S0–S8** (+ **S9 deferred** for R12 company strategy) — agile goals, **R#** mapping, **DoD**, **Plan mode** seeds |
| [plan-mode-prelude.md](./plan-mode-prelude.md) | **Shared preamble** every sprint Plan-mode run reads first (R16 + R18 non-negotiables) — referenced by seeds, never pasted |
| [tech-stack.md](./tech-stack.md) | **Recommended stack + UI primitives + a11y baseline** — ADR-0001 ratifies or overrides in S0 (R18) |
| [skill-agent-map.md](./skill-agent-map.md) | **Stages ↔ Dex skills**; preview vs prompt library; **agent-config** overrides (future); **PR / merge gate** (MoneyPenny) |
| [../../.claude/skills/moneypenny-custom/SKILL.md](../../.claude/skills/moneypenny-custom/SKILL.md) | **MoneyPenny** — Cursor skill: green CI loop, R16 same-PR audit, review triage, post-merge Slice log close-out for **`pdlc-ui/`** PRs |
| [../../04-Projects/PDLC_Orchestration_UI.md](../../04-Projects/PDLC_Orchestration_UI.md) | **North star** — §0 architecture (WT UI separate from Dex), stages 0–7, slice log |

**Pillars:** `ai_process_adoption` · `streamlined_product_launch` (`System/pillars.yaml`)

**UI implementation root (this repo):** `pdlc-ui/` — full **CRUD** persistence for board data; internal Steerco access only. See [plan.md § Phase 5](./plan.md#phase-5--decisions-resolved-2026-04-21).

**Design → spec chain:** **Claude Design (web)** + **manual Figma DS** → **`/anthropic-frontend-design`** → column **`spec_ready`** → **`/agent-prd`** (pre-filled; **BDD** optional) → **`develop`** (handoff for **Plan mode**). Detail: [skill-agent-map.md](./skill-agent-map.md) · [lifecycle-transitions.md](./lifecycle-transitions.md).

**Export pack (copy-paste):** [export-pack-template.md](./export-pack-template.md)

**Governance (2026-04-23):** Steerco **decides**; **Shaun** = interim **board owner**; **board wins** `lifecycle` vs PRD YAML; swim lanes **`idea` → `discovery` → `design` → `spec_ready` → `develop` → `uat` → `deployed`** (+ **`parked`**); **backward** moves except **`→ idea`** (wipe to title + body); **BDD optional**; **R10 backups**; feature PRDs in **`06-Resources/PRDs/`** (bootstrap PRD for `pdlc-ui` only).

**PR discipline (engineering):** Before merging any **`pdlc-ui/`** change to default, run **`/moneypenny-custom`** (or `audit <PR#>`) so CI is green and R16 same-PR rules are checked — see [sprint-backlog.md](./sprint-backlog.md) (**Engineering guardrails** + **PR merge gate**) and [skill-agent-map.md](./skill-agent-map.md#engineering--merge-gate-pdlc-ui-repo).

Add follow-on files here (e.g. `slice-stage-1.md`, ADRs) as slices ship.

---

*Folder created 2026-04-20.*

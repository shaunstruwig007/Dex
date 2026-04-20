# PDLC UI — lifecycle, rewind rules, strategy thread

**Companion:** [plan.md](./plan.md) · [skill-agent-map.md](./skill-agent-map.md) · [04-Projects/PDLC_Orchestration_UI.md](../../04-Projects/PDLC_Orchestration_UI.md) — **company strategy** = post-MVP (see § Company strategy alignment).

---

## Canonical column order (`lifecycle`)

`idea` → `discovery` → `design` → **`spec_ready`** → `develop` → `uat` → `deployed`

**Branch:** `parked` (see below).

**Board wins** for `lifecycle` vs PRD YAML — see [PRDs/README § Lifecycle](../../06-Resources/PRDs/README.md#lifecycle-steerco--pdlc-board).

---

## Forward flow (happy path)

1. **`idea`** — Modal: **minimum** title + description/summary; save → card in **Idea**.
2. **`idea` → `discovery`** — **Blocked until** a completed **`/product-brief`** (stepwise popup; help text per question). On save, **discovery** work is active: research, problem detail, solution directions, **open questions**. (Brief is **required** to enrich discovery; discovery will later expand to evidence-led research — not MVP.)
3. **`discovery`** — Workshop: open a question → answer → save → optional **“Re-run discovery”** (same skill / prompt pack with updated answers) to refresh synthesis without losing history (append **iteration** or timestamp in audit).
4. **`discovery` → `design`** — User builds **export pack** (prompt + `.md`) for **Claude Design**; attach outputs to card; move to **Design** when artefacts are linked.
5. **`design`** — Lo-fi / optional hi-fi → **`/anthropic-frontend-design`** → **design review** → when happy, **`design` → `spec_ready`**.
6. **`spec_ready`** — **`/agent-prd`**-aligned flow (MVP: export + Cursor; later in-app). **Structured clarifying questions in the spec wizard are required** so the PRD is not incomplete; iterate questions as usage proves gaps. Optional later = **card-level** prompts / notifications for async follow-ups.
7. **`spec_ready` → `develop`** — **`specComplete`** (nudge checklist — see sprint backlog); **handoff pack** to engineering: PRD `.md` + design links for **Cursor Plan mode**. **`develop` / `uat` / `deployed`:** status lanes — **PM updates** to reflect delivery; **user-facing release notes** (non-technical) on the card — see plan **R14**.

---

## Backward moves (scope change / rework)

**Principle:** Cards must be **rewindable** without forking a new initiative every time reality shifts.

| From | Allowed back to | Data retained |
|------|-----------------|---------------|
| `spec_ready` | `discovery`, `design` | **All** brief, discovery, design, spec-draft artefacts unless user chooses to prune |
| `design` | `discovery` | Brief + discovery; design artefacts may be **superseded** (keep versions or “stale” flag) |
| `discovery` (and any column) | `idea` | **Wipe everything except title + description/summary** — **all transitions into `idea`** use this rule |
| `develop` / `uat` | earlier columns | **Product decision** — recommend same as `spec_ready` row (retain by default); never auto-wipe without confirm |

**Wipe rule (mandatory):** Any transition that lands the card in **`idea`** clears **everything except `title` + `body` (description/summary)** — brief, discovery, open questions, design artefacts, spec drafts, tags, parked intent/reason, release notes draft. **Accidental wipe mitigation (MVP):** require **high-friction confirm** (e.g. type initiative **title** to confirm) and/or **write a JSON snapshot** of the pre-wipe card to `pdlc-ui/data/snapshots/` for manual restore — **no** silent undo stack in v1 unless added later.

---

## `parked`

Use **`parked_intent`** (or equivalent) **and** **`parked_reason`** (short free text) on the card:

| Value | Meaning |
|-------|---------|
| `revisit` | We intend to come back; not dead. |
| `wont_consider` | Deprioritised / not doing for now (different from “done”). |

**UI:** moving to **Parked** requires **`parked_intent`** (default `revisit` if product allows) **and** a **non-empty reason** (e.g. “Waiting on client budget”, “Superseded by X”).

---

## Company strategy alignment (“golden thread”) — **post-MVP**

**Not in MVP.** Dex **`System/pillars.yaml`** is **personal** planning context — **not** Wyzetalk **company strategy**.

**Future:** maintain **[company_strategy.md](./company_strategy.md)** (or CMS) describing WT strategy; initiatives that look like **off-strategy bets** get **warnings or tags** once rules + data exist. Until then, no blocking tags at idea capture.

---

*Last updated: 2026-04-20 — parked reason; all-into-idea wipe; strategy post-MVP; wipe mitigation.*

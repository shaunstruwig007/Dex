# PDLC UI — skills & agent behaviour map

> **FROZEN 2026-04-24 — pdlc-ui parked.** The live plan is [`plans/skill-pipeline/README.md`](../skill-pipeline/README.md). UI-stage → skill mappings below assume a `pdlc-ui` runtime that is no longer being built. Agent roster for the current cycle: **Felix** (upstream intel), **Moneypenny** (per-initiative debrief), **`/design-prompt-custom`** (NEW — S3), **M + Q** (critique), **Bond `/bond-prd-custom`** (NEW — PRD author, S5). Gatekeeper is deleted. See live plan for the workflow.

**Purpose:** Tie each **Steerco UI stage** to a **canonical Dex skill** (or agreed artefact) so we do **not** maintain a parallel "prompt library." Optional **agent config** lets WT tune behaviour **without** forking skill source.

**Lifecycle reference:** [lifecycle-transitions.md](./lifecycle-transitions.md) — includes **`spec_ready`**, **backward moves**, **`parked`**, **strategy thread**, and **[§ Skill triggers on column moves](./lifecycle-transitions.md#skill-triggers-on-column-moves-pdlc-ui)** (compact transition → skill table).

**Card-state contract:** [schema-initiative-v0.md](./schema-initiative-v0.md) — typed I/O shape every PDLC skill reads and writes. Skills **conform to the card** (not the other way around) so Phase-2 hosted agents and the UI share one source of truth.

---

## Update discipline — how these skills survive `/dex-update`

Dex updates (see [`/dex-update`](../../.claude/skills/dex-update/SKILL.md)) preserve the following by default:

| Pattern | Behaviour on update |
|---------|---------------------|
| Skill folders ending **`-custom`** | **Never touched** — preserved verbatim. |
| MCP entries named **`custom-*`** in `.mcp.json` | **Preserved by name.** |
| **`USER_EXTENSIONS_START` … `USER_EXTENSIONS_END`** block in `CLAUDE.md` | **Preserved verbatim.** |
| User data folders `00-` … `07-`, `System/user-profile.yaml`, `System/pillars.yaml` | **User version kept.** |
| Anything in **`plans/`** | Not shipped by dex-core — **user territory**, no conflict possible. |
| Core skills (e.g. `.claude/skills/product-brief/`, `.claude/skills/feature-decision/`) if edited in place | **Conflict prompt** on update — user must choose keep-mine / use-Dex / keep-both. |

**Implication for this plan:** PDLC-specific skill variants live under **`-custom`** suffixed folders. The canonical `/product-brief` and `/feature-decision` stay untouched and continue to serve non-PDLC chat use. See the **Custom skills** table below.

**Governance:** custom skills are versioned alongside this plan (same repo, same PR discipline as `plans/PDLC_UI/*`). If a canonical skill evolves in a way that makes a custom variant redundant, the custom one is **retired** (folder deleted, map updated) rather than auto-merged.

---

## Engineering / merge gate (`pdlc-ui` repo) — **parked with `pdlc-ui` (2026-04-24)**

Steerco-facing stages above are **product** skills. When **`pdlc-ui/`** implementation resumes, PRs still need **R16 discipline** — but the dedicated Dex skill **`/gatekeeper-custom`** was **removed from the vault on 2026-04-24** (dead weight while `pdlc-ui` is parked). Use this split instead:

| Concern | Approach | What it does |
|---------|----------|---------------|
| **Green CI + R16 audit + review triage + post-merge Slice log** | Cursor **`babysit`** (`.cursor/skills-cursor/babysit/SKILL.md`) **+** manual checklist in frozen [engineering-guardrails.md](./engineering-guardrails.md) | Same outcomes Gatekeeper automated: watch `gh pr checks`, minimal CI fix commits, same-PR schema ↔ migrations ↔ docs, triage review comments, Slice log close-out. **Requires** `gh auth login` once. |
| **Recover the last committed PR-gate SKILL** | `git` history | On this branch the PR gate last lived at **`moneypenny-custom/SKILL.md`** before Phase 0: `git show freeze/skills-pipeline-pivot^:.claude/skills/moneypenny-custom/SKILL.md`. The `gatekeeper-custom/` folder was local-only and is deleted. |

**Invocation today:** **`babysit`** on the PR; cross-check **R16** rows in [engineering-guardrails.md](./engineering-guardrails.md) by hand.

> **Live workflow:** [plans/skill-pipeline/README.md](../skill-pipeline/README.md) — chat+vault skills are the product surface until a UI revives.

**Process tie-in:** [sprint-backlog.md](./sprint-backlog.md) **Engineering guardrails** + **Ceremony**; [plan.md § Engineering governance](./plan.md#engineering-governance-cto--tech-lead--anti-drift) item **9**.

---

## Design system: **Figma (manual) → Claude Design (web)**

- **Figma** is the **source of truth** for tokens, themes, and components.
- **Claude Design** (claude.ai design surface) is where Steerco **grounds** prototypes on that DS. **Sync / refresh between Figma and Claude Design is manual** — no Figma MCP in this plan.
- **Orchestration export** (downloadable `.md` for upload into Claude Design) must include a **Design system instructions** section that tells the user to **rely on the DS already configured in Claude Design** (and the linked Figma library for reference), not to invent ad hoc styles.

---

## Design pipeline: **Claude Design → then `/anthropic-frontend-design`**

| Step | Surface | Mandatory? | Output |
|------|---------|------------|--------|
| **Lo-fi** | **Claude Design (web)** | **Yes** after discovery | Wireframe / interactive prototype / HTML export; links stored on card |
| **Hi-fi** | **Claude Design (web)** | Only if **`hiFiRequired`** | Deeper prototype; same DS grounding |
| **Implementation polish** | **Cursor — [`/anthropic-frontend-design`](../../.claude/skills/anthropic-frontend-design/SKILL.md)** | **Yes before design review completes** (or immediately after hi-fi if team prefers) | Production-shaped UI in repo: **must consume** Claude Design outputs (handoff bundle, `PROMPT.md`, HTML export, or pasted layout spec) so the skill **extends** the Design session instead of replacing it |

**Export pack closing block (required text pattern):** end the orchestration-generated `.md` with something like:

> **Implementation polish (Cursor):** Paste the Claude Design handoff materials below into a Cursor session, then run **`/anthropic-frontend-design`** with this feature's constraints so UI code matches the approved prototype.

**Card fields (illustrative):** `figmaLibraryUrl`, `claudeDesignSessionUrl?`, `loFiArtifactUrl`, `hiFiRequired`, `hiFiArtifactUrl?`, `claudeDesignHandoffPath?`, `frontendPolishBranchOrPath?`, `parkedIntent?`, `strategyPillarIds[]`, `strategyWarning?`. **Canonical shape:** [schema-initiative-v0.md §4.4](./schema-initiative-v0.md#44-design).

---

## Stage → skill (v1 target — updated 2026-04-21)

| UI lane / step | Canonical Dex skill | **PDLC custom variant** (update-safe) | What the UI does | Card-state writes |
|----------------|---------------------|----------------------------------------|-------------------|--------------------|
| **`idea` (optional gate)** | [`feature-decision`](../../.claude/skills/feature-decision/SKILL.md) (heavy) | **[`pdlc-idea-gate-custom`](../../.claude/skills/pdlc-idea-gate-custom/SKILL.md)** (5-Q lite) | MVP-optional nudge: 5 questions → `gate.recommendation`. On `no_go`, prefill `parkedReason`. | `gate.*` |
| **`idea` → `discovery`** | [`product-brief`](../../.claude/skills/product-brief/SKILL.md) (heavy, generates full PRD) | **[`pdlc-brief-custom`](../../.claude/skills/pdlc-brief-custom/SKILL.md)** (shrunken; pre-fills from context; stops at brief) | Stepwise popup; Phase 0 pulls context from meetings / signals / customer-intel; writes typed brief. **Does not generate a PRD.** | `brief.*`, `discovery.openQuestions[]` (drafts) |
| **`discovery` (kickoff + weekly sweep + manual re-run)** | — | **[`moneypenny-custom`](../../.claude/skills/moneypenny-custom/SKILL.md)** (Moneypenny — per-initiative intelligence debriefer; *formerly `/pdlc-discovery-research-custom`, "Bond / 007"* pre-2026-04-24 rename) | Six-phase research pass: competitor filter + customer evidence + market-signal alignment + ICP strategic-fit + solution-patterns + draft open questions. Headless via S3A.3 `DiscoveryResearchProvider`; interactive "deepen" via chat. Composes Felix's weekly artefacts + `System/icp.md` + meetings + industry PDFs. | `discovery.researchNotes`, `discovery.competitorSnapshot`, `discovery.customerEvidence[]`, `discovery.solutionPatterns[]`, `discovery.openQuestions[]`, `discovery.research.summary`, `discovery.iteration`, `discovery.lastRerunAt` |
| **`discovery` (Monday column-wide pass)** | — | **[`weekly-discovery-sweep-custom`](../../.claude/skills/weekly-discovery-sweep-custom/SKILL.md)** | Monday wrapper that iterates every card in `lifecycle === "discovery"` and invokes **Moneypenny** (`/moneypenny-custom`) headless per card. Consumes Felix's Friday Signal. One Slice-log roll-up line per week. | Invokes Moneypenny per card. Writes Slice log to `04-Projects/PDLC_Orchestration_UI.md`. |
| **`discovery` → `design`** | (no skill — template only) | *gap: `pdlc-export-pack-custom` — filler for [export-pack-template.md](./export-pack-template.md)* | Human fills template today; future skill emits the `.md` from card state. Design-brief packaging **deferred** (revisit after 2 cards clear `discovery → design`). | — |
| **`design`** | **Claude Design (web)** + [`anthropic-frontend-design`](../../.claude/skills/anthropic-frontend-design/SKILL.md) | — | Attach Design outputs; Cursor polish; **design review** before **`spec_ready`**. | `design.*` |
| **Design review** (Stage 6) | `_available/design/design-review` *(not installed)* | *gap: install + wrap as `pdlc-design-review-custom`* | Waiver reason + timestamp captured against card. | `design.review.*` |
| **`spec_ready`** | [`agent-prd`](../../.claude/skills/agent-prd/SKILL.md) *(in personal-Dex mode **superseded by `/bond-prd-custom`** — TBD; map-only this pass)* | — *(canonical skill consumed directly; see schema §4.5 contract for ingest. When `/bond-prd-custom` ships it takes over the `spec_ready` write contract with identical field-level shape.)* | **Starts when card enters column.** **MVP:** export + pre-filled Cursor. **Clarifications** emitted as `spec.clarifications[]` / `discovery.openQuestions[]` rather than chat turns (skill refactor — plan R8 later path). **BDD** optional (Step 3b). | `spec.*`, `linkedPrdPath` |
| **`spec_ready` → `develop`** | — | *gap: `pdlc-handoff-bundle-custom`* | Assembles PRD MD + design links + constraints + test seeds into one artefact for Cursor Plan mode. Today this is prose in [export-pack-template.md](./export-pack-template.md) R6b. | `spec.handoffBundlePath` |
| **`develop`** | — | *gap: `pdlc-release-notes-custom`* | Drafts user-facing **non-technical** release notes (plan R14). | `release.userFacingNotes` |
| **`uat`** | — | *gap: acceptance / test-report synthesis (later)* | Captures UAT feedback to card. | `release.*` |
| **`deployed`** | `_available/operations/metrics-review` *(not installed)* | *gap: `pdlc-metrics-check-custom`* | Reads `/agent-prd` frontmatter `target_metrics`; queries analytics tool; writes back. | `release.metricsCheck.*` |
| **`parked`** | — | (handled inline by `pdlc-idea-gate-custom` on `no_go`) | Set `parkedIntent` (`revisit` \| `wont_consider`) + `parkedReason`. | `parkedIntent`, `parkedReason` |
| **Backward moves** | Lifecycle rules | *gap: `pdlc-rewind-impact-custom` (later)* | On `spec_ready → discovery/design`, surfaces which PRDs/tasks/design artefacts are now stale. | `events[]` |
| **Strategy (post-MVP R12)** | [`industry-truths`](../../.claude/skills/industry-truths/SKILL.md) | *gap: `pdlc-strategy-conformance-custom` (post-MVP)* | Compares card vs `company_strategy.md`; emits `strategyWarning`. | `strategyPillarIds[]`, `strategyWarning` |
| **Cross-cutting: Steerco weekly** | [`anthropic-internal-comms`](../../.claude/skills/anthropic-internal-comms/SKILL.md) (generic) | *gap: `pdlc-steerco-update-custom`* | "What changed across cards this week" — reads `events[]` across initiatives. | — |
| **Markdown preview** | — (rendering) | — | In-app preview of brief / PRD markdown derived from card state. | — |

**Legend:** *gap* = identified but not yet built. Sequencing in [plan.md § CPO recommendations](./plan.md) (Bar A / Bar B / Phase 2 / Phase 3+).

---

## Custom skills (update-safe)

| Skill | Folder | Role | Replaces | Why custom vs edit canonical |
|-------|--------|------|----------|-------------------------------|
| **`/pdlc-idea-gate-custom`** | [.claude/skills/pdlc-idea-gate-custom/](../../.claude/skills/pdlc-idea-gate-custom/) | 5-Q idea-column gate; writes `gate.*` | New behaviour (no canonical equivalent at idea stage) | `/feature-decision` is too heavy for idea capture; a custom lite variant keeps canonical intact for decision-doc use. |
| **`/pdlc-brief-custom`** | [.claude/skills/pdlc-brief-custom/](../../.claude/skills/pdlc-brief-custom/) | Shrunken brief with context pre-fill; writes `brief.*`, `discovery.openQuestions[]` drafts | `/product-brief` Phases 1–4 (stops before PRD generation) | `/product-brief` is used in non-PDLC chats and generates full PRDs; editing it in place would break non-PDLC flows **and** conflict on `/dex-update`. |
| **`/moneypenny-custom`** (Moneypenny — per-initiative intelligence debriefer; *formerly `/pdlc-discovery-research-custom`, "Bond / 007"* pre-2026-04-24 rename) | [.claude/skills/moneypenny-custom/](../../.claude/skills/moneypenny-custom/) | Per-initiative discovery agent; writes `discovery.*` via S3A.3 `DiscoveryResearchProvider`. Two modes — headless (kickoff + weekly sweep + manual re-run) + interactive "deepen" chat session. Consumes Felix's weekly artefacts + `System/icp.md` + meetings + industry PDFs. See [`plans/Research/moneypenny-strategy.md`](./../Research/moneypenny-strategy.md) *(formerly `bond-strategy.md`)*. | New behaviour (S3B seed reserved the slot; deep-dive closed 2026-04-22; persona re-mapped 2026-04-24) | No canonical equivalent. Composes `/customer-intel` + `/intelligence-scanning` + `/meeting-prep` + Felix at the per-card level — none of those own the PDLC card-state contract. |
| **`/weekly-discovery-sweep-custom`** | [.claude/skills/weekly-discovery-sweep-custom/](../../.claude/skills/weekly-discovery-sweep-custom/) | Monday wrapper — iterates every `discovery`-column card and invokes **Moneypenny** (`/moneypenny-custom`) headless per card. Writes Slice log roll-up to `04-Projects/PDLC_Orchestration_UI.md`. Budget: $5/sweep across all cards. | New behaviour | Sweep semantics (preserve user-reviewed fields, flag contradictions, respect cost ceiling) are Moneypenny-specific — generic cadence skills don't carry this contract. |
| **~~`/gatekeeper-custom`~~** *(removed 2026-04-24)* | *(folder deleted)* | **Was:** Engineering / merge gate for `pdlc-ui/` PRs (R16 audit, CI loop, triage, close-out). **Now:** Cursor **`babysit`** + frozen [engineering-guardrails.md](./engineering-guardrails.md). **Recover SKILL:** `git show freeze/skills-pipeline-pivot^:.claude/skills/moneypenny-custom/SKILL.md` *(last committed PR gate; `gatekeeper-custom/` was never in git on this branch).* | Retired with `pdlc-ui` park | PR discipline uses generic tooling until UI work resumes; see [skill pipeline](../skill-pipeline/README.md). |

**Future custom skills (planned, not built):**

- **`/bond-prd-custom`** — **Bond (PRD author)** — personal-Dex successor to `/agent-prd`. Consumes Moneypenny's `discovery.*` debrief package + `brief.*` + `gate.*` and writes `spec.*`, `linkedPrdPath`, and the `spec.clarifications[]` async loop. **Map-only this pass** (2026-04-24) — SKILL.md authored in a later pass. Downstream critique handoff: `/agent-q-cto-custom` (Q) + `/agent-m-cpo-custom` (M). Field-level contract identical to `/agent-prd`; `/agent-prd` remains the compatibility shim until `/bond-prd-custom` ships.
- `/pdlc-design-review-custom` — wraps `_available/design/design-review` for Stage 6.
- `/pdlc-handoff-bundle-custom` — `spec_ready → develop` bundle assembler.
- `/pdlc-release-notes-custom` — R14 user-facing notes at `develop`.
- `/pdlc-metrics-check-custom` — post-launch `target_metrics` reader.
- `/pdlc-export-pack-custom` — fills [export-pack-template.md](./export-pack-template.md) from card state.
- `/pdlc-design-brief-custom` — **deferred.** Packages `discovery.*` into a designer-ready brief at `discovery → design`. Decision point after 2 cards have cleared that lane move (see [`plans/Research/moneypenny-strategy.md` § "Downstream — Moneypenny → design"](../Research/moneypenny-strategy.md#downstream--bond--design-deferred)).
- `/pdlc-strategy-conformance-custom` — post-MVP R12.
- `/pdlc-steerco-update-custom` — weekly board digest.
- `/pdlc-rewind-impact-custom` — backward-move staleness analyser.

---

## "Change the agents" (future configuration)

| Mechanism | Description |
|-----------|-------------|
| **Canonical** | `.claude/skills/<name>/SKILL.md` — versioned with Dex; consumed by PDLC custom variants, not duplicated inside `pdlc-ui`. |
| **PDLC custom variants** | `.claude/skills/<name>-custom/SKILL.md` — **protected from `/dex-update`**, versioned in this repo, own the PDLC-specific contract against the card schema. |
| **Overrides (proposed, later slice)** | `pdlc-ui/agent-config/<stage>.yaml` — e.g. tweak required questions, intro copy, template URLs **without** forking a skill. |
| **Governance** | Canonical changes follow dex-core cadence; custom variants and overrides go via the same PR discipline as the rest of `plans/PDLC_UI/`. |

**v1:** read-only "**View skill summary**" in UI + link to this map and the skill files; **v2:** edit overrides in UI with audit log; **v3 (Phase 2):** hosted runner consumes the same skill + override + card-state stack headlessly.

---

## Open

- [ ] **Headless Claude Design:** WT worker vs **queue + notify** human (ICT).
- [ ] **Canonical `/product-brief` evolution:** track upstream changes; if Dex releases an `agent_draft`-aware version, retire `pdlc-brief-custom` (or narrow it to the PDLC-specific Phase 0 pre-fill hook only).
- [ ] **Canonical `/agent-prd` async clarifications:** monitor upstream — today the card-state contract expects clarifications as `spec.clarifications[]`; if upstream stays wizard-only, a `pdlc-prd-async-custom` wrapper may be needed.
- [x] **Export template:** [export-pack-template.md](./export-pack-template.md) — fill per initiative; UI can generate from the same sections (eventually via `pdlc-export-pack-custom`).
- [x] **Schema v0.1:** [schema-initiative-v0.md](./schema-initiative-v0.md) drafted; aligned with plan.md Phase A field list.

---

*Updated 2026-04-21 — added **schema-v0.1** contract; added **`pdlc-idea-gate-custom`** and **`pdlc-brief-custom`** update-safe variants; documented **update-discipline** so PDLC-specific behaviour survives `/dex-update`. Previous update 2026-04-23 — **`spec_ready`** column; rewind + **parked** + strategy in [lifecycle-transitions.md](./lifecycle-transitions.md).*

*Updated 2026-04-21 — **MoneyPenny** (`/moneypenny-custom`): originally scoped as engineering / merge gate for **`pdlc-ui/`** PRs. **Renamed 2026-04-24 → `/gatekeeper-custom`**, then **deleted 2026-04-24** when `pdlc-ui` was parked — use **`babysit`** + frozen guardrails instead.*

*Updated 2026-04-22 — **Bond / 007** (`/pdlc-discovery-research-custom`) + **`/weekly-discovery-sweep-custom`**: per-initiative discovery research agent with headless + interactive modes. Closes the S3B slot; see [`plans/Research/bond-strategy.md`](../Research/bond-strategy.md) for the operating doc and [`seeds/s3b-discovery-research.md`](./seeds/s3b-discovery-research.md) for the closed deep-dive. **Persona re-mapped 2026-04-24** (see note below).*

*Updated 2026-04-24 — **007 persona re-map** (personal-Dex workflow):*

- *`/moneypenny-custom` (the old PR-gate skill) → **`/gatekeeper-custom`** → **removed 2026-04-24** from the vault when `pdlc-ui` was parked. Recover from git history if needed.*
- *`/pdlc-discovery-research-custom` (the old "Bond / 007" discovery agent) → **`/moneypenny-custom`**. Moneypenny is the per-initiative intelligence debriefer; she compiles the mission folder before Bond walks into M's office. Persona shift only — mode A / mode B / cost ceilings / cadence / schema contract unchanged.*
- *"Bond" codename migrated to **`/bond-prd-custom`** (TBD, map-only this pass) — the PRD author. Supersedes `/agent-prd` in personal-Dex mode; SKILL.md authored in a later pass. Downstream critique handoff stays `/agent-q-cto-custom` (Q) + `/agent-m-cpo-custom` (M).*
- *Operating doc renamed: `plans/Research/bond-strategy.md` → [`plans/Research/moneypenny-strategy.md`](../Research/moneypenny-strategy.md). Schema registry in [`schema-initiative-v0.md §6`](./schema-initiative-v0.md#6-skill_run-known-ids-registry) retired `pdlc-discovery-research-custom`, added `moneypenny-custom`, reserved `bond-prd-custom`.*

# PDLC UI — skills & agent behaviour map

**Purpose:** Tie each **Steerco UI stage** to a **canonical Dex skill** (or agreed artefact) so we do **not** maintain a parallel “prompt library.” Optional **agent config** lets WT tune behaviour **without** forking skill source.

**Lifecycle reference:** [lifecycle-transitions.md](./lifecycle-transitions.md) — includes **`spec_ready`**, **backward moves**, **`parked`**, **strategy thread**.

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

> **Implementation polish (Cursor):** Paste the Claude Design handoff materials below into a Cursor session, then run **`/anthropic-frontend-design`** with this feature’s constraints so UI code matches the approved prototype.

**Card fields (illustrative):** `figmaLibraryUrl`, `claudeDesignSessionUrl?`, `loFiArtifactUrl`, `hiFiRequired`, `hiFiArtifactUrl?`, `claudeDesignHandoffPath?`, `frontendPolishBranchOrPath?`, `parkedIntent?`, `strategyPillarIds[]`, `strategyWarning?`.

---

## Stage → skill (v1 target)

| UI lane / step | Canonical skill / surface | What the UI does |
|----------------|---------------------------|-------------------|
| **`idea` → `discovery`** | [`product-brief`](../../.claude/skills/product-brief/SKILL.md) | On column move, open **stepwise popup** (help text); persist answers; then discovery work continues in **`discovery`**. |
| **`discovery`** | Discovery artefacts + export | Open questions; **re-run discovery**; **export pack** for Claude Design. |
| **`design`** | **Claude Design (web)** + [`anthropic-frontend-design`](../../.claude/skills/anthropic-frontend-design/SKILL.md) | Attach Design outputs; Cursor polish; **design review** before **`spec_ready`**. |
| **`spec_ready`** | [`agent-prd`](../../.claude/skills/agent-prd/SKILL.md) | **Starts when card enters column.** **MVP:** export + pre-filled Cursor; **clarifications** in wizard; **BDD** optional (Step 3b). **`spec_ready` → `develop`** when spec complete. |
| **`develop` → …** | Handoff | **PRD `.md` + design** for **Cursor Plan mode**. |
| **`parked`** | N/A | Set **`parked_intent`**: `revisit` \| `wont_consider`. |
| **Strategy** | Pillars / future strategy doc | Multi-select **`System/pillars.yaml`** ids; **warn** on non-conformance. |
| **Markdown / spec preview** | N/A (rendering) | In-app preview of PRD / brief markdown. |

---

## “Change the agents” (future configuration)

| Mechanism | Description |
|-----------|-------------|
| **Canonical** | `.claude/skills/<name>/SKILL.md` — versioned with Dex; **do not duplicate** full skill body in the UI repo long-term. |
| **Overrides (proposed)** | `pdlc-ui/agent-config/<stage>.yaml` — e.g. extra intro line, which questions are required, **template URL** for DS instruction paragraph. |
| **Governance** | Overrides through **same git PR** as other WT config. |

**v1:** read-only “**View skill summary**” + link to internal handbook; **v2:** edit overrides in UI with audit log.

---

## Open

- [ ] **Headless Claude Design:** WT worker vs **queue + notify** human (ICT).  
- [x] **Export template:** [export-pack-template.md](./export-pack-template.md) — fill per initiative; UI can generate from the same sections.

---

*Updated 2026-04-23 — **`spec_ready`** column; **`/agent-prd`** in **`spec_ready`**; rewind + **parked** + strategy in [lifecycle-transitions.md](./lifecycle-transitions.md).*

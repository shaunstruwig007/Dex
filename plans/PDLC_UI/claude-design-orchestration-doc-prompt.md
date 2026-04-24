# Prompt pack — document “Claude Code as orchestrator” for Claude Design

**Purpose:** Give **Claude Design** (claude.ai design surface) everything it needs to produce a **clear, designer-friendly** one-pager or short deck: who does what, in what order, when the human drives everything from **chat in Claude Code** (or Cursor) instead of the Steerco PDLC UI.

**How to use**

1. Open **Claude Design** with your **Figma / design system** already configured (per [skill-agent-map.md § Design system](./skill-agent-map.md)).
2. Copy everything inside the **`---BEGIN CLAUDE DESIGN PROMPT---`** … **`---END---`** block below and paste it into a **new Design session** as your first message.
3. Optional: attach or paste a link to this repo’s **`plans/PDLC_UI/skill-agent-map.md`** and **`plans/Research/moneypenny-strategy.md`** *(formerly `bond-strategy.md`)* if the session should stay aligned with Dex naming.

> **Persona re-map (2026-04-24):** this prompt now reflects the post-rename 007 roster — **Moneypenny** is the per-initiative intelligence debriefer (the role previously called "Bond" / `/pdlc-discovery-research-custom`); **Bond** is now the PRD author (`/bond-prd-custom`, TBD — supersedes `/agent-prd` in personal-Dex mode); **Gatekeeper** is the parked CI/PR gate (formerly `/moneypenny-custom`). If you see "Bond = discovery" in older chats or artefacts, that's pre-rename.

---

## Design system instructions (for the generated artefact)

- Use the **design system already set up in Claude Design** (tokens, type, spacing). Do not invent a new visual language.
- Optimise for **readability at a glance**: one primary **flow diagram** (left-to-right or top-down), plus **one table** (intent → skill → output).
- Audience: **you (PM)** and a **product designer** who will **not** use `pdlc-ui` or Gatekeeper; they only need to know **what to ask for in chat** and **what artefacts land in Dex**.

---

## ---BEGIN CLAUDE DESIGN PROMPT---

You are producing **orchestration documentation** for a personal / small-team product workflow. The product is documented in a **Dex** vault (markdown + skills). **Claude Code** (or Cursor with Claude) is the **orchestrator**: the human types natural language; the coding agent **loads the right skill** (a `SKILL.md` playbook) and writes outputs to agreed paths in the vault.

### Context (ground truth — use verbatim concepts, do not invent products)

- **Dex** = single source of truth: PRDs, market intel, ICP, meetings, competitor profiles, plans.
- **Skills** live under `.claude/skills/` with slash commands like `/felix-custom`, `/moneypenny-custom`, `/agent-prd`.
- **007-style personas** (names for docs only; skills are the real contracts). *Re-mapped 2026-04-24 — the historical "Bond = discovery" naming is deprecated:*
  - **Felix** (`/felix-custom`) — outside-in weekly research: market synthesis, competitors, industry pulse. Does **not** write per-initiative `discovery.*` on PDLC cards.
  - **Moneypenny** (`/moneypenny-custom`) — per-initiative **intelligence debriefer**: brief + ICP + Felix artefacts + meetings → research package (notes, evidence, solution patterns, open questions). *(Previously called "Bond" / `/pdlc-discovery-research-custom` before 2026-04-24 — same behaviour, new persona label: she compiles the mission folder before Bond walks in.)*
  - **Bond** (`/bond-prd-custom`, **TBD — map-only**) — **PRD author**: consumes Moneypenny's debrief package + brief + gate → writes the PRD and runs the async clarifications loop. **Supersedes `/agent-prd`** in personal-Dex mode; `/agent-prd` remains the compatibility shim until `/bond-prd-custom` ships. Until then, paint Bond on the flow but label the current skill slug `/agent-prd` with a "→ `/bond-prd-custom` (TBD)" annotation.
  - **Q** (`/agent-q-cto-custom`) — CTO-style feasibility / risk pass on Bond's draft spec.
  - **M** (`/agent-m-cpo-custom`) — CPO-style product / outcome / UX-risk pass on Bond's draft spec.
  - **~~Gatekeeper~~** (`/gatekeeper-custom`) — **removed 2026-04-24** from the vault; was the merge/CI gate for `pdlc-ui` PRs. Mention only as historical footnote — future UI PRs use Cursor **`babysit`** + frozen R16 guardrails. *(Formerly `/moneypenny-custom` before the 2026-04-24 rename — persona handed off to the intel role above.)*
- **Steerco PDLC UI** (`pdlc-ui`) may **never** ship for this user; treat the workflow as **100% chat-initiated** with artefacts in markdown files.

### What to design (deliverable)

Produce **one cohesive artefact** (single canvas or multi-section doc) with:

1. **Title + one-sentence thesis**  
   Example thesis: *“Dex holds the truth; Claude Code runs the agents by loading skills; no board UI required.”*

2. **Primary visual — end-to-end flow**  
   A **single flow diagram** showing this **happy path** (use clear swimlanes or numbered nodes):
   - Human: *“New idea: …”* → skill **`/pdlc-brief-custom`** (or `/product-brief` if heavier) → **brief** captured in Dex (why / who / what).
   - Human: *“Moneypenny — debrief this idea.”* → **`/moneypenny-custom`** → consumes **Felix output** + **`System/icp.md`** + meetings → **discovery** artefact (structured sections: competitor snapshot, customer evidence, solution patterns, open questions, short summary). **This is the mission folder that Bond will read.**
   - Human: *“Felix — weekly intel”* (cadence) → **`/felix-custom`** → updates **`Market_intelligence/`**, competitor profiles, signals — **upstream** of Moneypenny.
   - Human: *“Bond — turn this into a PRD.”* → **`/bond-prd-custom`** *(TBD — today use `/agent-prd` as the compatibility shim)* → consumes Moneypenny's debrief + brief + gate → PRD markdown in Dex + `spec.clarifications[]` async loop.
   - Human: *“Q — feasibility pass on Bond's PRD”* → **`/agent-q-cto-custom`** → critique doc or inline amendments on the PRD.
   - Human: *“M — product pass on Bond's PRD”* → **`/agent-m-cpo-custom`** → critique doc.
   - Human (optional Monday): *“Weekly discovery sweep”* → **`/weekly-discovery-sweep-custom`** → iterates **all** active discovery cards and runs Moneypenny headless per card (only if they maintain multiple initiatives in Dex).

3. **Secondary visual or table — “Chat phrase → Skill → Output path”**  
   At least **8 rows** covering: Felix, Felix client signals (first-party, internal-only framing), Moneypenny (discovery debrief), brief, idea gate, Bond (PRD author — `/bond-prd-custom` TBD / `/agent-prd` today), Q, M, weekly sweep. Columns: **Example user phrase** | **Skill (slash command)** | **Primary outputs in Dex**. Where a skill is TBD, show both the target slug and the current shim in the Skill column (e.g. `/bond-prd-custom` *(TBD — `/agent-prd` today)*).

4. **Designer handoff box** (callout)  
   Explain what a **designer** needs from this flow **without** reading the whole vault:
   - From **Moneypenny's debrief**: problem restatement, target users, **top customer quotes** (with paths), **constraints / open questions for design**, link to competitor snapshot **as reference** (not prescriptive UI).
   - Explicit **non-goals**: designer is not asked to implement Moneypenny's draft UI or Bond's PRD-shaped spec; they receive **problem + evidence + questions** and respond with wireframes / prototypes.

5. **Footnote — two modes**  
   Short contrast: **Steerco mode** (future: PDLC UI + **`babysit`** + frozen R16 checklist for PR merges) vs **Personal Dex mode** (chat + skills only; **`/gatekeeper-custom` removed 2026-04-24**). One short paragraph each. Call out that the 007 persona labels were re-mapped on 2026-04-24 so older transcripts using "Bond = discovery" are pre-rename.

### Tone and constraints

- **Plain language**, no jargon wall. Define “skill” once in one line.
- **No fake company metrics.** No invented headcount or revenue.
- **Accessibility:** sufficient contrast; don’t rely on colour alone for flow direction.

### If you need a mermaid diagram in an appendix

Include a **text appendix** (copy-paste friendly) with one **mermaid** `flowchart` mirroring the primary visual, so the user can paste it into Notion or GitHub later.

---

**Now produce the artefact.**

---END CLAUDE DESIGN PROMPT---

---

## Shorter “one-shot” variant (if Claude Design hits a length limit)

Paste this alone:

> Design a **one-page orchestration guide** for a PM using **Claude Code** + a markdown vault (**Dex**). Show a **single flowchart**: new idea → `/pdlc-brief-custom` → **`/moneypenny-custom`** (Moneypenny — discovery debrief, fed by `/felix-custom` + `System/icp.md`) → **`/bond-prd-custom`** *(TBD — `/agent-prd` today)* writes the PRD → `/agent-q-cto-custom` (Q) + `/agent-m-cpo-custom` (M) critique. Add a **table**: example chat phrase → slash skill → output folder. Add a **designer callout**: what to hand off from Moneypenny's debrief (problem, users, quotes, open questions) vs what not to prescribe. Note **`/gatekeeper-custom`** was **removed 2026-04-24** — future `pdlc-ui` PRs use **`babysit`** + frozen R16 docs, not a Dex skill. Use my configured **design system**; one mermaid appendix. Persona labels re-mapped 2026-04-24 — older "Bond = discovery" chats are pre-rename.

---

## Repo pointers (for you, not necessarily pasted into Design)

| Topic | Path |
|--------|------|
| Stage ↔ skill map | [`plans/PDLC_UI/skill-agent-map.md`](./skill-agent-map.md) |
| Moneypenny operating strategy *(formerly `bond-strategy.md`)* | [`plans/Research/moneypenny-strategy.md`](../Research/moneypenny-strategy.md) |
| Moneypenny skill *(formerly `/pdlc-discovery-research-custom`)* | [`.claude/skills/moneypenny-custom/SKILL.md`](../../.claude/skills/moneypenny-custom/SKILL.md) |
| Bond PRD skill (TBD — map-only; supersedes `/agent-prd`) | `/bond-prd-custom` *(SKILL.md not yet authored)* |
| ~~Gatekeeper skill~~ *(removed 2026-04-24 — recover from git history)* | `git show freeze/skills-pipeline-pivot^:.claude/skills/moneypenny-custom/SKILL.md` *(last committed PR gate, pre-remap path)* |
| Felix skill | [`.claude/skills/felix-custom/SKILL.md`](../../.claude/skills/felix-custom/SKILL.md) |
| Weekly sweep | [`.claude/skills/weekly-discovery-sweep-custom/SKILL.md`](../../.claude/skills/weekly-discovery-sweep-custom/SKILL.md) |

---

*Added for Shaun — Claude Design–ready orchestration prompt. Aligns with [skill-agent-map.md § Design system: Figma → Claude Design](./skill-agent-map.md).*

*Updated 2026-04-24 — **007 persona re-map** in personal-Dex workflow: `/pdlc-discovery-research-custom` (Bond / discovery) → **`/moneypenny-custom`** (Moneypenny / intel debrief); "Bond" codename migrated to **`/bond-prd-custom`** (TBD — PRD author, supersedes `/agent-prd`); `/moneypenny-custom` (CI/PR gate) → **`/gatekeeper-custom`** → **removed from vault 2026-04-24** (`pdlc-ui` parked). See [`plans/Research/moneypenny-strategy.md`](../Research/moneypenny-strategy.md).*

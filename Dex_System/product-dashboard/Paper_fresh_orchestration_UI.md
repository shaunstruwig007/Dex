# Paper — fresh orchestration UI (artboard order)

Use **Paper Desktop** with a file open and the Cursor Paper plugin / MCP connected. Work through artboards **in the order below** (one prompt per session or per artboard).

To **reflect these designs in the vault UI**, use the Paper plugin’s **design-to-code** skill and MCP **`plugin-paper-desktop-paper`** — see **`README.md`** (Paper → code). Do not change **information requirements** in implementation: four-tab ticket, lane gating, vault paths — **ORCHESTRATION.md** and **`CONCEPTS.md`**.

**Documentation editing (vault markdown):** Any **long-form** editing in the ticket (especially **Discovery** workspace notes and **Requirements** PRD body) must support **structure and emphasis** that **round-trips as Markdown** — the interchange format stored on disk (`.md`). Minimum authoring affordances to design for (toolbar and/or WYSIWYG):

| Need | Markdown fallback (authoring must preserve) |
|------|---------------------------------------------|
| Section title | Headings (`##`, `###`, …) |
| Body copy | Normal paragraphs |
| Lists | Bullet (`-`) / numbered lists |
| Emphasis | **Bold** (`**…**`), *italic* (`*…*`) |

Prefer **bold** and *italic* as the primary emphasis pair: familiar, unambiguous in Markdown, and easy to explain. Richer formatting can come later; this set is the baseline **documentation** requirement for the orchestration UI.

*Rationale (documentation):* Vault files are **Markdown**; Cursor and Dex already think in headings and emphasis. A small, explicit formatting set keeps **WYSIWYG** or toolbar actions predictable and avoids proprietary rich text that does not survive export.

**Requirements tab:** The **Requirements** surface is the **agent-oriented PRD** — content authored with the Dex **`/agent-prd`** skill, stored under **`06-Resources/PRDs/`** (see **ORCHESTRATION.md**). Paper and product UI should treat it as a **first-class screen** (not an afterthought): readable sections, trace IDs / work packages as the PRD template defines, same Markdown editing rules as above.

**Cursor MCP name:** agents must use the server id **`plugin-paper-desktop-paper`** (not `paper`) when calling Paper tools programmatically.

**Product Orch document scope (this file):** **Five** artboards — **01** → **05** below. **Landing / home for the product** is **Orchestration** (the board). **Executive portfolio** and **Roadmap** are **not** part of this sequence: each will get its **own** Paper file and full-page design later.

**Palette / type (reference):** Light neutral, **Inter** + **Newsreader**, teal accent `#0f766e`.

**Design intent:** Fresh internal orchestration UI—not a visual clone of the static `index.html` dashboard. Calm, restrained, one accent, high legibility.

---

## Order (do not skip) — Product Orch only

| Step | Artboard | Purpose |
|------|----------|---------|
| **1** | Orchestration board | Kanban / swimlanes + **create idea** entry point |
| **2** | Initiative detail — **Idea** | Tab gating (Brief only) |
| **3** | Initiative detail — **Discovery** | Agent state + **re-run discovery** if brief changes |
| **4** | Initiative detail — **Design / Spec+** | All tabs on; **Requirements** = **`/agent-prd`** PRD screen; **Design** = artifact row |
| **5** | New initiative modal | Brief intake — **same flow as “Create idea” on 01** |

**Out of scope here (separate designs / pages):**

- **Executive portfolio** — own artboard file + implementation when ready (table, focus strip, exec context).
- **Roadmap** — own page / design system later.

---

## Prerequisites

1. [Paper Desktop](https://paper.design/downloads) running.  
2. A Paper document open (e.g. **Product Orch** for frames **01–05**).  
3. In Cursor: prompt the agent to apply each block to the canvas (or paste into Paper’s own AI if supported).  
4. If MCP fails: see [paper.design/docs/mcp](https://paper.design/docs/mcp).

---

## 1 — Orchestration board

```
Paper: design a desktop orchestration board only (no code).

Product: Fresh internal “Product orchestration” app for a B2B SaaS company (deskless workforce / comms)—not a clone of any existing dashboard.

Landing: This screen is the default entry — users land on Orchestration (not Executive or Roadmap).

Layout:
- Top: app name left, user menu right, subtle.
- Main: horizontal swimlanes (columns): Idea → Discovery → Design → Spec ready → In build → Test/UAT → Shipped/Live.
- Each column: header + count, vertical stack of cards (max 3–4 visible per column with varied heights).

Create idea: Include a clear **primary affordance to create a new idea** — e.g. prominent control in the **Idea** lane (or equivalent) that opens the **New initiative** flow (same modal as artboard **05**). Label can be “New idea”, “Create idea”, or “+ Idea”; must be obvious and consistent with 05.

Cards show: title, one-line summary, pill for tier (Now / Next / Future), small lane indicator, optional small progress or status dot. One card may show “Focus” or pin treatment.

Use realistic fake initiative titles (short). Desktop width ~1440px, comfortable padding.

Style: fresh, restrained, high legibility—avoid generic “AI slop” purple gradients. Single accent used sparingly for primary actions and focus state.
```

---

## 2 — Initiative detail (Idea lane: tabs gated)

```
Paper: full-height panel or page “Initiative detail” for the same app.

Header: title, tier, lane badge, last updated, actions: Move lane (dropdown), More.

Tab bar: Brief | Discovery | Requirements | Design.
State: initiative is in IDEA lane—only Brief is active; Discovery, Requirements, Design are visibly disabled (grey, lock icon, tooltip text “Unlocks when you move to Discovery”).

Brief tab content: structured sections for problem, users, success, notes—readable forms, not walls of text.

Fresh UI, same accent and surfaces as the orchestration board artboard.
```

---

## 3 — Initiative detail (Discovery: agent running)

```
Paper: same initiative detail layout, but lane = DISCOVERY.

Tabs: Brief and Discovery active; Requirements and Design still disabled OR Requirements enabled—pick one and show clearly.

Discovery tab: shows a top banner “Enriching context…” with progress; below, placeholder sections that will fill (Related work, Links, Open questions). Brief tab still editable (scope can change).

Re-run discovery: If the user edits the **brief** (or scope) after an initial discovery pass, they need a visible way to **run discovery again** — e.g. secondary button or link “Re-run discovery” / “Refresh discovery” next to the banner or in the toolbar, with copy that this re-enriches context when the problem statement changes. Show the control in a restrained, non-noisy way.

Same design system as previous artboards.
```

---

## 4 — Initiative detail (Design / Spec ready: all tabs on)

```
Paper: same initiative detail, lane = DESIGN or Spec ready (label the lane badge clearly).

All four tabs active.

Requirements tab (primary spec surface): This is the **Requirements** screen — the visual home for the **agent-oriented PRD** produced with Dex **`/agent-prd`** and stored as vault Markdown under **`06-Resources/PRDs/`** (linked from the card). Design it as a **full reading/editing experience**, not a stub: section hierarchy, REQ-style IDs / work packages / validation blocks as appropriate to the **`/agent-prd`** output structure (observable behaviors, metrics, agent-executable checks — see skill). Show realistic **static sample** content that looks like a real agent PRD, not generic lorem ipsum.

The Requirements body uses the **documentation editing** rules at the top of this doc: headings, paragraphs, bullet lists, **bold**, *italic* — all round-tripping to Markdown on save/export.

Design tab: prominent linked artifact row — icon + “Design file” + URL display + “Revision” field + “Open” button. Optional thumbnail placeholder.

Brief / Discovery tabs: unchanged from earlier artboards; Discovery editor also follows the **documentation editing** Markdown rules where users type long-form notes.

Consistent with prior screens.
```

---

## 5 — New initiative (brief intake) — paired with “Create idea” on 01

```
Paper: modal or drawer “New initiative” for the same app.

Relationship to artboard 01: This modal is what opens when the user triggers **Create idea** on the **Orchestration board** (same labels, fields, and primary action as that entry point). Design 01 and 05 together so the jump from board → modal feels like one flow.

Fields (visible): Title, Problem, Who it’s for, Success metric, Constraints (optional), Intake source (select).

Primary: Create draft. Secondary: Cancel. Show validation hint on title empty (subtle).

Match the fresh system from the orchestration board (typography, buttons, inputs).
```

---

## Separate designs (not in this doc)

**Executive portfolio** and **Roadmap** will be designed as **standalone pages** (own Paper documents, own MCP passes). Do not fold them into the **Product Orch** 01–05 sequence. Until those ship, **Orchestration** remains the landing experience.

---

## Iteration (after first pass)

- Tighten vertical rhythm on cards.  
- Stronger disabled-tab affordance.  
- Reduce chrome—increase content area.  
- Increase contrast on lane headers only.  
- **Create idea** affordance on **01** obvious at a glance; **Re-run discovery** on **03** discoverable but secondary.  
- **Requirements** tab: typography and spacing tuned for long **agent PRD** documents; formatting toolbar clearly mapped to **Markdown** (headings, lists, **bold**, *italic*).

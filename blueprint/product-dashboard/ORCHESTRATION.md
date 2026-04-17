# Product dashboard — PDLC orchestration

This dashboard tracks **feature ideas** through the product development life cycle. **Operational work** (demos, one-off pricing tasks, migration ops tickets) does **not** belong here — use `03-Tasks/Tasks.md` or project files instead.

**Tasks execution board:** [`../workboard/README.md`](../workboard/README.md) (Kanban). **This dashboard** is for initiatives and PRD lifecycle.

## Idea vs PRD (important)

| Concept | What it is | Where it lives |
|--------|------------|----------------|
| **Idea** | Short **intent** for humans: title, stack status (Now / Next / Future / Backlog), and **card summary** — a digest you’d put on the card (outcome, who it’s for), **not** a full specification. | **`summary`** in `initiatives.json`, edited in the ticket as **Card summary (idea)**. |
| **Discovery / workspace** | Research-backed problem framing, evidence, options — **not** a finished PRD. | **[`06-Resources/Product_ideas/`](../../Product_ideas/README.md)** — path in **`contextFile`** (vault-relative). Legacy paths under `product-dashboard/initiatives/` still resolve. |
| **Design** | UX/UI exploration; may link to **draft** PRD material in the vault. | **Figma** on the card; optional **Product PRD (draft)** tab when the card is in **Design**. |
| **Full PRD** | Locked spec + acceptance criteria, ready for engineering. | **`06-Resources/PRDs/...`** — the dashboard loads it in the ticket **Requirements** tab (shown as **Product PRD** in UI copy in places) when the work is at **Design (draft)** or **Spec ready** (and later lanes), **not** for cards that are only in **Idea** or **Discovery**. |

### Requirements tab — `agent-prd` output

- The **Requirements** tab is the **primary screen** in the ticket for reading and editing the **vault PRD** once the lane/stage allows loading it (`prdStage` — see below).
- **Authoring workflow:** produce and evolve that document with Dex **`/agent-prd`** — agent-oriented PRD structure (observable behaviors, metrics, work packages, agent-executable validation, etc.). The file stays **Markdown** on disk.
- **Editing / formatting:** long-form editors in the dashboard should support **documentation** primitives that **round-trip to Markdown**: **headings**, normal paragraphs, **bullet (and numbered) lists**, **bold**, *italic*. Prefer these over exotic rich text so vault files stay portable (Cursor, git, Dex). See **`Paper_fresh_orchestration_UI.md`** (documentation editing section).

### `contextFile` (workspace markdown)

- **Preferred:** vault-relative from repo root, e.g. `06-Resources/Product_ideas/prd-whatsapp_smart_hr.md` (stable **`prd-{slug}`** id — tier is **`prdTier` / lane**, not the filename).
- **Legacy:** relative to `product-dashboard/`, e.g. `initiatives/foo.md` (still supported).

### Naming user-created ideas

- **Do not** use opaque numeric ids (`idea-1730…` from timestamps).
- **Add idea** requires a **title** first; **`id`** and filename are **`idea-{slug-from-title}`** (slugify), with `-2`, `-3`, … on collision.

### Optional initiative fields (`initiatives.json`)

| Field | Use |
|-------|-----|
| `intakeSource` | e.g. `customer`, `market`, `internal`, `board` |
| `progress` | 0–100 (Executive progress column) |
| `progressLabel` | Text if no number |
| `milestones` | `[{ "label", "date", "done" }]` — “Next milestone” column |
| `steeringFocus` | `true` — listed in Executive **Current focus** strip |
| `workflowStatus` | Chips on cards; also **Workflow status** in ticket (e.g. `blocked`, `ready_for_spec`) — **lane** remains the canonical PDLC step |

Root **`executiveContext`:** optional short text shown at the top of the Executive tab (e.g. steering notes from the week).

**`prdStage` in JSON** (optional; inferred from **lane** if missing): `none` | `draft` | `spec_ready`.

- **`none`** — **Idea** or **Discovery**: use **Workspace notes** for the discovery file; the vault PRD path (if present) is a **future home**, not loaded in the modal until you advance.
- **`draft`** — **Design**: optional load of in-progress PRD content from the vault.
- **`spec_ready`** — **Spec ready** and beyond: full PRD expected and loaded when linked.

## Swim lanes (left → right)

| Lane | Meaning | What Dex / you do |
|------|---------|-------------------|
| **Idea** | Captured intent; not yet researched | **Card summary** = the idea digest only. No full PRD required. Links to `06-Resources/PRDs/...` may exist as a *future* file path — the dashboard **does not** open that file in the ticket until later phases. |
| **Discovery** | Problem & evidence gathering | Dragging a card **into** Discovery opens a **review** (heading + description). **Move to Discovery and start** commits the card, **copies a full agent prompt** to the clipboard (vault research + structured sections for **discovery markdown**), and opens the **Discovery file** viewer. Use **Workspace notes** in the ticket for the same file. **Not** a finished PRD. |
| **Design** | UX / UI exploration | **Figma** link on the card. Optional **Product PRD (draft)** tab if a vault PRD path is linked — may load work-in-progress. |
| **Spec ready** | PRD + acceptance criteria locked | **Full PRD** under `06-Resources/PRDs/` with **BDD-style acceptance criteria** where used. **Product PRD** tab loads this file — handoff to engineering. |
| **In build** | Engineering delivery | Developer delivery; PRD tab reflects the locked spec. |
| **Test / UAT** | Validation before release | Link test evidence in PRD or context file. |
| **Shipped / Live** | Deployed to production | Keep PRD path as record. |

## Best practices for cards

1. **One card = one customer-facing idea** (or one coherent epic with a single PRD home).
2. **Title:** short noun phrase (e.g. “WhatsApp channel”, “Payslip PDF”).
3. **Summary (idea):** one or two lines — outcome for the deskless user / admin; refine from discovery findings as you learn.
4. **Links:** may point at a vault **PRD path** even while the card is in **Idea** — that path is the intended file location; the UI explains it is **not loaded** until **Design / Spec ready**.
5. **Move lanes** when the *phase of work* changes — not on every status ping from Jira (unless you want that mirror later).

## Regenerating data from PRDs

From `product-dashboard/`:

```bash
python3 build_initiatives_from_prds.py
```

- Writes discovery stubs to **`06-Resources/Product_ideas/`** and sets **`contextFile`** to vault-relative paths.
- **Current/** PRDs → default **Test / UAT** or **In build**; **`prdStage`** set to **`spec_ready`** for those lanes.
- **Next/** → **Idea**; **`prdStage` = `none`** (vault link kept for later; not loaded in modal in Idea).
- **Future/** → **Idea**; same. PRD templates under Next are excluded.

Then open the dashboard, drag lanes as needed, **Export JSON**, and merge into `initiatives.json` if you want vault-persisted positions.

### Stable ids and tier (not in filenames)

- Initiative **`id`** is **`prd-{slug}`** where **slug** comes from the PRD **filename** (not `Current` / `Next` / `Future`). **Stack** (“Now / Future”) is **`prdTier`** in JSON, the status bar in the UI, or optional **YAML frontmatter** in the workspace file (`prdTier: Current` — **frontmatter wins** on rebuild when set).
- One-time rename from older `prd-future-*` / `prd-current-*` ids: run **`python3 migrate_stable_ids.py`** from `product-dashboard/`, then **`build_initiatives_from_prds.py`**. **`migration_id_map.json`** lists old → new ids for remapping browser **localStorage** keys if needed.

## Browser-only fields

- **Custom ideas** you add in the UI are stored in **localStorage** until exported.
- **Figma URLs**, **workflow status**, **intake source** — editable in the card panel; merged on export.
- **Reset moves & order** — clears lane overrides and per-lane order (not your text edits).

---

*Dex version note: discovery/build automation hooks can deepen over time; this doc matches the 2026-04 orchestration scope.*

# Product dashboard

**Purpose:** **Orchestration** (default **landing**) — **feature ideas** moving through **Idea → Discovery → Design → Spec ready → In build → Test/UAT → Shipped/Live**, with **Create idea** opening the new-initiative flow. **Executive** (table, focus strip) remains available in-app for now but is planned as a **separate page/design**; **Roadmap** likewise. See **`Paper_fresh_orchestration_UI.md`** for Paper scope (**01–05** only).

**Guardrail — client vs internal:** This board is for **[[Wyzetalk]] product initiatives customers pay for** (roadmap, PRDs, GTM). **AI-in-PDLC** ways of working, Dex/vault automation, and internal orchestration experiments belong in **`04-Projects/AI_in_the_PDLC_Internal.md`** and tasks — **not** as fake “product” cards here. Timeline or design-tool experiments for **internal** process should use **separate** artefacts; do not merge internal workflow into `initiatives.json` unless promoting a real customer-facing initiative.

This surface is **not** for operational tasks (demos, one-off pricing, migration ops). Those stay in **`03-Tasks/Tasks.md`** or the **[workboard](../workboard/README.md)** Kanban. Here, **one card = one product idea**. **`summary`** is the **idea digest**; the **full vault PRD** is expected by **Spec ready** and is only loaded in the ticket from **Design / Spec+** (see **ORCHESTRATION.md**).

**Pre-PRD discovery markdown** lives under **[`06-Resources/Product_ideas/`](../../06-Resources/Product_ideas/README.md)** (`contextFile` in JSON points there).

## Files

| File | Role |
|------|------|
| **`index.html`** | **Orchestration** (default **landing**) + **Executive** (interim). **Create idea** (+) in **Idea** lane opens **New initiative**. Ticket **only opens from a card** — main tabs **Brief** \| **Discovery** \| **Requirements** \| **Design** with **lane-based gating**. **Brief**: product brief + card summary + workflow/intake. **Discovery**: workspace markdown. **Requirements**: vault **Product PRD** when lane/stage allows. **Design**: Figma + **Design file URL** + **Revision**. |
| **`product-dashboard.css`** | Styles for **`index.html`** (fonts: Inter + Newsreader). |
| **`initiatives.json`** | Source data — schema **`initiatives.schema.json`** (v**2.4**): stable **`prd-{slug}`** ids; optional **`designArtifactUrl`** / **`designRevision`**; `summary`, optional **`prdStage`**, **`executiveContext`**, optional **`steeringFocus`**, **`milestones`**, **`progress`**, etc. |
| **`build_initiatives_from_prds.py`** | **Regenerate** `initiatives.json` + stubs under **`06-Resources/Product_ideas/`** from **`06-Resources/PRDs/{Current,Next,Future}/`**. **Does not overwrite** workspace files that are long enough, marked **`preserve: true`**, or **`dex_dashboard_preserve`** in frontmatter. Merges optional frontmatter **`prdTier`** / **`summary`** (frontmatter **wins** for tier when set). Card **summary** can be filled from a short **excerpt** of existing markdown. |
| **`migrate_stable_ids.py`** | **One-time** migration from old ids (`prd-future-*`, `prd-current-*`, `prd-next-*`) to **stable** `prd-{slug}`; renames `Product_ideas` files and rewrites **`initiatives.json`**. Writes **`migration_id_map.json`** (old → new id) for remapping browser **localStorage** keys. Run once, then **`build_initiatives_from_prds.py`**. |
| **`Paper_fresh_orchestration_UI.md`** | **Paper Desktop:** **Product Orch** artboards **01–05** (prompts); Markdown documentation editing; **Requirements** = **`/agent-prd`** surface. Executive / Roadmap out of scope here. |
| **`CONCEPTS.md`** | Vault ↔ UI data flow, **implementation requirements**, and **Paper design-to-code** (no custom skills). |
| **`ORCHESTRATION.md`** | PDLC expectations, `contextFile`, naming, best practices for cards. |
| **`migrate_from_workboard.py`** | Legacy only — old workboard JSON → dashboard shape. Prefer **`build_initiatives_from_prds.py`**. |
| **`archive/`** | Snapshot of legacy workboard JSON (2026-04-13). |
| **`initiatives/`** | **Legacy** — only **`README.md`**; workspace files moved to **`Product_ideas/`**. |

## Paper → code (design-to-code)

Use the Cursor **Paper** plugin’s built-in **design-to-code** skill (not a custom Dex skill): with **Paper Desktop** running and your document open, select the frame to sync. The agent uses MCP **`plugin-paper-desktop-paper`** ([docs](https://paper.design/docs/mcp)) — e.g. **`get_jsx`**, **`get_computed_styles`**, **`get_tree_summary`** — and updates **`product-dashboard.css`** / **`index.html`** so the **UI matches the Paper design**.

**Preserve implementation:** four-tab ticket with **lane gating**, **Orchestration** (and **Executive** while embedded), vault **`fetch()`** paths, **`initiatives.json`** merge rules — see **ORCHESTRATION.md** and **`CONCEPTS.md`**. Visual polish from Paper must not remove required fields or tab logic.

**Artboard prompts** (what each Paper frame is for): **`Paper_fresh_orchestration_UI.md`**.

## Default PRD → lane mapping (script)

- **`PRDs/Current/`** → mostly **Test / UAT**; **WhatsApp_Channel** and **Payslip_PDF** → **In build** (Essential GA build focus).
- **`PRDs/Next/`** → **Idea** (stack for post-GA roadmap).
- **`PRDs/Future/`** → **Idea** (exploration). PRD template files are skipped.

**Tier / “Now vs Future”** is **`prdTier`** in JSON (and the card status bar), **not** the initiative id or filename. Optional **`06-Resources/Product_ideas/*.md`** YAML frontmatter: `prdTier: Current | Next | Future | Backlog`, `summary: "…"`. Same basename in two PRD folders is rare; if it happens, the script uses a disambiguated slug (e.g. `…-future`).

Re-run after adding or renaming PRDs:

```bash
cd "/path/to/vault/Dex_System/product-dashboard"
python3 build_initiatives_from_prds.py
```

## Run locally

`file://` cannot load `initiatives.json` or **PRD / workspace markdown** via `fetch` reliably — use a static server.

**Serve the vault root** (the folder that contains `06-Resources/`). If the HTTP root is only `product-dashboard/`, **Product PRD** and **`06-Resources/Product_ideas/`** fetches fail.

**Preferred — script does this for you:**

```bash
cd "/path/to/your/vault/Dex_System/product-dashboard"
chmod +x start_product_dashboard.sh   # once
./start_product_dashboard.sh --open    # serves vault root + opens the dashboard in your browser (macOS/Linux)
# or without auto-open:
./start_product_dashboard.sh
```

Use the **exact URL printed** (includes `/Dex_System/product-dashboard/index.html`). Opening only `http://127.0.0.1:8766/` at the server root is not the dashboard page.

**From Cursor / VS Code:** **Terminal → Run Task…** → **Product dashboard: serve + open browser** (runs the same script with `--open`). Stop the server with **Ctrl+C** in the task terminal.

**Manual:**

```bash
cd "/path/to/your/vault"   # vault root, not product-dashboard/
python3 -m http.server 8766
```

Then open **http://127.0.0.1:8766/Dex_System/product-dashboard/index.html**

### Browser state

- **Lane moves** — stored until **Export JSON** (merged `lane` on each initiative).
- **Card order (orchestration + executive table)** — **tier, then `priority` (P1, P2, …), then title** — so **Next** items group at the top of the executive table and sort within each lane by priority. Drag still updates `cardOrder` in local storage for export, but **display order follows priority** from `initiatives.json`.
- **Status (Now / Next / Future / Backlog)** — segmented bar when you open a card; maps to `prdTier` on export (`Now` = `Current` in JSON).
- **Titles, descriptions, Figma, design file URL, revision, workflow, intake** — editable in the card panel; merged on export.
- **Reset moves & order** — clears lane overrides and per-lane order (not your text edits).
- **Clear custom ideas** — removes dashboard-captured ideas from this browser.

Paste **`initiatives.export.json`** into the vault when you want to persist positions and custom cards.

### After `migrate_stable_ids.py`

Browser overrides (**lane**, **Now/Next/Future**, card order) are keyed by **initiative id**. If you migrated ids, either clear site data for the dashboard origin or remap keys using **`migration_id_map.json`** (replace old id with new in `laneOverride`, `prdTierById`, `cardOrder`, etc., in exported JSON or DevTools **Application → Local Storage**).

## Relationship to the workboard

The **[workboard](../workboard/)** is the **Tasks** execution surface (`Tasks.md`, Today’s focus). The **product dashboard** is for **initiatives and PRDs**. Use both: header link on the workboard opens this dashboard when served from the vault root.

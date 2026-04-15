# Product dashboard

**Purpose:** **(1) Executive** — tier, PDLC lane, progress, milestones, **Current focus** strip, links — and **(2) Orchestration** — **feature ideas** moving through **Idea → Discovery → Design → Spec ready → In build → Test/UAT → Shipped/Live**.

This surface is **not** for operational tasks (demos, one-off pricing, migration ops). Those stay in **`03-Tasks/Tasks.md`** or the **[workboard](../workboard/README.md)** Kanban. Here, **one card = one product idea**. **`summary`** is the **idea digest**; the **full vault PRD** is expected by **Spec ready** and is only loaded in the ticket from **Design / Spec+** (see **ORCHESTRATION.md**).

**Pre-PRD discovery markdown** lives under **[`06-Resources/Product_ideas/`](../../Product_ideas/README.md)** (`contextFile` in JSON points there).

## Files

| File | Role |
|------|------|
| **`index.html`** | Executive + orchestration; ticket **only opens from a card**. **Card summary (idea)** vs **Product PRD** tab (draft/spec only); **Workspace notes** for discovery file (hint when in **Idea** / **Discovery**). **Workflow status** / **Intake** selectors. |
| **`initiatives.json`** | Source data — schema **`initiatives.schema.json`** (v**2.3**): stable **`prd-{slug}`** ids; `summary`, optional **`prdStage`**, **`executiveContext`**, optional **`steeringFocus`**, **`milestones`**, **`progress`**, etc. |
| **`build_initiatives_from_prds.py`** | **Regenerate** `initiatives.json` + stubs under **`06-Resources/Product_ideas/`** from **`06-Resources/PRDs/{Current,Next,Future}/`**. **Does not overwrite** workspace files that are long enough, marked **`preserve: true`**, or **`dex_dashboard_preserve`** in frontmatter. Merges optional frontmatter **`prdTier`** / **`summary`** (frontmatter **wins** for tier when set). Card **summary** can be filled from a short **excerpt** of existing markdown. |
| **`migrate_stable_ids.py`** | **One-time** migration from old ids (`prd-future-*`, `prd-current-*`, `prd-next-*`) to **stable** `prd-{slug}`; renames `Product_ideas` files and rewrites **`initiatives.json`**. Writes **`migration_id_map.json`** (old → new id) for remapping browser **localStorage** keys. Run once, then **`build_initiatives_from_prds.py`**. |
| **`ORCHESTRATION.md`** | PDLC expectations, `contextFile`, naming, best practices for cards. |
| **`migrate_from_workboard.py`** | Legacy only — old workboard JSON → dashboard shape. Prefer **`build_initiatives_from_prds.py`**. |
| **`archive/`** | Snapshot of legacy workboard JSON (2026-04-13). |
| **`initiatives/`** | **Legacy** — only **`README.md`**; workspace files moved to **`Product_ideas/`**. |

## Default PRD → lane mapping (script)

- **`PRDs/Current/`** → mostly **Test / UAT**; **WhatsApp_Channel** and **Payslip_PDF** → **In build** (Essential GA build focus).
- **`PRDs/Next/`** → **Idea** (stack for post-GA roadmap).
- **`PRDs/Future/`** → **Idea** (exploration). PRD template files are skipped.

**Tier / “Now vs Future”** is **`prdTier`** in JSON (and the card status bar), **not** the initiative id or filename. Optional **`06-Resources/Product_ideas/*.md`** YAML frontmatter: `prdTier: Current | Next | Future | Backlog`, `summary: "…"`. Same basename in two PRD folders is rare; if it happens, the script uses a disambiguated slug (e.g. `…-future`).

Re-run after adding or renaming PRDs:

```bash
cd "/path/to/vault/06-Resources/Dex_System/product-dashboard"
python3 build_initiatives_from_prds.py
```

## Run locally

`file://` cannot load `initiatives.json` or **PRD / workspace markdown** via `fetch` reliably — use a static server.

**Serve the vault root** (the folder that contains `06-Resources/`). If the HTTP root is only `product-dashboard/`, **Product PRD** and **`06-Resources/Product_ideas/`** fetches fail.

**Preferred — script does this for you:**

```bash
cd "/path/to/your/vault/06-Resources/Dex_System/product-dashboard"
chmod +x start_product_dashboard.sh   # once
./start_product_dashboard.sh --open    # serves vault root + opens the dashboard in your browser (macOS/Linux)
# or without auto-open:
./start_product_dashboard.sh
```

Use the **exact URL printed** (includes `/06-Resources/Dex_System/product-dashboard/index.html`). Opening only `http://127.0.0.1:8766/` at the server root is not the dashboard page.

**From Cursor / VS Code:** **Terminal → Run Task…** → **Product dashboard: serve + open browser** (runs the same script with `--open`). Stop the server with **Ctrl+C** in the task terminal.

**Manual:**

```bash
cd "/path/to/your/vault"   # vault root, not product-dashboard/
python3 -m http.server 8766
```

Then open **http://127.0.0.1:8766/06-Resources/Dex_System/product-dashboard/index.html**

### Browser state

- **Lane moves** — stored until **Export JSON** (merged `lane` on each initiative).
- **Card order** — per-lane top-to-bottom order (exported as `cardOrder` in the JSON).
- **Status (Now / Next / Future / Backlog)** — segmented bar when you open a card; maps to `prdTier` on export (`Now` = `Current` in JSON).
- **Titles, descriptions, Figma, workflow, intake** — editable in the card panel; merged on export.
- **Reset moves & order** — clears lane overrides and per-lane order (not your text edits).
- **Clear custom ideas** — removes dashboard-captured ideas from this browser.

Paste **`initiatives.export.json`** into the vault when you want to persist positions and custom cards.

### After `migrate_stable_ids.py`

Browser overrides (**lane**, **Now/Next/Future**, card order) are keyed by **initiative id**. If you migrated ids, either clear site data for the dashboard origin or remap keys using **`migration_id_map.json`** (replace old id with new in `laneOverride`, `prdTierById`, `cardOrder`, etc., in exported JSON or DevTools **Application → Local Storage**).

## Relationship to the workboard

The **[workboard](../workboard/)** is the **Tasks** execution surface (`Tasks.md`, Today’s focus). The **product dashboard** is for **initiatives and PRDs**. Use both: header link on the workboard opens this dashboard when served from the vault root.

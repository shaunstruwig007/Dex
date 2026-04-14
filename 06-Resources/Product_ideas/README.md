# Product ideas (pre-PRD)

**Purpose:** Discovery notes, intake, and workspace markdown for **ideas that are not yet binding specs**. Binding requirements live under **[`../PRDs/`](../PRDs/)** — see that README for `Current` / `Next` / `Future` / `Then`.

## Rules

- **Put here:** Problem framing, evidence, options, workshop notes, and **board-spawned ideas** before they become a formal PRD.
- **Put in PRDs:** Specs and acceptance criteria once the team commits to a written requirement.

## File naming

- One **`.md` per initiative** when generated from the board or `build_initiatives_from_prds.py` — filename is **`{id}.md`** (stable **`prd-{slug}`** from the PRD filename; **not** `prd-future-…` — tier lives in **`prdTier`** / frontmatter, not the path). Add workshop notes and decisions here; link to `06-Resources/PRDs/...` from the JSON **`links`** array — do not duplicate the full PRD.
- Optional **YAML frontmatter:** `prdTier`, `summary` — see product-dashboard **README** / **ORCHESTRATION.md**. Set **`preserve: true`** (or rely on file size) so rebuilds do not overwrite your notes.

## Orchestration

- **Product dashboard:** [`../Dex_System/product-dashboard/`](../Dex_System/product-dashboard/) — lanes (Idea → Shipped), Executive view, and `initiatives.json`.
- **PDLC:** [`../Dex_System/product-dashboard/ORCHESTRATION.md`](../Dex_System/product-dashboard/ORCHESTRATION.md).

## Title-derived ids

- **User-created ideas** use **slugs from the title** for `id` and filename (searchable, git-friendly), not opaque timestamps.

## Search (QMD)

If you use semantic search, add a collection or scope for this folder alongside `resources` / `prds` in your local QMD config.

# Work dashboard (tabs · Kanban · vault sync)

Open **`http://127.0.0.1:8765/`** after **`python3 workboard_server.py`**.

## Tabs

| Tab | Purpose |
|-----|--------|
| **Tasks** | **Swim lanes:** **Today's focus** (top) + **All tasks** (below); same four Kanban columns in each. Drag between lanes and across columns; server saves `swimLane` + `status` to **`work-items.json`** / **`Tasks.md`**. |
| **Planning Map** | Quarter → week → task minimap (template snapshot). |
| **Roadmap** | Banner, **Now / Then**, milestones, **MRR** bars (Now vs Then colours), migration table. |
| **PDLC doc process** | **Discovery → Design → Develop → Deploy**. Seed **`pdlc-doc-items.json`**; stage moves in **`localStorage`**. Optional later: orchestration on stage change. |

**Single source of truth (tasks):** `work-items.json` ↔ **`03-Tasks/Tasks.md`**. Drag → **`POST /api/save`** → **`build_index.py`** refreshes **`index.html`**.

Your **last selected tab** is remembered in `localStorage`.

---

## Files

| File | Role |
|------|------|
| **`index.template.html`** | UI markup + behaviour (edit this, then run **`build_index.py`**) |
| **`index.html`** | Generated — embedded `work-items` + dashboard context |
| **`build_index.py`** | Merge template + JSON |
| **`build_dashboard_context.py`** | Quarter / week / pillars / daily body / Exco slices from vault |
| **`work-items.json`** | Kanban data (+ optional `swimLane` per item) |
| **`pdlc-doc-items.json`** | Seed list for PDLC doc board (embedded into `index.html`) |
| **`sync_tasks_to_workboard.py`** | `Tasks.md` → JSON |
| **`workboard_server.py`** | Serves UI + **`/api/save`** |

Optional: **`python3 build_dashboard_context.py`** writes **`dashboard-context.json`** for debugging.

---

## Two-way sync (vault + board)

| Direction | What happens |
|-----------|----------------|
| **Board → vault** | With **`workboard_server.py`** and **Connected** in the toolbar, each drop or **daily focus** checkbox updates **`work-items.json`**, **`03-Tasks/Tasks.md`**, and runs **`build_index.py`**. |
| **Vault → board** | After editing **`Tasks.md`** elsewhere: **`python3 sync_tasks_to_workboard.py`**, or use **`/daily-plan`** (runs sync + refresh). |

```bash
cd "06-Resources/Dex_System/workboard"
python3 sync_tasks_to_workboard.py
```

---

## Run the server

```bash
cd "/path/to/vault/06-Resources/Dex_System/workboard"
python3 workboard_server.py
```

**LaunchAgent example:** see **`com.dex.workboard.plist.example`** (vault path → `03-Tasks`).

---

## Kanban columns → `Tasks.md`

| Column | `status` | Checkbox |
|--------|----------|----------|
| To do | `todo` | `- [ ]` |
| On hold | `on_hold` | `- [b]` |
| In progress | `in_progress` | `- [s]` |
| Done | `done` | `- [x]` |

**Sections:** P3 → backlog; others → P2. Sort by **`rankScore`** (high first).

---

## Pillar colours

Defined in **`build_dashboard_context.py`** (`PILLAR_HEX`) and aligned to **`System/pillars.yaml`** ids: **`product_launch_mvp`**, **`client_migration`**, **`ai_pdlc`**. Adjust hex there if you rebrand.

---

## `/daily-plan` integration

The hook **`node .claude/hooks/daily-plan-workboard.cjs`** runs **`sync_tasks_to_workboard.py`** and **`build_index.py`** only (no browser, no auto-start of **`workboard_server.py`**). Open **http://127.0.0.1:8765/** yourself when needed. See **`.claude/skills/daily-plan/SKILL.md`** Step 9.

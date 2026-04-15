# Work dashboard (Tasks Kanban)

**Purpose:** **Execution tasks** from `03-Tasks/Tasks.md` — swim lanes, priority, and sync to `work-items.json`. This is **not** the product-initiative / PRD board.

## Pair with the Product dashboard

| Surface | Role |
|---------|------|
| **[Product dashboard](../product-dashboard/)** | Initiatives, **Executive** view (tier, PDLC, progress, milestones), **Orchestration** lanes (Idea → Shipped), discovery workspace under `06-Resources/Product_ideas/`. |
| **This workboard** | Day-to-day **task** execution, Today’s focus, planning map tabs. |

**Open Product dashboard:** from vault root, e.g. `http://127.0.0.1:8766/Dex_System/product-dashboard/index.html` — see [product-dashboard README](../product-dashboard/README.md).

## Daily plan hook

After `/daily-plan`, the hook runs `sync_tasks_to_workboard.py` + `build_index.py` so this board stays aligned with `Tasks.md` (see `.claude/hooks/daily-plan-workboard.cjs`).

## Run locally

See `start_workboard.sh` / `Start_Dex_Workboard.command`. Serve the **vault root** so relative links resolve.

---

*Product PRDs and idea discovery live under `06-Resources/PRDs/` and `06-Resources/Product_ideas/`.*

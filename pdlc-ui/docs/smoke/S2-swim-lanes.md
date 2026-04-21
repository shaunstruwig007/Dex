# Smoke — Sprint S2 (swim lanes + forward moves)

**Pre:** `cd pdlc-ui && npm run db:migrate && npm run dev` → open `http://localhost:3000`.

**Time budget:** ~5 minutes (full forward chain longer if you exercise `deployed`).

## Checklist

- [ ] **Lanes:** level-3 headings **Idea**, **Discovery**, **Design**, **Spec ready**, **Develop**, **UAT**, **Deployed** all visible. Parked cards live in a separate **region** (“Parked initiatives”) behind **Show parked**, not as an eighth main lane heading.
- [ ] **Create card:** same as S1 — **Create new initiative** → **Create idea**; card appears in **Idea** lane.
- [ ] **Brief gate:** card **Actions** → hover **Move to…** → **Discovery** is **disabled**; hover or tooltip text mentions brief / Sprint 3 (server must still refuse the transition if forced).
- [ ] **Parked modal:** **Actions** → **Park…** opens **Park initiative** dialog; empty reason → cannot confirm; pick intent + non-empty reason → confirm; card leaves main lanes; enable **Show parked** — **region** “Parked initiatives” lists the card.
- [ ] **Un-park:** parked card **Actions** → menu item **Un-park** (may show “→” in the label) returns the card to the **Idea** lane.
- [ ] **Forward move (happy path):** with a brief present on the initiative (`brief` populated per schema — in production this is S3; for local smoke you can use devtools/API only if you accept writing to your local DB), **Move to…** → **Discovery** succeeds; then step forward **Design** → **Spec ready** → **Develop** → **UAT** → **Deployed** in order; full reload keeps the final column.
- [ ] **Within-lane reorder (optional):** drag a card above/below another in the same lane **or** focus the card and **Alt+ArrowUp / Alt+ArrowDown**; reload — order stable.
- [ ] **Keyboard:** **Tab** into **Lifecycle lanes** region; **Arrow keys** can scroll the horizontal lane strip when focus is on the region.

## Full forward chain without S3

Only if you intentionally enable the test helper: `PDLC_ALLOW_TEST_HELPERS=1 npm run dev`, then `POST /api/test/seed-brief` with `{ "id": "<initiative-uuid>" }` (see `e2e/swim-lanes.spec.ts`). **Do not** enable this in production.

## If something fails

1. Same local gauntlet as S1 smoke doc.
2. `npm run test:e2e:a11y` (includes board + parked dialog axe scopes).
3. Re-read [lifecycle-transitions.md](../../../../plans/PDLC_UI/lifecycle-transitions.md) for `canTransition` rules — UI and API should match.

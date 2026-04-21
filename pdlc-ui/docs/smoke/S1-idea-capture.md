# Smoke — Sprint S1 (idea capture + persistence)

**Pre:** `cd pdlc-ui && npm run db:migrate && npm run dev` → open `http://localhost:3000`.

**Time budget:** ~3 minutes.

## Checklist

- [ ] **Shell loads:** heading “PDLC Orchestration” (or equivalent app chrome); no Next.js error overlay.
- [ ] **Board region:** level-2 heading **Board** is visible.
- [ ] **Create:** **Create new initiative** opens a dialog; title field accepts text; **Idea body** rich text accepts a short paragraph; **Create idea** closes the dialog and a **listitem** card shows title + body snippet + `INIT-NNNN` handle.
- [ ] **Persistence:** full browser reload — the same card is still present.
- [ ] **Edit:** card **Actions** menu (ellipsis) → edit path updates title or body; save; reload — changes persist.
- [ ] **Delete:** delete from actions menu (or equivalent) confirms and removes the card after reload.
- [ ] **API sanity (optional):** `GET /api/health` returns `ok`; `GET /api/ready` returns ready after first request warmed storage.

## If something fails

1. Run `npm run lint && npm run typecheck && npm run schema:validate && npm test` locally.
2. Run `npm run test:e2e:a11y` (Playwright spins its own server and DB).
3. See [BACKUP_RUNBOOK.md](../BACKUP_RUNBOOK.md) before deleting `pdlc-ui/data/` to rule out a corrupted local DB.

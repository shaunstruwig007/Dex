# Smoke — S3 product brief wizard (`idea` → `discovery`)

**Pre:** `npm run dev` (or staging host), board loads.

1. **Create idea** — New initiative → title + body → save; card appears in **Idea** with `rev 1`.
2. **Open wizard** — Actions → Move to… → **Discovery**. Expect **Product brief** dialog (stepper, Round labels).
3. **Required path** — Advance **Next** with empty required fields → inline error; fill each step (TipTap for prose, textarea one-line-per-row for lists) until **Finish** is enabled on last step.
4. **Finish** — Card lands in **Discovery**; `rev` increments **by 1** (atomic save + transition); **Brief** panel appears on the card (collapsed by default); expand to see rendered fields; optional **Export for Cursor**.
5. **Events** — (API / future UI) last two `events[]` kinds are `skill_run` then `stage_transition`.
6. **Cancel (clean)** — Re-open wizard from another idea with no typing → **Cancel** → dialog closes immediately (no discard confirm).
7. **Cancel (dirty)** — Open wizard, type in first field → **Cancel** → **Discard changes?** → **Discard** → dialog closes; reopen wizard → step 1 empty.
8. **Esc / outside click** — Same discard flow as Cancel when answers are dirty.
9. **Refresh mid-wizard** — Closing the browser tab loses in-progress answers (no server-side draft).

**Regression:** `POST /api/test/seed-brief` (Playwright only, `PDLC_ALLOW_TEST_HELPERS=1`) still writes a minimal **completed** brief for S2 forward-chain tests.

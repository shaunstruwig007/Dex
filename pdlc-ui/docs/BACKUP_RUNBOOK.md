# BACKUP_RUNBOOK — `pdlc-ui/data`

## Owner

**Shaun** — interim board owner until handover.

## Cadence

- **Daily** automated snapshot (cron → `scripts/backup-daily.sh`).
- **Ad-hoc** before demos / risky migrations.

## Retention

**30 days** of daily backups under `pdlc-ui/backups/` (pruned by the script). Adjust if ICT mandates otherwise.

## What is backed up

- **`pdlc-ui/data/`** — SQLite files, JSON store, or attachments metadata (Sprint 1+).
- Sprint 0: directory may be empty except `.gitkeep`; script still runs to prove the path.

## SQLite path (Sprint 1+)

- Enable **WAL** + set **`busy_timeout`** on connections.
- **Hot backup:** quiesce writes, then `VACUUM INTO 'backups/manual/backup.db'` (or file copy when DB idle).

## JSON file path (fallback)

- Writes use **atomic rename** (write temp + `rename`).
- Restore: stop app → replace active JSON from `backups/<timestamp>/` → start app.

## Restore drill log

| Date       | Operator | Scenario                                                                                                                | Result                                                                              |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 2026-04-21 | Shaun    | Copied `data/` to `backups/test-restore/`, removed `data/`, restored from backup copy; re-ran `npm run schema:validate` | **Pass** — empty `data/` tree restored; fixture validation still green (no DB yet). |

## Related

- Daily script: [`../scripts/backup-daily.sh`](../scripts/backup-daily.sh)
- Operations: [OPERATIONS.md](./OPERATIONS.md)

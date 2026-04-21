# BACKUP_RUNBOOK — `pdlc-ui/data`

**Not sure when backups apply?** Day-to-day coding → [OPERATOR_CHEATSHEET.md](./OPERATOR_CHEATSHEET.md). This file is for **data** under `pdlc-ui/data/` (mostly Sprint 1+).

## Owner

**Shaun** — interim board owner until handover.

## Cadence

- **Daily** automated snapshot (cron → `scripts/backup-daily.sh`).
- **Ad-hoc** before demos / risky migrations.

## Retention

**30 days** of daily backups under `pdlc-ui/backups/` (pruned by the script). Adjust if ICT mandates otherwise.

## What is backed up

- **`pdlc-ui/data/pdlc.db`** (plus `*-wal` and `*-shm` side files while the process is running) — primary SQLite store from Sprint 1. Path may be overridden via `PDLC_DB_PATH`; back up whatever the running process points at.
- Attachments metadata joins here when S4+ ships link-only attachments.

## SQLite backup (Sprint 1+)

- **Online backup (preferred):** with the process running, `sqlite3 data/pdlc.db ".backup 'backups/<ts>/pdlc.db'"` or open a second `better-sqlite3` connection and call `db.backup(path)`. Safe with WAL + concurrent readers.
- **Hot vacuum (periodic compaction):** quiesce writes, then `VACUUM INTO 'backups/manual/backup.db'`.
- **File copy (last resort):** only when the process is stopped — WAL mode means a raw copy of `pdlc.db` alone without `*-wal`/`*-shm` may be inconsistent.

## Restore (Sprint 1+)

1. Stop the Node process.
2. Replace `data/pdlc.db` (and remove any `pdlc.db-wal` / `pdlc.db-shm` side files) with the chosen backup.
3. Start the app; `/api/ready` will re-apply any new migrations on boot.
4. Spot-check with `npm run schema:validate` and the **Restore drill log** below.

## Restore drill log

| Date       | Operator | Scenario                                                                                                                | Result                                                                              |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 2026-04-21 | Shaun    | Copied `data/` to `backups/test-restore/`, removed `data/`, restored from backup copy; re-ran `npm run schema:validate` | **Pass** — empty `data/` tree restored; fixture validation still green (no DB yet). |

## Related

- Daily script: [`../scripts/backup-daily.sh`](../scripts/backup-daily.sh)
- Operations: [OPERATIONS.md](./OPERATIONS.md)

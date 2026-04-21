#!/usr/bin/env bash
# Daily snapshot of pdlc-ui persisted data (Sprint 0 — Bar A minimum).
# Cron: 0 2 * * * /path/to/pdlc-ui/scripts/backup-daily.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA="${ROOT}/data"
DEST="${ROOT}/backups/$(date +%Y-%m-%d_%H%M%S)"
if [[ ! -d "$DATA" ]]; then
  mkdir -p "$DATA"
fi
mkdir -p "${ROOT}/backups"
cp -R "$DATA" "$DEST"
echo "Backup written to $DEST"
# Prune backups older than 30 days
find "${ROOT}/backups" -maxdepth 1 -mindepth 1 -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true

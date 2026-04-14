#!/usr/bin/env bash
# Weekly automated ingest: RSS → Market_intelligence ingest folders.
# Run from anywhere; resolves vault root from this script's location.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VENV_PY="${ROOT}/.scripts/market-intelligence/.venv/bin/python"
RSS="${ROOT}/.scripts/market-intelligence/fetch_intel_rss.py"

if [[ ! -x "$VENV_PY" ]]; then
  echo "Missing venv Python: ${VENV_PY}" >&2
  echo "Create venv and: pip install -r ${ROOT}/.scripts/market-intelligence/requirements.txt" >&2
  exit 1
fi

echo "==> Weekly intel fetch (RSS) — vault: ${ROOT}"
"$VENV_PY" "$RSS" "$@"
echo "==> Done. Next: run /weekly-exec-intel in Dex to build the stakeholder brief."

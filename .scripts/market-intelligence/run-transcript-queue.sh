#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VENV="$ROOT/.scripts/market-intelligence/.venv/bin/python"
SCRIPT="$ROOT/.scripts/market-intelligence/fetch-youtube-transcript.py"
TSV="$ROOT/.scripts/market-intelligence/video-queue.tsv"
if [[ ! -f "$VENV" ]]; then
  echo "Create venv: python3 -m venv .scripts/market-intelligence/.venv && pip install -r .scripts/market-intelligence/requirements.txt"
  exit 1
fi
tail -n +2 "$TSV" | while IFS=$'\t' read -r vid slug title; do
  [[ "$vid" =~ ^# ]] && continue
  [[ -z "${vid:-}" ]] && continue
  "$VENV" "$SCRIPT" --video-id "$vid" --channel-slug "$slug" --title "$title"
done

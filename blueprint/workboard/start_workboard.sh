#!/bin/bash
# Dex workboard — always loads the latest workboard_server.py from disk.
# Use this after /dex-update if Future PRD create or Save to vault stops working.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

echo ""
echo "  Dex workboard — freeing port 8765 and starting the server"
echo "  ————————————————————————————————————————————————————————"
if lsof -ti :8765 >/dev/null 2>&1; then
  echo "  Stopping the program currently using port 8765…"
  lsof -ti :8765 | xargs kill -9 2>/dev/null || true
  sleep 1
else
  echo "  Port 8765 is free."
fi

echo ""
echo "  Starting server. Keep this window open."
echo "  Then open in your browser:  http://127.0.0.1:8765/"
echo ""
exec python3 workboard_server.py

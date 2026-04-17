#!/usr/bin/env bash
# Serve the vault root over HTTP so fetch() can load:
# - initiatives.json, Product_ideas/*.md, PRDs at 06-Resources/PRDs/...
#
# Serving only product-dashboard/ breaks PRD loads — paths go above that folder.
#
# Usage:
#   ./start_product_dashboard.sh              # default port 8766
#   ./start_product_dashboard.sh 8770       # custom port
#   ./start_product_dashboard.sh --open       # port 8766 + open browser (macOS open / Linux xdg-open)
#   ./start_product_dashboard.sh --open 8770
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
OPEN_BROWSER=false
while [[ $# -gt 0 ]]; do
  case "${1:-}" in
    --open|-o)
      OPEN_BROWSER=true
      shift
      ;;
    *)
      break
      ;;
  esac
done
PORT="${1:-8766}"
# product-dashboard → blueprint → vault root
VAULT_ROOT="$(cd "$DIR/../.." && pwd)"
INDEX_REL="blueprint/product-dashboard/index.html"
if [[ ! -f "$VAULT_ROOT/$INDEX_REL" ]]; then
  echo "error: could not resolve vault root from this script (missing $INDEX_REL under $VAULT_ROOT)" >&2
  exit 1
fi
URL="http://127.0.0.1:${PORT}/${INDEX_REL}"
echo "Vault root: $VAULT_ROOT"
echo "Dashboard URL:"
echo "  $URL"
echo ""
cd "$VAULT_ROOT"

if [[ "$OPEN_BROWSER" == true ]]; then
  python3 -m http.server "$PORT" &
  PID=$!
  trap 'kill "$PID" 2>/dev/null || true; exit 130' INT
  trap 'kill "$PID" 2>/dev/null || true; exit 143' TERM
  sleep 0.5
  if command -v open >/dev/null 2>&1; then
    open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" 2>/dev/null || true
  else
    echo "No open/xdg-open — paste the URL above into your browser."
  fi
  wait "$PID"
else
  exec python3 -m http.server "$PORT"
fi

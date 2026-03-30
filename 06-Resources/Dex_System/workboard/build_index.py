#!/usr/bin/env python3
"""Regenerate index.html from index.template.html + embedded JSON."""
import json
from pathlib import Path

from build_dashboard_context import build_dashboard_context

HERE = Path(__file__).resolve().parent
VAULT_ROOT = HERE.parent.parent.parent
TEMPLATE = HERE / "index.template.html"

if not TEMPLATE.is_file():
    raise SystemExit(f"build_index: missing template {TEMPLATE}")

data = json.load(open(HERE / "work-items.json"))
embed = json.dumps(data, separators=(",", ":"))
dash = build_dashboard_context(VAULT_ROOT)
dash_embed = json.dumps(dash, separators=(",", ":"))
pdlc_path = HERE / "pdlc-doc-items.json"
pdlc_embed = json.dumps(
    json.load(open(pdlc_path)) if pdlc_path.is_file() else {"schemaVersion": "1.0.0", "items": []},
    separators=(",", ":"),
)

html = TEMPLATE.read_text(encoding="utf-8")
out = (html
       .replace("__EMBED__", embed)
       .replace("__DASHBOARD__", dash_embed)
       .replace("__PDLC__", pdlc_embed))
(HERE / "index.html").write_text(out, encoding="utf-8")
print("Wrote index.html")

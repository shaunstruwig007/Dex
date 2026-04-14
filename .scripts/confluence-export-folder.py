#!/usr/bin/env python3
"""
Export a Confluence Cloud folder (or any parent page) to local HTML files.

Uses Confluence REST API v1 with HTTP Basic auth: email + API token (not password).
Output uses expand=body.view — rendered HTML (preview-style), not storage/markdown.

Environment:
  CONFLUENCE_SITE    e.g. https://wyzetalk.atlassian.net/wiki
  CONFLUENCE_EMAIL   Your Atlassian account email
  CONFLUENCE_TOKEN   API token from https://id.atlassian.com/manage-profile/security/api-tokens
  CONFLUENCE_ROOT_ID Content ID of the folder/page (e.g. 3260350466 from the URL)

Optional:
  CONFLUENCE_OUT_DIR Output root (default: 06-Resources/PRDs/Confluence_import under vault)

Usage:
  cd /path/to/Dex
  export CONFLUENCE_SITE=https://wyzetalk.atlassian.net/wiki
  export CONFLUENCE_EMAIL=you@company.com
  export CONFLUENCE_TOKEN=...
  export CONFLUENCE_ROOT_ID=3260350466
  python3 .scripts/confluence-export-folder.py

Docs: https://developer.atlassian.com/cloud/confluence/rest/v1/intro/
"""

from __future__ import annotations

import argparse
import base64
import html
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


def _auth_header(email: str, token: str) -> str:
    raw = f"{email}:{token}".encode("utf-8")
    return "Basic " + base64.b64encode(raw).decode("ascii")


def api_json(site_base: str, path: str, email: str, token: str) -> dict | list:
    """site_base ends with /wiki; path starts with /rest/api/..."""
    url = site_base.rstrip("/") + path
    req = urllib.request.Request(url, method="GET")
    req.add_header("Authorization", _auth_header(email, token))
    req.add_header("Accept", "application/json")
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_children(site_base: str, parent_id: str, email: str, token: str) -> list[dict]:
    out: list[dict] = []
    start = 0
    limit = 50
    while True:
        path = (
            f"/rest/api/content/{parent_id}/child/page"
            f"?start={start}&limit={limit}&expand=version"
        )
        data = api_json(site_base, path, email, token)
        results = data.get("results", [])
        out.extend(results)
        if len(results) < limit:
            break
        start += limit
        time.sleep(0.15)
    return out


def fetch_page_view(site_base: str, page_id: str, email: str, token: str) -> tuple[str, str]:
    path = f"/rest/api/content/{page_id}?expand=body.view,version,space"
    data = api_json(site_base, path, email, token)
    title = data.get("title") or page_id
    body = (data.get("body") or {}).get("view") or {}
    value = body.get("value") or ""
    return title, value


def safe_segment(name: str) -> str:
    s = "".join(c if c not in '<>:"/\\|?*' else "_" for c in name.strip())
    s = s.replace("\n", " ").strip() or "untitled"
    return s[:180]


def wrap_html(title: str, inner_html: str) -> str:
    return (
        "<!DOCTYPE html>\n"
        '<html lang="en"><head><meta charset="utf-8">\n'
        f"<title>{html.escape(title)}</title>\n"
        "<style>\n"
        "body{font-family:system-ui,-apple-system,sans-serif;max-width:960px;margin:1.5rem auto;padding:0 1rem;line-height:1.5;}\n"
        "table{border-collapse:collapse;} td,th{border:1px solid #ccc;padding:4px 8px;}\n"
        "</style></head><body>\n"
        f"<article class=\"confluence-preview\">\n{inner_html}\n</article>\n"
        "</body></html>\n"
    )


def export_tree(
    site_base: str,
    root_id: str,
    email: str,
    token: str,
    dest: Path,
    *,
    save_root_page: bool,
) -> None:
    dest.mkdir(parents=True, exist_ok=True)

    def visit(page_id: str, folder: Path, depth: int) -> None:
        title, view_html = fetch_page_view(site_base, page_id, email, token)
        time.sleep(0.15)
        if save_root_page or depth > 0:
            file_path = folder / f"{safe_segment(title)}.html"
            file_path.write_text(wrap_html(title, view_html), encoding="utf-8")
            print(f"Wrote {file_path}", file=sys.stderr)

        children = fetch_children(site_base, page_id, email, token)
        for ch in children:
            cid = ch.get("id")
            ctitle = ch.get("title") or cid
            if not cid:
                continue
            sub = folder / safe_segment(str(ctitle))
            sub.mkdir(parents=True, exist_ok=True)
            visit(str(cid), sub, depth + 1)

    visit(root_id, dest, 0)


def main() -> int:
    p = argparse.ArgumentParser(description="Export Confluence subtree as preview HTML.")
    p.add_argument("--root-id", default=os.environ.get("CONFLUENCE_ROOT_ID", ""))
    p.add_argument("--out", default=os.environ.get("CONFLUENCE_OUT_DIR", ""))
    args = p.parse_args()

    site = os.environ.get("CONFLUENCE_SITE", "").strip()
    email = os.environ.get("CONFLUENCE_EMAIL", "").strip()
    token = os.environ.get("CONFLUENCE_TOKEN", "").strip()
    root_id = (args.root_id or "").strip()

    if not site or not email or not token or not root_id:
        print(
            "Set CONFLUENCE_SITE, CONFLUENCE_EMAIL, CONFLUENCE_TOKEN, CONFLUENCE_ROOT_ID "
            "(or pass --root-id). See script docstring.",
            file=sys.stderr,
        )
        return 1

    vault = Path(__file__).resolve().parents[1]
    out_dir = args.out.strip() if args.out else ""
    if not out_dir:
        out_path = vault / "06-Resources" / "PRDs" / "Confluence_import" / f"BLUE_{root_id}"
    else:
        out_path = Path(out_dir).expanduser().resolve()

    try:
        meta = api_json(site, f"/rest/api/content/{root_id}?expand=space", email, token)
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.reason}. Check CONFLUENCE_SITE, token, and root id.", file=sys.stderr)
        return 1

    space_key = (meta.get("space") or {}).get("key") or "SPACE"
    root_title = meta.get("title") or root_id
    root_folder = out_path / safe_segment(f"{space_key}_{root_title}_{root_id}")
    root_folder.mkdir(parents=True, exist_ok=True)
    readme = root_folder / "README.md"
    readme.write_text(
        "# Confluence HTML export (snapshot)\n\n"
        f"- **Source:** `{site}` content `{root_id}` — **{root_title}**\n"
        "- **Format:** `body.view` HTML (preview-style), wrapped in a minimal HTML shell.\n"
        "- **Vault PRDs:** Canonical specs remain under `Current/`, `Next/`, `Future/` per "
        "[../README.md](../README.md). Merge or replace deliberately.\n",
        encoding="utf-8",
    )

    print(f"Exporting to {root_folder} ...", file=sys.stderr)
    export_tree(site, root_id, email, token, root_folder, save_root_page=True)
    print("Done.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

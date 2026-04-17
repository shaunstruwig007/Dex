#!/usr/bin/env python3
"""
One-time migration: old ids prd-{current|next|future}-{slug} -> prd-{stable_slug}.

Renames 06-Resources/Product_ideas/prd-* files and rewrites initiatives.json.
Re-run is safe: skips rows already using new ids.

After migration, run: python3 build_initiatives_from_prds.py

Browser localStorage keys (laneOverride, prdTierById, cardOrder, …) are keyed by
initiative id — use migration_id_map.json to remap or re-set tiers in the UI once.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from build_initiatives_from_prds import (  # noqa: E402
    SCHEMA_VERSION,
    assign_stable_slugs,
    gather_prd_rows,
)

VAULT = ROOT.parents[1]
INIT_PATH = ROOT / "initiatives.json"
MAP_PATH = ROOT / "migration_id_map.json"

HREF_RE = re.compile(
    r"^06-Resources/PRDs/(Current|Next|Future)/([^/\\]+\.md)$", re.IGNORECASE
)


def parse_prd_href(href: str) -> tuple[str, str] | None:
    if not href:
        return None
    m = HREF_RE.match(href.replace("\\", "/").strip())
    if not m:
        return None
    fr = m.group(1).lower()
    subs = {"current": "Current", "next": "Next", "future": "Future"}
    sub = subs.get(fr)
    if not sub:
        return None
    return sub, m.group(2)


def key_map_from_tree() -> dict[tuple[str, str], str]:
    rows = gather_prd_rows()
    assign_stable_slugs(rows)
    return {(r["sub"], r["fname"]): f"prd-{r['stable_slug']}" for r in rows}


def safe_rename(old: Path, new: Path) -> None:
    if not old.exists():
        return
    if new.exists():
        try:
            if old.samefile(new):
                return
        except OSError:
            pass
        return
    old.rename(new)


def main() -> None:
    km = key_map_from_tree()
    data = json.loads(INIT_PATH.read_text(encoding="utf-8"))
    initiatives = data.get("initiatives") or []
    id_map: dict[str, str] = {}

    for init in initiatives:
        links = init.get("links") or []
        href = ""
        for L in links:
            h = (L.get("href") or "").strip()
            if "PRDs/" in h and h.endswith(".md"):
                href = h
                break
        parsed = parse_prd_href(href)
        if not parsed:
            continue
        sub, fname = parsed
        new_id = km.get((sub, fname))
        if not new_id:
            print(f"warn: no key for {sub}/{fname}", file=sys.stderr)
            continue
        old_id = init.get("id") or ""
        if old_id == new_id:
            init["contextFile"] = f"06-Resources/Product_ideas/{new_id}.md"
            continue
        id_map[old_id] = new_id
        init["id"] = new_id
        init["contextFile"] = f"06-Resources/Product_ideas/{new_id}.md"

    data["schemaVersion"] = SCHEMA_VERSION
    data["initiatives"] = initiatives

    pi = VAULT / "06-Resources" / "Product_ideas"
    for old_id, new_id in id_map.items():
        safe_rename(pi / f"{old_id}.md", pi / f"{new_id}.md")

    INIT_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    MAP_PATH.write_text(json.dumps(id_map, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Migrated {len(id_map)} initiative ids. Map: {MAP_PATH.relative_to(VAULT)}")
    print("Next: python3 build_initiatives_from_prds.py")
    if not id_map:
        print("(No id changes — already migrated or no PRD links.)")


if __name__ == "__main__":
    main()

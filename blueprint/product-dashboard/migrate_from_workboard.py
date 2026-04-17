#!/usr/bin/env python3
"""
Legacy one-off: read old workboard JSON and emit initiatives.json + stub .md files.

**Prefer `build_initiatives_from_prds.py`** for the current model — PRD-backed **ideas**
only (no operational tasks), first lane **idea**, schema v2.

Use this script only if you need to recover something from archived `../workboard/*.json`.

Run from product-dashboard/: python3 migrate_from_workboard.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
WB = ROOT.parent / "workboard"

LANES = [
    "intake",
    "discovery",
    "design",
    "spec_ready",
    "in_build",
    "test_uat",
    "shipped_live",
]

# Old PDLC stage → new lane
PDLC_MAP = {
    "discovery": "discovery",
    "design": "design",
    "develop": "in_build",
    "deploy": "shipped_live",
}


def slug(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9._-]+", "-", s.strip().lower()).strip("-")
    return s[:80] or "item"


def main() -> None:
    initiatives: list[dict] = []
    pdlc_path = WB / "pdlc-doc-items.json"
    work_path = WB / "work-items.json"

    if pdlc_path.exists():
        pdlc = json.loads(pdlc_path.read_text(encoding="utf-8"))
        for it in pdlc.get("items", []):
            old_stage = (it.get("stage") or "discovery").lower()
            lane = PDLC_MAP.get(old_stage, "discovery")
            iid = it.get("id") or f"init-{slug(it.get('title', 'x'))}"
            href = None
            meta = it.get("meta") or ""
            if "PRDs/" in meta or "Current/" in meta or "Next/" in meta or "Future/" in meta:
                parts = meta.replace("·", " ").split()
                for p in parts:
                    if p.endswith(".md") and "/" in p:
                        href = f"06-Resources/{p}" if not p.startswith("06-") else p
                        break
            links = []
            if href:
                links.append({"label": "PRD / doc", "href": href})
            initiatives.append(
                {
                    "id": iid,
                    "title": it.get("title", ""),
                    "summary": meta,
                    "lane": lane,
                    "owner": "",
                    "horizon": (it.get("badge") or "").replace("Now · Essential", "Essential GA"),
                    "rag": "green" if lane == "shipped_live" else "amber",
                    "whatsNext": "",
                    "links": links,
                    "contextFile": f"initiatives/{iid}.md",
                    "source": "pdlc-doc-items",
                    "tags": [],
                }
            )

    if work_path.exists():
        work = json.loads(work_path.read_text(encoding="utf-8"))
        for it in work.get("items", []):
            if it.get("pillar") == "personal":
                continue
            wid = it.get("id", "")
            if any(x.get("id") == wid for x in initiatives):
                continue
            lane = "intake"
            st = (it.get("status") or "").lower()
            if st == "done":
                lane = "shipped_live"
            elif st == "in_progress":
                lane = "in_build"
            kind = it.get("kind", "task")
            if kind == "epic":
                lane = "discovery"
            links = it.get("links") or []
            initiatives.append(
                {
                    "id": f"init-{wid}",
                    "title": it.get("title", ""),
                    "summary": it.get("summary", ""),
                    "lane": lane,
                    "owner": "",
                    "horizon": "",
                    "rag": "amber",
                    "whatsNext": it.get("nextAction", ""),
                    "links": links,
                    "contextFile": f"initiatives/init-{wid}.md",
                    "source": "work-items",
                    "tags": it.get("tags") or [],
                }
            )

    # Dedupe by id (prefer first)
    seen: set[str] = set()
    unique = []
    for x in initiatives:
        if x["id"] in seen:
            continue
        seen.add(x["id"])
        unique.append(x)

    out = {
        "schemaVersion": "1.0.0",
        "title": "Product dashboard — initiatives",
        "updated": "2026-04-13",
        "lanes": LANES,
        "initiatives": sorted(unique, key=lambda z: (LANES.index(z["lane"]), z["title"].lower())),
    }

    (ROOT / "initiatives.json").write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    init_dir = ROOT / "initiatives"
    init_dir.mkdir(exist_ok=True)
    for x in unique:
        md = init_dir / f"{x['id']}.md"
        if md.exists():
            continue
        body = f"# {x['title']}\n\n{x.get('summary') or ''}\n\n## Links\n\n"
        for L in x.get("links") or []:
            body += f"- [{L.get('label')}]({L.get('href')})\n"
        body += "\n*(Add discovery notes, workshop outcomes, and design links here.)*\n"
        md.write_text(body, encoding="utf-8")

    print(f"Wrote initiatives.json ({len(unique)} initiatives) and markdown stubs under initiatives/")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Merge 03-Tasks/Tasks.md into work-items.json (reverse of board → Tasks.md).

Use when Claude/Cursor or Work MCP updates Tasks.md without going through the
Kanban server. Preserves rich fields (links, tags, nextAction, kind) for
existing ids; updates status, title, summary, pillar, band from the markdown.

Then run build_index.py (unless --no-build).

Usage:
  python3 sync_tasks_to_workboard.py [--dry-run] [--no-build]
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
VAULT_ROOT = HERE.parent.parent
TASKS_MD = VAULT_ROOT / "03-Tasks" / "Tasks.md"
WORK_ITEMS = HERE / "work-items.json"
BUILD_INDEX = HERE / "build_index.py"

# Same as workboard_server: checkbox → status
def checkbox_to_status(box: str) -> str:
    b = box.strip().lower()
    if b in ("x",):
        return "done"
    if b == "s":
        return "in_progress"
    if b == "b":
        return "on_hold"
    return "todo"


# Lines written by workboard_server.task_line()
TASK_LINE = re.compile(
    r"^- \[(?P<box> |x|X|s|b)\]\s+\*\*(?P<title>.+?)\*\*"
    r"(?:\s+—\s+(?P<summary>.+?))?"
    r"(?:\s+\[\[\^(?P<tid>task-\d{8}-\d{3})\]\])?"
    r"(?:\s+#\s+(?P<pillar>\S+))?\s*$"
)


def section_to_band(header: str) -> str:
    h = header.strip()
    if h.startswith("## P0"):
        return "P0"
    if h.startswith("## P1"):
        return "P1"
    if h.startswith("## P2"):
        return "P2"
    if h.startswith("## P3"):
        return "P3"
    if "This Week" in h:
        return "P2"
    return "P2"


@dataclass
class ParsedLine:
    task_id: str
    title: str
    summary: str
    status: str
    pillar: str
    band: str
    line_index: int
    rank_score: int = 50


def parse_tasks_md(text: str) -> list[ParsedLine]:
    """Parse task rows from Tasks.md (same sections as workboard_server renders)."""
    current_band = "P2"
    out: list[ParsedLine] = []
    in_body = False
    for i, line in enumerate(text.splitlines()):
        stripped = line.strip()
        if stripped.startswith("## "):
            current_band = section_to_band(stripped)
            if any(
                x in stripped
                for x in ("P0", "P1", "P2", "P3", "This Week")
            ):
                in_body = True
            continue
        if stripped.startswith("## Task Format"):
            break
        if stripped == "---" and in_body and out:
            break
        if not stripped.startswith("- ["):
            continue
        m = TASK_LINE.match(line)
        if not m:
            continue
        tid = m.group("tid")
        if not tid:
            continue
        title = m.group("title").strip()
        summary = (m.group("summary") or "").strip()
        pillar = (m.group("pillar") or "").strip()
        status = checkbox_to_status(m.group("box") or " ")
        out.append(
            ParsedLine(
                task_id=tid,
                title=title,
                summary=summary,
                status=status,
                pillar=pillar,
                band=current_band,
                line_index=i,
            )
        )
    return out


def rank_for_index(band: str, index_in_band: int, total_in_band: int) -> int:
    """Higher = earlier in list. P2/P0/P1 use upper range; P3 lower."""
    if band == "P3":
        return max(10, 39 - min(index_in_band, 29))
    if band == "P0":
        return max(85, 100 - min(index_in_band, 15))
    if band == "P1":
        return max(70, 84 - min(index_in_band, 14))
    # P2 default
    return max(40, 69 - min(index_in_band, 29))


def assign_ranks_new_only(parsed: list[ParsedLine], existing_ids: set[str]) -> None:
    """Only tasks new to the board get rank from file order; existing keep JSON rank."""
    new_only = [p for p in parsed if p.task_id not in existing_ids]
    by_band: dict[str, list[ParsedLine]] = {}
    for p in new_only:
        by_band.setdefault(p.band, []).append(p)
    for band, rows in by_band.items():
        for idx, p in enumerate(rows):
            p.rank_score = rank_for_index(band, idx, len(rows))


def merge_board(board: dict, parsed: list[ParsedLine]) -> list[str]:
    by_id = {it["id"]: it for it in board.get("items", []) if it.get("id")}
    assign_ranks_new_only(parsed, set(by_id.keys()))
    new_items: list[dict] = []
    seen: set[str] = set()

    for p in parsed:
        seen.add(p.task_id)
        if p.task_id in by_id:
            it = dict(by_id[p.task_id])
            it["status"] = p.status
            it["title"] = p.title
            it["summary"] = p.summary
            if p.pillar:
                it["pillar"] = p.pillar
            it["priorityBand"] = p.band
            it["rankScore"] = int(by_id[p.task_id].get("rankScore", 50))
            new_items.append(it)
        else:
            new_items.append(
                {
                    "id": p.task_id,
                    "kind": "task",
                    "title": p.title,
                    "summary": p.summary,
                    "nextAction": "",
                    "priorityBand": p.band,
                    "rankScore": int(p.rank_score),
                    "status": p.status,
                    "pillar": p.pillar,
                    "tags": [],
                    "links": [],
                }
            )

    # Orphans: ids on board but not in Tasks.md — drop (Tasks.md is authoritative)
    dropped = [i for i in by_id if i not in seen]
    board["items"] = new_items
    board["updated"] = date.today().isoformat()
    board["schemaVersion"] = board.get("schemaVersion") or "1.1.0"
    return dropped


def main() -> int:
    ap = argparse.ArgumentParser(description="Sync Tasks.md → work-items.json")
    ap.add_argument("--dry-run", action="store_true", help="Print diff only, do not write")
    ap.add_argument("--no-build", action="store_true", help="Skip build_index.py")
    args = ap.parse_args()

    if not TASKS_MD.is_file():
        print("sync_tasks_to_workboard: missing", TASKS_MD, file=sys.stderr)
        return 1
    if not WORK_ITEMS.is_file():
        print("sync_tasks_to_workboard: missing", WORK_ITEMS, file=sys.stderr)
        return 1

    text = TASKS_MD.read_text(encoding="utf-8")
    parsed = parse_tasks_md(text)
    if not parsed:
        print("sync_tasks_to_workboard: no task lines with [[^task-…]] in Tasks.md", file=sys.stderr)
        return 0

    board = json.loads(WORK_ITEMS.read_text(encoding="utf-8"))
    dropped = merge_board(board, parsed)

    if args.dry_run:
        print(
            "dry-run:",
            len(board.get("items", [])),
            "items;",
            len(dropped),
            "would be removed (not in Tasks.md)",
        )
        if dropped:
            print("  dropped:", ", ".join(dropped))
        return 0

    WORK_ITEMS.write_text(
        json.dumps(board, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(
        "sync_tasks_to_workboard: wrote",
        len(board.get("items", [])),
        "items;",
        len(dropped),
        "removed (not in Tasks.md)",
    )
    if dropped:
        print("  dropped:", ", ".join(dropped))

    if not args.no_build and BUILD_INDEX.exists():
        r = subprocess.run(
            [sys.executable, str(BUILD_INDEX)],
            cwd=str(HERE),
            capture_output=True,
            text=True,
            timeout=60,
        )
        if r.returncode != 0:
            print(r.stderr or r.stdout, file=sys.stderr)
            return r.returncode or 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

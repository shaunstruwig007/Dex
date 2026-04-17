#!/usr/bin/env python3
"""Build dashboard context: quarters, week, pillars, daily plan body, Exco roadmap slices.

Consumed by build_index.py (embedded JSON). Optional: write dashboard-context.json.
"""
from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
VAULT_ROOT = HERE.parent.parent
OUTPUT = HERE / "dashboard-context.json"

TASK_REF = re.compile(r"\[\[\^(task-\d{8}-\d{3})\]\]")

# Left-border / accent colours for pillars (aligned to strategic delivery tracks)
PILLAR_HEX = {
    "product_launch_mvp": "#5b9cf5",
    "client_migration": "#50c878",
    "ai_pdlc": "#e8b84a",
}


def _parse_pillars_yaml(path: Path) -> list[dict]:
    if not path.is_file():
        return []
    text = path.read_text(encoding="utf-8")
    out: list[dict] = []
    for m in re.finditer(r"- id: (\S+)\s*\n\s*name: \"([^\"]+)\"", text):
        pid = m.group(1)
        out.append(
            {
                "id": pid,
                "name": m.group(2),
                "color": PILLAR_HEX.get(pid, "#8b95a5"),
            }
        )
    return out


def _extract_table_after_heading(text: str, heading: str) -> list[list[str]]:
    idx = text.find(heading)
    if idx < 0:
        return []
    chunk = text[idx : idx + 12000]
    rows: list[list[str]] = []
    for line in chunk.splitlines():
        s = line.strip()
        if not s.startswith("|"):
            if rows:
                break
            continue
        if re.match(r"^\|?\s*[-:]+", s):
            continue
        cells = [c.strip() for c in s.strip("|").split("|")]
        if not cells:
            continue
        head = cells[0].lower()
        if head in ("outcome", "#", "quarter", "milestone", "theme", "layer"):
            continue
        if head.startswith("# ") and "goal" in head:
            continue
        rows.append(cells)
    return rows


def _extract_section_lines(text: str, start_heading: str, until_re: str) -> str:
    idx = text.find(start_heading)
    if idx < 0:
        return ""
    rest = text[idx + len(start_heading) :]
    m = re.search(until_re, rest, re.DOTALL)
    block = rest[: m.start()] if m else rest
    lines = []
    for line in block.splitlines():
        if line.strip().startswith("## ") and not line.strip().startswith("###"):
            break
        lines.append(line)
    return "\n".join(lines).strip()


def _parse_week_top3(text: str) -> dict:
    m = re.search(
        r"## 🎯 Top 3 This Week\s*\n+((?:\d+\.\s+.+\n?)+)",
        text,
    )
    out: list[dict] = []
    if not m:
        return {"priorities": out}
    block = m.group(1)
    for line in block.splitlines():
        line = line.strip()
        if not re.match(r"^\d+\.", line):
            continue
        tm = re.search(r"^\d+\.\s+\*\*([^*]+)\*\*", line)
        title = tm.group(1).strip() if tm else line
        task_ids = TASK_REF.findall(line)
        out.append({"title": title, "taskIds": task_ids})
    return {"priorities": out}


def _week_label(text: str) -> str:
    m = re.search(r"\*\*Week of:\*\*\s*(.+)", text)
    return m.group(1).strip() if m else ""


def _strip_frontmatter(raw: str) -> str:
    if raw.startswith("---"):
        parts = raw.split("---", 2)
        if len(parts) >= 3:
            return parts[2].lstrip("\n")
    return raw


def _parse_todays_focus_items(raw: str) -> list[dict]:
    """Numbered checklist lines with **title** and optional [[^task-id]]."""
    m = re.search(
        r"## [^\n]*Today.s Focus[^\n]*\n+(.*?)(?=\n## |$)",
        raw,
        re.DOTALL | re.IGNORECASE,
    )
    if not m:
        return []
    items = []
    for line in m.group(1).splitlines():
        line = line.strip()
        mo = re.match(
            r"^(\d+)\.\s+\[([ xXsSbB])\]\s+\*\*(.+?)\*\*",
            line,
        )
        if not mo:
            continue
        box = mo.group(2).lower()
        tid_m = TASK_REF.search(line)
        items.append(
            {
                "n": int(mo.group(1)),
                "box": box,
                "title": mo.group(3).strip(),
                "taskId": tid_m.group(1) if tid_m else None,
            }
        )
    return items


def _latest_daily_plan(vault: Path) -> dict:
    plans_dir = vault / "07-Archives" / "Plans"
    result: dict = {
        "doc": None,
        "date": None,
        "tldr": [],
        "markdown": "",
        "focusItems": [],
    }
    if not plans_dir.is_dir():
        return result
    mds = sorted(
        [p for p in plans_dir.glob("*.md") if p.name.upper() != "README.MD"],
        key=lambda p: p.name,
        reverse=True,
    )
    if not mds:
        return result
    p = mds[0]
    result["doc"] = str(p.relative_to(vault)).replace("\\", "/")
    result["date"] = p.stem
    raw = p.read_text(encoding="utf-8")
    body = _strip_frontmatter(raw)
    if len(body) > 28000:
        body = body[:28000] + "\n\n… *(truncated for embed)*"
    result["markdown"] = body
    result["focusItems"] = _parse_todays_focus_items(body)
    tldr_m = re.search(
        r"## TL;DR\s*\n+\s*((?:-[^\n]+\n?)+)",
        body,
        re.IGNORECASE,
    )
    if tldr_m:
        for ln in tldr_m.group(1).splitlines():
            ln = ln.strip()
            if ln.startswith("- "):
                result["tldr"].append(ln[2:].strip())
    return result


def _build_exco_context(launch_path: Path) -> dict:
    exco: dict = {
        "launchDoc": "04-Projects/Wyzetalk_Essential_Launch.md",
        "productLabel": "Wyzetalk Essential",
        "elevator": "",
        "whyItMatters": "",
        "milestones": [],
        "migrationProgram": [],
        "nowThemes": [],
        "thenLayers": [],
        "q2PhasingNote": "",
    }
    if not launch_path.is_file():
        return exco
    text = launch_path.read_text(encoding="utf-8")

    el_block = _extract_section_lines(text, "## Elevator pitch", r"\n---")
    if el_block:
        paras = [p.strip() for p in el_block.split("\n\n") if p.strip() and not p.strip().startswith("#")]
        exco["elevator"] = paras[0] if paras else el_block[:800]
        exco["whyItMatters"] = paras[1] if len(paras) > 1 else ""

    for row in _extract_table_after_heading(text, "## Milestones"):
        if len(row) >= 3 and row[0] and not row[0].startswith("Field"):
            exco["milestones"].append(
                {"name": row[0], "target": row[1], "status": row[2]}
            )

    for row in _extract_table_after_heading(
        text, "### Migration program milestones (execution)"
    ):
        if len(row) >= 3:
            exco["migrationProgram"].append(
                {"name": row[0], "target": row[1], "notes": row[2][:220]}
            )

    for row in _extract_table_after_heading(text, "### Now (through Essential GA + Q2)"):
        if len(row) >= 2 and row[0] and "**" in row[0]:
            theme = re.sub(r"\*\*(.+?)\*\*", r"\1", row[0])
            exco["nowThemes"].append({"theme": theme, "intent": row[1][:300]})

    for row in _extract_table_after_heading(text, "### Then (H2 → end of year)"):
        if len(row) >= 2 and row[0]:
            layer = re.sub(r"\*\*(.+?)\*\*", r"\1", row[0])
            exco["thenLayers"].append({"layer": layer, "what": row[1][:280]})

    q2_note = re.search(
        r"\| \*\*2026 Q2\*\*.*?\|(.+?)\|",
        text,
    )
    if q2_note:
        exco["q2PhasingNote"] = (
            "Q2 migration cohort (from launch doc): " + q2_note.group(1).strip()
        )

    return exco


def build_dashboard_context(vault_root: Path | None = None) -> dict:
    root = vault_root or VAULT_ROOT
    qpath = root / "01-Quarter_Goals" / "Quarter_Goals.md"
    wpath = root / "02-Week_Priorities" / "Week_Priorities.md"
    launch_path = root / "04-Projects" / "Wyzetalk_Essential_Launch.md"
    pillars_path = root / "System" / "pillars.yaml"

    pillars = _parse_pillars_yaml(pillars_path)

    quarter: dict = {
        "doc": "01-Quarter_Goals/Quarter_Goals.md",
        "theme": "",
        "outcomes": [],
    }
    roadmap_q2: list[dict] = []

    if qpath.is_file():
        qtext = qpath.read_text(encoding="utf-8")
        tm = re.search(
            r"## Q1 2026[^\n]*\n+\*\*Theme:\*\*\s*(.+)",
            qtext,
        )
        if tm:
            quarter["theme"] = tm.group(1).strip()
        q1_rows = _extract_table_after_heading(qtext, "## Q1 2026")
        for row in q1_rows:
            if len(row) >= 3:
                quarter["outcomes"].append(
                    {"outcome": row[0], "status": row[1], "notes": row[2]}
                )
            elif len(row) == 2:
                quarter["outcomes"].append(
                    {"outcome": row[0], "status": row[1], "notes": ""}
                )

        q2_rows = _extract_table_after_heading(qtext, "## Q2 2026")
        for row in q2_rows:
            if len(row) >= 3 and row[0].isdigit():
                roadmap_q2.append(
                    {
                        "num": row[0],
                        "goal": re.sub(r"\*\*(.+?)\*\*", r"\1", row[1]),
                        "success": row[2],
                    }
                )

    week: dict = {
        "doc": "02-Week_Priorities/Week_Priorities.md",
        "weekLabel": "",
        "priorities": [],
    }
    if wpath.is_file():
        wtext = wpath.read_text(encoding="utf-8")
        week["weekLabel"] = _week_label(wtext)
        week.update(_parse_week_top3(wtext))

    return {
        "schemaVersion": "1.1.0",
        "generated": date.today().isoformat(),
        "pillars": pillars,
        "quarter": quarter,
        "week": week,
        "roadmap": {
            "launchDoc": "04-Projects/Wyzetalk_Essential_Launch.md",
            "anchor": "04-Projects/Wyzetalk_Essential_Launch.md#product-roadmap--now--then-2026",
            "q2Goals": roadmap_q2,
        },
        "dailyPlan": _latest_daily_plan(root),
        "exco": _build_exco_context(launch_path),
    }


def main() -> int:
    ctx = build_dashboard_context()
    OUTPUT.write_text(
        json.dumps(ctx, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print("Wrote", OUTPUT)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""
Serve the Kanban UI and persist board state to:
  - work-items.json
  - 03-Tasks/Tasks.md (checkboxes from Kanban status)

Run from the vault (or anywhere): python3 workboard_server.py
Open http://127.0.0.1:8765/

Requires: no extra deps (stdlib only).
"""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import date
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
# workboard -> Dex_System -> 06-Resources -> vault root (Dex)
VAULT_ROOT = HERE.parent.parent.parent
TASKS_MD = VAULT_ROOT / "03-Tasks" / "Tasks.md"
WORK_ITEMS = HERE / "work-items.json"
BUILD_INDEX = HERE / "build_index.py"

TASKS_MD_FOOTER = """---

## Task Format

```
- [ ] **Task title** — Context or notes #pillar
- [s] Started task
- [b] Blocked task (note blocker)
- [x] Completed task
```

## Pillars

Tasks should align to your strategic pillars (configured during `/setup`).
"""


def normalize_status(s: str) -> str:
    m = {
        "open": "todo",
        "started": "in_progress",
        "blocked": "on_hold",
        "todo": "todo",
        "on_hold": "on_hold",
        "in_progress": "in_progress",
        "done": "done",
    }
    return m.get(s, "todo")


def status_to_checkbox(st: str) -> str:
    st = normalize_status(st)
    return {
        "todo": "[ ]",
        "in_progress": "[s]",
        "on_hold": "[b]",
        "done": "[x]",
    }.get(st, "[ ]")


def render_tasks_md(board: dict) -> str:
    items = list(board.get("items") or [])
    p2 = [i for i in items if i.get("priorityBand") != "P3"]
    p3 = [i for i in items if i.get("priorityBand") == "P3"]
    p2.sort(key=lambda x: -int(x.get("rankScore") or 0))
    p3.sort(key=lambda x: -int(x.get("rankScore") or 0))

    lines = [
        "# Tasks",
        "",
        "Your task backlog organized by priority.",
        "",
        "## This Week",
        "",
        "<!-- Tasks promoted to this week's focus -->",
        "",
        "## P0 - Urgent (max 3)",
        "",
        "<!-- Critical items that must be done today/tomorrow -->",
        "",
        "## P1 - Important (max 5)",
        "",
        "<!-- Important items for this week -->",
        "",
        "## P2 - Normal (max 10)",
        "",
        "<!-- Standard priority items -->",
        "",
    ]
    for it in p2:
        lines.append(task_line(it))
    lines.extend(
        [
            "",
            "## P3 - Backlog",
            "",
            "<!-- Lower priority items, someday/maybe -->",
            "",
        ]
    )
    for it in p3:
        lines.append(task_line(it))
    lines.append("")
    lines.append(TASKS_MD_FOOTER.rstrip())
    lines.append("")
    return "\n".join(lines)


def task_line(item: dict) -> str:
    box = status_to_checkbox(item.get("status", "todo"))
    title = (item.get("title") or "").strip()
    summary = (item.get("summary") or "").strip()
    tid = item.get("id") or ""
    if tid and not tid.startswith("task-"):
        tid = f"task-{tid}"
    pillar = (item.get("pillar") or "").strip()
    line = f"- {box} **{title}**"
    if summary:
        line += f" — {summary}"
    if tid:
        line += f" [[^{tid}]]"
    if pillar:
        line += f" # {pillar}"
    return line


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(HERE), **kwargs)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors()
        self.end_headers()

    def send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors()
            self.end_headers()
            self.wfile.write(
                json.dumps(
                    {"ok": True, "sync": True, "tasks_md": str(TASKS_MD)}
                ).encode()
            )
            return
        return super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != "/api/save":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length)
        try:
            board = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_cors()
            self.end_headers()
            self.wfile.write(b'{"error":"invalid json"}')
            return

        if "items" not in board:
            self.send_response(400)
            self.send_cors()
            self.end_headers()
            self.wfile.write(b'{"error":"missing items"}')
            return

        board["schemaVersion"] = board.get("schemaVersion") or "1.1.0"
        board["updated"] = date.today().isoformat()

        for it in board["items"]:
            it["status"] = normalize_status(it.get("status", "todo"))

        WORK_ITEMS.write_text(
            json.dumps(board, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        TASKS_MD.write_text(render_tasks_md(board), encoding="utf-8")

        if BUILD_INDEX.exists():
            try:
                subprocess.run(
                    [sys.executable, str(BUILD_INDEX)],
                    cwd=str(HERE),
                    check=False,
                    capture_output=True,
                    timeout=30,
                )
            except OSError:
                pass

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_cors()
        self.end_headers()
        self.wfile.write(
            json.dumps({"ok": True, "wrote": str(TASKS_MD), "updated": board["updated"]}).encode()
        )


def main():
    host = "127.0.0.1"
    port = 8765
    if not TASKS_MD.parent.is_dir():
        print("Warning: 03-Tasks/ not found at", TASKS_MD.parent, file=sys.stderr)
    print("Kanban + sync: http://%s:%s/" % (host, port))
    print("Writes:", WORK_ITEMS)
    print("Writes:", TASKS_MD)
    HTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    main()

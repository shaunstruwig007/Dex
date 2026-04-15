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
import re
import subprocess
import sys
from datetime import date, datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

HERE = Path(__file__).resolve().parent
# workboard -> Dex_System -> vault root (Dex)
VAULT_ROOT = HERE.parent.parent.resolve()
TASKS_MD = VAULT_ROOT / "03-Tasks" / "Tasks.md"
WORK_ITEMS = HERE / "work-items.json"
BUILD_INDEX = HERE / "build_index.py"
PRD_BACKUP_DIR = HERE / "prd-backups"
FUTURE_PRD_DIR = VAULT_ROOT / "06-Resources" / "PRDs" / "Future"
FUTURE_CREATED_MANIFEST = HERE / "future-roadmap-created.json"

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


def safe_vault_md_path(rel: str) -> Path | None:
    """Resolve vault-relative path; only `.md` under VAULT_ROOT."""
    if not rel or not isinstance(rel, str):
        return None
    rel = unquote(rel.strip()).lstrip("/").replace("\\", "/")
    if not rel or ".." in rel.split("/"):
        return None
    candidate = (VAULT_ROOT / rel).resolve()
    try:
        candidate.relative_to(VAULT_ROOT)
    except ValueError:
        return None
    if not candidate.suffix.lower() == ".md":
        return None
    return candidate


def backup_prd_file(target: Path) -> Path | None:
    """Copy current file into prd-backups/ before overwrite. Returns backup path or None."""
    if not target.is_file():
        return None
    PRD_BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    rel = target.relative_to(VAULT_ROOT)
    safe = str(rel).replace("/", "__")
    ts = datetime.now().strftime("%Y%m%dT%H%M%S")
    bak = PRD_BACKUP_DIR / f"{safe}.{ts}.bak"
    bak.write_bytes(target.read_bytes())
    return bak


def future_md_filename_stem(heading: str) -> str:
    """Pascal_Snake.md stem from a human title (matches existing Future/*.md style)."""
    words = re.findall(r"[A-Za-z0-9]+", heading.strip())
    if not words:
        return "Future_theme"
    parts: list[str] = []
    for w in words[:12]:
        parts.append(w[0].upper() + w[1:].lower() if len(w) > 1 else w.upper())
    return "_".join(parts)


def unique_future_prd_path(heading: str) -> Path:
    stem = future_md_filename_stem(heading)
    candidate = FUTURE_PRD_DIR / f"{stem}.md"
    if not candidate.is_file():
        return candidate
    for i in range(2, 200):
        alt = FUTURE_PRD_DIR / f"{stem}_{i}.md"
        if not alt.is_file():
            return alt
    return FUTURE_PRD_DIR / f"{stem}_{datetime.now().strftime('%H%M%S')}.md"


def build_future_discovery_stub_md(heading: str, description: str, target: Path) -> str:
    """Match Future discovery PRD shape (hypothesis, scope bullets, related specs, deps, questions)."""
    rel = str(target.relative_to(VAULT_ROOT)).replace("\\", "/")
    fname = target.name
    desc = (description or "").strip()
    if not desc:
        desc = "_Working hypothesis to be refined._"
    return f"""# Discovery — {heading}

> **Status:** Pre-PRD discovery stub · **Phase:** Future (post–Essential GA)  
> **Doc path:** `{rel}`

## Hypothesis

{desc}

## Scope indicators (to validate)

- _TBD_

## Related specs

- _Add links to [Next/](../Next/) or [Current/](../Current/) PRDs when this theme connects to shipped or stub specs._
- This theme file: [{fname}](./{fname})

## Dependencies

- _TBD_

## Open questions

- _TBD_

---

*Created via workboard · See [README.md](./README.md) for promote path.*
"""


def load_future_created_manifest() -> dict:
    if not FUTURE_CREATED_MANIFEST.is_file():
        return {"schemaVersion": "1.0.0", "items": []}
    try:
        data = json.loads(FUTURE_CREATED_MANIFEST.read_text(encoding="utf-8"))
        if not isinstance(data.get("items"), list):
            data["items"] = []
        return data
    except (json.JSONDecodeError, OSError):
        return {"schemaVersion": "1.0.0", "items": []}


def save_future_created_manifest(data: dict) -> None:
    FUTURE_CREATED_MANIFEST.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def latest_prd_backup(target: Path) -> Path | None:
    """Newest backup file for this vault path, or None."""
    if not PRD_BACKUP_DIR.is_dir():
        return None
    rel = target.relative_to(VAULT_ROOT)
    safe = str(rel).replace("/", "__") + "."
    candidates = sorted(
        [p for p in PRD_BACKUP_DIR.iterdir() if p.is_file() and p.name.startswith(safe) and p.suffix == ".bak"],
        key=lambda p: p.name,
        reverse=True,
    )
    return candidates[0] if candidates else None


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
                    {
                        "ok": True,
                        "sync": True,
                        "tasks_md": str(TASKS_MD),
                        # Bump when new POST/GET API routes ship — UI warns if missing (stale long-running process).
                        "features": {
                            "prdCreate": True,
                            "prdSave": True,
                            "apiRevision": 2,
                        },
                    }
                ).encode()
            )
            return
        if parsed.path == "/api/prd":
            qs = parse_qs(parsed.query or "")
            rel_raw = (qs.get("path") or [""])[0]
            vp = safe_vault_md_path(rel_raw)
            if not vp:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": "invalid path"}).encode())
                return
            content = ""
            exists = vp.is_file()
            if exists:
                content = vp.read_text(encoding="utf-8", errors="replace")
            rel_out = str(vp.relative_to(VAULT_ROOT)).replace("\\", "/")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors()
            self.end_headers()
            self.wfile.write(
                json.dumps(
                    {
                        "ok": True,
                        "path": rel_out,
                        "exists": exists,
                        "content": content,
                    },
                    ensure_ascii=False,
                ).encode("utf-8")
            )
            return
        if parsed.path == "/api/prd/future-created":
            man = load_future_created_manifest()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors()
            self.end_headers()
            self.wfile.write(
                json.dumps({"ok": True, "items": man.get("items") or []}, ensure_ascii=False).encode("utf-8")
            )
            return
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/prd/create":
            length = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(length)
            try:
                body = json.loads(raw.decode("utf-8"))
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": "invalid json"}).encode())
                return
            heading = (body.get("heading") or "").strip()
            if not heading:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": "heading required"}).encode())
                return
            description = (body.get("description") or "").strip()
            try:
                FUTURE_PRD_DIR.mkdir(parents=True, exist_ok=True)
                target = unique_future_prd_path(heading)
                md = build_future_discovery_stub_md(heading, description, target)
                target.write_text(md, encoding="utf-8", newline="\n")
                rel_path = str(target.relative_to(VAULT_ROOT)).replace("\\", "/")
                roadmap_id = "rm-fut-created-" + str(int(datetime.now().timestamp() * 1000))
                item = {
                    "roadmapId": roadmap_id,
                    "prdPath": rel_path,
                    "title": heading,
                    "summary": description,
                    "createdAt": datetime.now().isoformat(timespec="seconds"),
                }
                man = load_future_created_manifest()
                man.setdefault("items", []).append(item)
                save_future_created_manifest(man)
            except (OSError, ValueError) as ex:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": str(ex)}).encode())
                return
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors()
            self.end_headers()
            self.wfile.write(json.dumps({"ok": True, "path": rel_path, "item": item}, ensure_ascii=False).encode("utf-8"))
            return

        if parsed.path == "/api/prd/rollback":
            length = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(length)
            try:
                body = json.loads(raw.decode("utf-8"))
            except json.JSONDecodeError:
                body = {}
            rel = (body.get("path") or "").strip()
            vp = safe_vault_md_path(rel)
            if not vp:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": "invalid path"}).encode())
                return
            bak = latest_prd_backup(vp)
            if not bak or not bak.is_file():
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": "no backup"}).encode())
                return
            vp.write_bytes(bak.read_bytes())
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors()
            self.end_headers()
            self.wfile.write(
                json.dumps(
                    {
                        "ok": True,
                        "path": str(vp.relative_to(VAULT_ROOT)).replace("\\", "/"),
                        "restoredFrom": bak.name,
                    },
                    ensure_ascii=False,
                ).encode("utf-8")
            )
            return

        if parsed.path == "/api/prd":
            length = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(length)
            try:
                body = json.loads(raw.decode("utf-8"))
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_cors()
                self.end_headers()
                self.wfile.write(b'{"ok":false,"error":"invalid json"}')
                return
            rel = (body.get("path") or "").strip()
            content = body.get("content")
            if content is None or not isinstance(content, str):
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": "missing content"}).encode())
                return
            vp = safe_vault_md_path(rel)
            if not vp:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": "invalid path"}).encode())
                return
            vp.parent.mkdir(parents=True, exist_ok=True)
            if vp.is_file():
                backup_prd_file(vp)
            vp.write_text(content, encoding="utf-8", newline="\n")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors()
            self.end_headers()
            self.wfile.write(
                json.dumps(
                    {"ok": True, "path": str(vp.relative_to(VAULT_ROOT)).replace("\\", "/")},
                    ensure_ascii=False,
                ).encode("utf-8")
            )
            return

        if parsed.path != "/api/save":
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
            sl = it.get("swimLane")
            it["swimLane"] = "daily" if sl == "daily" else "main"

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
    print("PRD API: GET/POST /api/prd, POST /api/prd/rollback, POST /api/prd/create, GET /api/prd/future-created")
    print("PRD backups:", PRD_BACKUP_DIR, "| Created Future manifest:", FUTURE_CREATED_MANIFEST)
    print(
        "\n  Tip: After a Dex update, if Future PRDs or Save stop working, Ctrl+C here and\n"
        "       run ./start_workboard.sh (or double-click Start_Dex_Workboard.command).\n",
        file=sys.stderr,
    )
    HTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    main()

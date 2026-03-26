# Work board (Kanban)

## Automatic sync to `03-Tasks/Tasks.md`

Run the **workboard server** (not plain `http.server`):

```bash
cd "/path/to/Dex/06-Resources/Dex_System/workboard"
python3 workboard_server.py
```

Open **http://127.0.0.1:8765/**

When the header says **“Connected — each drop saves…”**, dragging a card to another column will:

1. Update **`work-items.json`**
2. Regenerate **`03-Tasks/Tasks.md`** (checkboxes: `[ ]` todo, `[s]` in progress, `[b]` on hold, `[x]` done)
3. Run **`build_index.py`** so `index.html`’s embedded JSON stays aligned

No need to edit `Tasks.md` by hand for status changes.

**If you use** `python3 -m http.server` **or** open `index.html` via `file://`, the UI runs in **offline** mode (localStorage only). Use `workboard_server.py` for vault sync.

---

## Files

| File | Purpose |
|------|--------|
| `workboard_server.py` | **HTTP server** — static files + `POST /api/save` → JSON + Tasks.md |
| `work-items.json` | Board data (source for generator) |
| `work-items.schema.json` | JSON Schema |
| `index.html` | UI (embedded JSON for offline) |
| `build_index.py` | Embeds `work-items.json` into `index.html` |

---

## Kanban columns → `Tasks.md`

| Column | `status` in JSON | Checkbox |
|--------|------------------|----------|
| To do | `todo` | `- [ ]` |
| On hold | `on_hold` | `- [b]` |
| In progress | `in_progress` | `- [s]` |
| Done | `done` | `- [x]` |

**Sections:** `priorityBand` **P3** → P3 - Backlog; everything else → P2 - Normal. Sorted by `rankScore` (high first).

---

## Priority rank

See the in-page explainer. Edit **`rankScore`** in `work-items.json` to change ordering.

---

## PRDs later

Same `items[]` can drive PRD slices (`kind: "prd"`). Export JSON and open via this server.

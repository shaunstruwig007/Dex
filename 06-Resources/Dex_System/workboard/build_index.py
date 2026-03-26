#!/usr/bin/env python3
"""Regenerate index.html with embedded work-items.json — run after editing JSON."""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
data = json.load(open(HERE / "work-items.json"))
embed = json.dumps(data, separators=(",", ":"))

HTML = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Work board — Kanban — Dex</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #0a0d12;
      --surface: #121820;
      --card: #141a24;
      --border: #2a3441;
      --text: #e8eaef;
      --muted: #8b95a5;
      --accent: #d4a574;
      --accent-dim: rgba(212, 165, 116, 0.12);
      --green: #6bcf8e;
      --amber: #e8b84a;
      --blue: #7eb8ff;
      --col-todo: #74c0fc;
      --col-hold: #e8b84a;
      --col-doing: #a78bfa;
      --col-done: #6bcf8e;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Instrument Sans", system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.4;
      font-size: 15px;
    }
    .layout { max-width: 1600px; margin: 0 auto; padding: 1.25rem 1rem 3rem; }
    header { margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
    header h1 { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
    header .sub { color: var(--muted); font-size: 0.88rem; }
    .toolbar {
      display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;
      margin-bottom: 0.75rem; font-size: 0.82rem;
    }
    .toolbar button {
      background: var(--surface); border: 1px solid var(--border); color: var(--muted);
      font-family: inherit; font-size: 0.82rem; padding: 0.35rem 0.65rem; border-radius: 6px; cursor: pointer;
    }
    .toolbar button:hover { color: var(--text); border-color: var(--muted); }
    details.explainer {
      margin-bottom: 1rem; background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; padding: 0.6rem 1rem;
    }
    details.explainer summary {
      cursor: pointer; font-weight: 600; color: var(--accent); font-size: 0.9rem;
      list-style: none; display: flex; align-items: center; gap: 0.5rem;
    }
    details.explainer summary::-webkit-details-marker { display: none; }
    details.explainer summary::before { content: "▸"; font-size: 0.75rem; transition: transform 0.15s; }
    details.explainer[open] summary::before { transform: rotate(90deg); }
    .explainer-body {
      margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border);
      font-size: 0.88rem; color: #c5cad3; line-height: 1.55;
    }
    .explainer-body p { margin: 0 0 0.65rem; }
    .explainer-body strong { color: var(--text); }
    .kanban {
      display: flex; gap: 0.75rem; align-items: stretch;
      overflow-x: auto; padding-bottom: 0.5rem;
      min-height: 420px;
    }
    .column {
      flex: 1; min-width: 220px; max-width: 320px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; display: flex; flex-direction: column;
      transition: background 0.15s, border-color 0.15s;
    }
    .column.drag-over { background: var(--accent-dim); border-color: var(--accent); }
    .column-head {
      padding: 0.65rem 0.75rem; border-bottom: 1px solid var(--border);
    }
    .column-head h2 { margin: 0; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
    .column-head .hint { font-size: 0.72rem; color: var(--muted); margin-top: 0.25rem; line-height: 1.35; }
    .column-head .count { float: right; font-size: 0.72rem; color: var(--muted); font-weight: 500; }
    .column-body {
      flex: 1; padding: 0.5rem; min-height: 200px;
      display: flex; flex-direction: column; gap: 0.45rem;
    }
    .card {
      background: var(--card); border: 1px solid var(--border); border-radius: 8px;
      padding: 0.45rem 0.5rem 0.5rem; cursor: grab;
      font-size: 0.8rem; transition: box-shadow 0.15s, border-color 0.15s;
    }
    .card:active { cursor: grabbing; }
    .card:hover { border-color: #3d4a5c; box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
    .card-top {
      display: flex; justify-content: space-between; align-items: flex-start; gap: 0.35rem;
      margin-bottom: 0.35rem;
    }
    .card-rank {
      font-family: "JetBrains Mono", monospace; font-weight: 600; font-size: 0.95rem;
      color: var(--accent); line-height: 1;
    }
    .card-rank span { font-size: 0.6rem; font-weight: 500; color: var(--muted); display: block; margin-top: 0.15rem; }
    .card-status-pill {
      font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
      padding: 0.15rem 0.35rem; border-radius: 4px; white-space: nowrap;
    }
    .card h3 { margin: 0 0 0.25rem; font-size: 0.82rem; font-weight: 600; line-height: 1.3; letter-spacing: -0.01em; }
    .card .desc {
      color: #aeb4bf; font-size: 0.76rem; line-height: 1.35;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-expand {
      margin-top: 0.35rem; padding: 0; border: none; background: none;
      color: var(--blue); font-size: 0.7rem; font-family: inherit; cursor: pointer;
      text-align: left; width: 100%;
    }
    .card-expand:hover { text-decoration: underline; }
    .card-details {
      display: none; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border);
      font-size: 0.74rem; color: #c5cad3;
    }
    .card.open .card-details { display: block; }
    .card.open .desc { -webkit-line-clamp: unset; }
    .card-details .next { margin-bottom: 0.45rem; padding-left: 0.5rem; border-left: 2px solid var(--accent); }
    .card-details .next strong { color: var(--accent); }
    .tags { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.35rem; }
    .tag { font-size: 0.65rem; background: var(--bg); color: var(--muted); padding: 0.1rem 0.35rem; border-radius: 3px; }
    .links { margin-top: 0.35rem; font-family: "JetBrains Mono", monospace; font-size: 0.68rem; }
    .links a { color: var(--blue); text-decoration: none; display: block; word-break: break-all; margin-top: 0.2rem; }
    .links a:hover { text-decoration: underline; }
    .card-id { font-family: "JetBrains Mono", monospace; font-size: 0.62rem; color: var(--muted); margin-top: 0.35rem; }
    footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.75rem; color: var(--muted); }
    .error { background: rgba(255,107,107,0.12); border: 1px solid rgba(255,107,107,0.35); color: #ffb4b4; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; }
    .toast { font-size: 0.85rem; color: var(--green); margin: 0 0 0.75rem; padding: 0.4rem 0.65rem; background: rgba(107,207,142,0.12); border-radius: 6px; border: 1px solid rgba(107,207,142,0.35); }
    @media (max-width: 900px) {
      .column { min-width: 200px; }
    }
  </style>
</head>
<body>
  <div class="layout">
    <header>
      <h1 id="boardTitle">Work board</h1>
      <p class="sub" id="boardMeta">Loading…</p>
    </header>
    <div class="error" id="err" hidden></div>
    <div class="toolbar">
      <span id="toolbarHint" style="color:var(--muted);font-size:0.82rem;">Checking sync…</span>
      <button type="button" id="btnReset" title="Reload board from disk (discards unsaved local overrides when offline)">Reload from disk</button>
    </div>
    <p id="toast" class="toast" hidden></p>
    <details class="explainer" open>
      <summary>How to read priority rank</summary>
      <div class="explainer-body">
        <p><strong>Priority rank</strong> is a number from <strong>1–100</strong>. Think of it as a gentle sort order, not a grade.</p>
        <p><strong>Higher = worth doing sooner</strong> when you scan the board. Cards in the same column are ordered with the highest rank at the top — so if everything feels urgent, the number helps you pick what to pull next without overthinking.</p>
        <p><strong>Priority band</strong> (P0–P3 on each card) is the rough bucket: P0 “drop everything” through P3 “backlog.” <strong>Rank</strong> fine-tunes order <em>inside</em> your workflow.</p>
        <p>If two items feel equally important, trust the higher rank first — or drag one to <strong>In progress</strong> when you actually start it. You can always tweak ranks in <code>work-items.json</code> later.</p>
      </div>
    </details>
    <div class="kanban" id="kanban" aria-label="Kanban board"></div>
    <footer>
      <strong>Recommended:</strong> <code>python3 workboard_server.py</code> — drag updates <code>work-items.json</code> and <code>03-Tasks/Tasks.md</code> automatically.
      Offline: use <code>python3 -m http.server 8765</code> (JSON only; or embedded <code>file://</code> with localStorage fallback).
    </footer>
  </div>
  <script type="application/json" id="embedded-board">__EMBED__</script>
  <script>
(function () {
  var STORAGE_KEY = "dex-workboard-kanban-v1";
  var serverSync = false;
  var boardState = null;
  var COLUMNS = [
    { id: "todo", title: "To do", hint: "Queued — not started, or waiting your attention.", color: "var(--col-todo)" },
    { id: "on_hold", title: "On hold", hint: "Paused — missing info, blocked, or not now.", color: "var(--col-hold)" },
    { id: "in_progress", title: "In progress", hint: "You are actively working on this.", color: "var(--col-doing)" },
    { id: "done", title: "Done", hint: "Shipped, decided, or no longer active.", color: "var(--col-done)" }
  ];

  function normalizeStatus(s) {
    var m = {
      open: "todo", started: "in_progress", blocked: "on_hold", done: "done",
      todo: "todo", on_hold: "on_hold", in_progress: "in_progress"
    };
    return m[s] || "todo";
  }

  function loadOverrides() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) { return {}; }
  }

  function saveOverrides(o) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(o)); } catch (e) {}
  }

  function updateToolbarHint() {
    var el = document.getElementById("toolbarHint");
    if (!el) return;
    if (serverSync) {
      el.textContent = "Connected — each drop saves work-items.json and 03-Tasks/Tasks.md.";
    } else {
      el.textContent = "Offline — drag state in localStorage only. Run: python3 workboard_server.py";
    }
  }

  function showToast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { t.hidden = true; }, 5000);
  }

  function loadBoard(cb) {
    function use(data) {
      if (!serverSync) {
        var ov = loadOverrides();
        (data.items || []).forEach(function (item) {
          item.status = normalizeStatus(ov[item.id] !== undefined ? ov[item.id] : item.status);
        });
      } else {
        (data.items || []).forEach(function (item) {
          item.status = normalizeStatus(item.status);
        });
      }
      boardState = JSON.parse(JSON.stringify(data));
      cb(data);
    }
    fetch("work-items.json", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(use)
      .catch(function () {
        var el = document.getElementById("embedded-board");
        use(JSON.parse(el.textContent.trim()));
      });
  }

  function statusLabel(id) {
    var c = COLUMNS.find(function (x) { return x.id === id; });
    return c ? c.title : id;
  }

  function render(board) {
    document.getElementById("boardTitle").textContent = board.title || "Work board";
    var meta = "Updated " + (board.updated || "—");
    if (serverSync) {
      meta += " · vault sync on";
    } else {
      meta += " · local overrides: " + (Object.keys(loadOverrides()).length ? "yes" : "no");
    }
    document.getElementById("boardMeta").textContent = meta;

    var items = (board.items || []).slice();
    var byCol = { todo: [], on_hold: [], in_progress: [], done: [] };
    items.forEach(function (item) {
      var st = normalizeStatus(item.status);
      if (!byCol[st]) st = "todo";
      byCol[st].push(item);
    });
    Object.keys(byCol).forEach(function (k) {
      byCol[k].sort(function (a, b) { return b.rankScore - a.rankScore; });
    });

    var root = document.getElementById("kanban");
    root.innerHTML = "";

    if (!window.__dexKanbanDnd) {
      window.__dexKanbanDnd = true;
      root.addEventListener("dragover", function (e) {
        e.preventDefault();
        var col = e.target.closest(".column");
        root.querySelectorAll(".column").forEach(function (c) {
          c.classList.toggle("drag-over", c === col);
        });
      });
      root.addEventListener("drop", function (e) {
        e.preventDefault();
        root.querySelectorAll(".column").forEach(function (c) { c.classList.remove("drag-over"); });
        var col = e.target.closest(".column");
        if (!col) return;
        var id = e.dataTransfer.getData("text/plain");
        if (!id) return;
        var newStatus = col.dataset.status;
        if (serverSync && boardState && boardState.items) {
          var it = boardState.items.find(function (x) { return x.id === id; });
          if (it) it.status = newStatus;
          fetch("/api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(boardState)
          })
            .then(function (r) {
              if (!r.ok) throw new Error("save failed");
              return r.json();
            })
            .then(function () {
              showToast("Saved — 03-Tasks/Tasks.md updated.");
              loadBoard(render);
            })
            .catch(function () {
              showToast("Server save failed — using offline storage for this move.");
              var ov = loadOverrides();
              ov[id] = newStatus;
              saveOverrides(ov);
              loadBoard(render);
            });
        } else {
          var ov = loadOverrides();
          ov[id] = newStatus;
          saveOverrides(ov);
          loadBoard(render);
        }
      });
    }

    COLUMNS.forEach(function (col) {
      var wrap = document.createElement("section");
      wrap.className = "column";
      wrap.dataset.status = col.id;
      wrap.setAttribute("aria-label", col.title);

      var head = document.createElement("div");
      head.className = "column-head";
      head.innerHTML =
        '<span class="count">' + byCol[col.id].length + "</span>" +
        "<h2 style=\"color:" + col.color + "\">" + col.title + "</h2>" +
        '<div class="hint">' + col.hint + "</div>";
      wrap.appendChild(head);

      var body = document.createElement("div");
      body.className = "column-body";

      byCol[col.id].forEach(function (item) {
        body.appendChild(renderCard(item));
      });

      wrap.appendChild(body);
      root.appendChild(wrap);
    });
  }

  function renderCard(item) {
    var card = document.createElement("article");
    card.className = "card";
    card.draggable = true;
    card.dataset.id = item.id;
    card.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", item.id);
      e.dataTransfer.effectAllowed = "move";
    });

    var top = document.createElement("div");
    top.className = "card-top";
    var rank = document.createElement("div");
    rank.className = "card-rank";
    rank.innerHTML = item.rankScore + '<span>priority</span>';
    var meta = document.createElement("div");
    meta.style.cssText = "display:flex;flex-direction:column;align-items:flex-end;gap:0.2rem;";
    var band = document.createElement("span");
    band.className = "card-status-pill";
    band.style.background = "rgba(116,192,252,0.15)";
    band.style.color = "#91d5ff";
    band.textContent = item.priorityBand || "—";
    var stEl = document.createElement("span");
    stEl.className = "card-status-pill";
    stEl.style.background = "rgba(167,139,250,0.15)";
    stEl.style.color = "#c4b5fd";
    stEl.textContent = statusLabel(normalizeStatus(item.status));
    meta.appendChild(band);
    meta.appendChild(stEl);
    top.appendChild(rank);
    top.appendChild(meta);

    var h3 = document.createElement("h3");
    h3.textContent = item.title;

    var desc = document.createElement("div");
    desc.className = "desc";
    desc.textContent = item.summary || "";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card-expand";
    btn.draggable = false;
    btn.textContent = "▸ More details";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = card.classList.toggle("open");
      btn.textContent = open ? "▾ Hide details" : "▸ More details";
    });

    var det = document.createElement("div");
    det.className = "card-details";
    if (item.nextAction) {
      var nx = document.createElement("div");
      nx.className = "next";
      nx.innerHTML = "<strong>Next</strong> — " + escapeHtml(item.nextAction);
      det.appendChild(nx);
    }
    if (item.tags && item.tags.length) {
      var tags = document.createElement("div");
      tags.className = "tags";
      item.tags.forEach(function (t) {
        var s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tags.appendChild(s);
      });
      det.appendChild(tags);
    }
    if (item.links && item.links.length) {
      var links = document.createElement("div");
      links.className = "links";
      item.links.forEach(function (l) {
        var a = document.createElement("a");
        a.href = "#";
        a.textContent = l.label + " → " + l.href;
        a.addEventListener("click", function (ev) {
          ev.preventDefault();
          navigator.clipboard.writeText(l.href).catch(function () {});
        });
        links.appendChild(a);
      });
      det.appendChild(links);
    }
    var idl = document.createElement("div");
    idl.className = "card-id";
    idl.textContent = item.id + (item.pillar ? " · " + item.pillar : "");
    det.appendChild(idl);

    card.appendChild(top);
    card.appendChild(h3);
    card.appendChild(desc);
    card.appendChild(btn);
    card.appendChild(det);

    return card;
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  document.getElementById("btnReset").addEventListener("click", function () {
    if (serverSync) {
      localStorage.removeItem(STORAGE_KEY);
      loadBoard(render);
      return;
    }
    if (confirm("Clear offline column overrides and reload from work-items.json?")) {
      localStorage.removeItem(STORAGE_KEY);
      loadBoard(render);
    }
  });

  fetch("/api/health", { cache: "no-store" })
    .then(function (r) {
      serverSync = r.ok;
      updateToolbarHint();
      loadBoard(render);
    })
    .catch(function () {
      serverSync = false;
      updateToolbarHint();
      loadBoard(render);
    });
})();
  </script>
</body>
</html>
'''

out = HTML.replace("__EMBED__", embed)
(HERE / "index.html").write_text(out, encoding="utf-8")
print("Wrote index.html")

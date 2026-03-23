# Market intelligence workflow

## YouTube (venv)

```bash
cd /path/to/Dex
python3 -m venv .scripts/market-intelligence/.venv
.scripts/market-intelligence/.venv/bin/pip install -r .scripts/market-intelligence/requirements.txt
```

Single video:

```bash
.scripts/market-intelligence/.venv/bin/python .scripts/market-intelligence/fetch-youtube-transcript.py \
  --video-id "VIDEO_ID" --channel-slug "hr-leaders" --title "Episode title"
```

Batch: edit [video-queue.tsv](../../.scripts/market-intelligence/video-queue.tsv) then `bash .scripts/market-intelligence/run-transcript-queue.sh`

## Newsletters

Paste into `ingest/newsletters/<slug>/` using [_template_issue.md](./ingest/newsletters/_template_issue.md).

**Practical options (pick one):**

1. **RSS** — Subscribe in a reader (Feedly, NetNewsWire, etc.); open the article; copy the text or “reader view” into a new issue file.
2. **Newsletter “view in browser”** — Many sends include a web link; open it, then copy/save as markdown in the slug folder.
3. **Forward-to-self** — If your mail client supports “save as” or export, drop the result into `ingest/newsletters/<slug>/`.

Avoid granting broad mailbox MCP access unless you explicitly want it; RSS + paste keeps scope small.

## Daily signal brief

After ingest, run **intelligence-scanning** skill or copy [synthesis/daily/_template_daily_brief.md](./synthesis/daily/_template_daily_brief.md) → `YYYY-MM-DD_signal_brief.md`.

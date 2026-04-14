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

## RSS (automated newsletters)

**Before** pasting issues by hand, you can pull **RSS** into the vault:

1. Configure **`intel_feeds.json`** in this folder (see **`intel_feeds.example.json`**).
2. From the vault root (same venv as YouTube):

```bash
.scripts/market-intelligence/.venv/bin/python .scripts/market-intelligence/fetch_intel_rss.py
```

Outputs **`ingest/newsletters/<slug>/YYYY-MM-DD__title-slug__hash.md`** with YAML frontmatter (`source: rss`, URLs, dates, themes). State files: **`.intel_fetch_state.json`**, **`.intel_seen_urls.json`**.

**TLS / private feeds:** Use **`SSL_CERT_FILE`** (e.g. corporate CA bundle), optional **`intel_feeds.local.json`** or **`INTEL_FEEDS_FILE`** for signed URLs — see [.scripts/market-intelligence/README.md](../../.scripts/market-intelligence/README.md).

Then run **`/intelligence-scanning`** on new ingest.

**Weekly stakeholder pack (Product + Executive):** After ingest (or on a schedule — see `.scripts/market-intelligence/WEEKLY_AUTOMATION.md`), run **`/weekly-exec-intel`** and save output under **`synthesis/weekly/`** using the template there.

## Newsletters (manual)

Paste into `ingest/newsletters/<slug>/` using [_template_issue.md](./ingest/newsletters/_template_issue.md).

**Practical options (pick one):**

1. **RSS** — Subscribe in a reader (Feedly, NetNewsWire, etc.); open the article; copy the text or “reader view” into a new issue file.
2. **Newsletter “view in browser”** — Many sends include a web link; open it, then copy/save as markdown in the slug folder.
3. **Forward-to-self** — If your mail client supports “save as” or export, drop the result into `ingest/newsletters/<slug>/`.

Avoid granting broad mailbox MCP access unless you explicitly want it; RSS + paste keeps scope small.

## Where files go (slugs)

**Registry:** [sources_manifest.yaml](./sources_manifest.yaml) — every **`slug`** has a matching folder under **`ingest/youtube/<slug>/`** or **`ingest/newsletters/<slug>/`**.

**Human-readable map** (HR, employee engagement, AI, deskless, safety): [ingest/README.md](./ingest/README.md).

## Daily signal brief

After ingest, run **intelligence-scanning** skill or copy [synthesis/daily/_template_daily_brief.md](./synthesis/daily/_template_daily_brief.md) → `YYYY-MM-DD_signal_brief.md`.

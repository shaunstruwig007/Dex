# Market intelligence — YouTube transcripts + RSS newsletters

## Setup (once)

```bash
cd /path/to/Dex
python3 -m venv .scripts/market-intelligence/.venv
.scripts/market-intelligence/.venv/bin/pip install -r .scripts/market-intelligence/requirements.txt
```

## RSS → `ingest/newsletters/<slug>/` (optional)

1. Copy `06-Resources/Market_intelligence/intel_feeds.example.json` entries into **`intel_feeds.json`** (same folder). Each entry needs **`slug`** (folder under `ingest/newsletters/`), **`rss_url`**, optional **`max_items`** and **`tags`**.
2. From the vault root:

```bash
.scripts/market-intelligence/.venv/bin/python .scripts/market-intelligence/fetch_intel_rss.py
```

- **Window:** By default, fetches items **since the last run** (stored in `Market_intelligence/.intel_fetch_state.json`). First run uses the **last 7 days** (UTC).
- **Override:** `--since-days N` ignores state and uses the last *N* days.
- **Dedup:** Article URLs are tracked in `.intel_seen_urls.json` (and skipped if the output file already exists).
- **Dry run:** `--dry-run` prints what would be written.

Then run **`/intelligence-scanning`** so new markdown is folded into the daily brief.

### TLS / certificate errors (HTTPS feeds)

**Do not disable TLS verification.** Treat failures as a **trust store** problem:

1. **Python.org macOS install:** run **`/Applications/Python 3.x/Install Certificates.command`** once.
2. **Use `certifi`:** included in `requirements.txt`; `fetch_intel_rss.py` defaults HTTPS to **`certifi.where()`** unless you override (verification stays on).
3. **Corporate proxy / custom CA:** Point Python at a PEM bundle that includes your org’s roots (often IT provides a combined file):

   ```bash
   export SSL_CERT_FILE="/path/to/combined-ca-bundle.pem"
   ```

   Or set **`REQUESTS_CA_BUNDLE`** to the same path. The script prefers these over `certifi` when set.

4. **Scheduled jobs (cron / launchd):** Set **`SSL_CERT_FILE`** (and optionally **`INTEL_FEEDS_FILE`**) in the same environment as the job — see [WEEKLY_AUTOMATION.md](./WEEKLY_AUTOMATION.md).

### Feeds config and secrets

- **Tracked file:** `06-Resources/Market_intelligence/intel_feeds.json` — safe for **public** RSS URLs.
- **Private feeds / query tokens:** Put extra entries in **`intel_feeds.local.json`** (same shape as `feeds` array) — **gitignored**; merged after the main file. Or set **`INTEL_FEEDS_FILE`** / **`--feeds /path/to/private.json`** for a wholly private config (e.g. path only in your shell profile or launchd, not committed).
- **`.env`:** Already gitignored at repo root; you can `export` vars from a local loader before running the script — never commit API keys or signed URLs into JSON in the repo.

## Weekly automation (marketing → Product / Exec)

**One-shot (from vault root):**

```bash
bash .scripts/market-intelligence/run-weekly-intel-fetch.sh
```

Chains the venv + **`fetch_intel_rss.py`** (passes through args like `--since-days 10`). Use **`/weekly-exec-intel`** in Dex afterward to build **`synthesis/weekly/YYYY-MM-DD_weekly_exec_brief.md`**.

**Schedule (cron / launchd):** [WEEKLY_AUTOMATION.md](./WEEKLY_AUTOMATION.md)

## Single video

```bash
.scripts/market-intelligence/.venv/bin/python .scripts/market-intelligence/fetch-youtube-transcript.py \
  --video-id "VIDEO_ID" --channel-slug "josh-bersin" --title "Episode title"
```

Output: `06-Resources/Market_intelligence/ingest/youtube/<channel>/YYYY-MM-DD__slug__VIDEO_ID.md`

## Batch

Edit `video-queue.tsv` (tab-separated: `video_id`, `channel_slug`, `title`). Lines starting with `#` are skipped.

```bash
bash .scripts/market-intelligence/run-transcript-queue.sh
```

## API note

Uses `YouTubeTranscriptApi().fetch(video_id)` (current `youtube-transcript-api` pattern).

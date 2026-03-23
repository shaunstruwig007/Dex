# Market intelligence — YouTube transcripts

## Setup (once)

```bash
cd /path/to/Dex
python3 -m venv .scripts/market-intelligence/.venv
.scripts/market-intelligence/.venv/bin/pip install -r .scripts/market-intelligence/requirements.txt
```

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

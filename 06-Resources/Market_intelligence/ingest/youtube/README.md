# YouTube ingest

One **folder per channel** — folder name = **`slug`** in [`../sources_manifest.yaml`](../../sources_manifest.yaml) (see **[`../README.md`](../README.md)** for the full table: HR leaders, EX, AI, deskless, safety, product).

## What to scan for

- **HR / employee experience:** Josh Bersin, HR Leaders, HR Happy Hour, Workweek, WorkTrends
- **AI & future of work:** AI and the Future of Work, FlexOS Future Work, Lenny’s Podcast, Product Growth (Aakash)
- **Frontline & safety:** Safety of Work, mining-adjacent themes via other ingest
- **Product & PLG:** Lenny’s, Product Growth — for AI PM / B2B SaaS patterns

## Filename

`YYYY-MM-DD__short-title__VIDEO_ID.md`

Example: `2026-03-20__workday-sana-announcement-overview__c73njafYTRY.md`

## How transcripts get here

Scripts: [.scripts/market-intelligence/](../../../.scripts/market-intelligence/) — `fetch-youtube-transcript.py`, `video-queue.tsv`, venv in `.scripts/market-intelligence/.venv`.

Details: [WORKFLOW.md](../../WORKFLOW.md).

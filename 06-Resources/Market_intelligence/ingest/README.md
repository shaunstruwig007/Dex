# Ingest — where scans look first

**Purpose:** Drop **YouTube transcripts** and **newsletter / web article** markdown here so **`/intelligence-scanning`**, **`/daily-intelligence-brief`**, and **`/weekly-market-discovery`** can find them.

**Canonical registry:** Every slug below is defined in **[`../sources_manifest.yaml`](../sources_manifest.yaml)** (URLs, cadence, tags). **Folder name = `slug`** under `youtube/` or `newsletters/`.

**Themes we care about (Wyzetalk):** deskless / frontline, employee engagement & comms, HR tech & EX, **AI** (agents, automation, product), regulated industries (mining, energy), safety ops — plus **competitor** and **M&A** signals.

---

## YouTube — `ingest/youtube/<slug>/`

| Slug (folder) | Focus (scan for) | Manifest notes |
|---------------|-------------------|----------------|
| `josh-bersin` | Market, EX/HR, AI-work | Weekly; early signal |
| `hr-leaders` | CHRO interviews, EX-HR | Daily/weekly CHRO lens |
| `hr-happy-hour` | HR Tech Conference, vendor strategy | Market, EX-HR |
| `hr-huddle-wrkdefined` | M&A, HR Systems Survey | Market, Product |
| `ai-future-of-work` | AI agents, automation, frontline | AI-work, Product |
| `future-work-flexos` | AI, upskilling, hybrid | AI-work, EX-HR |
| `safety-of-work` | Safety science → ops | Frontline-safety |
| `workweek-i-hate-it-here` | Mid-market HR, adoption | EX-HR |
| `worktrends-talentculture` | Workforce tech, engagement | EX-HR, AI-work |
| `lennys-podcast` | Product strategy, AI in product | Product, AI-work |
| `product-growth-aakash` | PLG, B2B SaaS, AI PM | Product, AI-work |

**Filename convention:** `YYYY-MM-DD__short-title__VIDEO_ID.md` — see [youtube/README.md](./youtube/README.md).

**Scripts:** [.scripts/market-intelligence/](../../../.scripts/market-intelligence/) — `fetch-youtube-transcript.py`, `video-queue.tsv`.

---

## Newsletters & web — `ingest/newsletters/<slug>/`

| Slug (folder) | Focus (scan for) | Manifest notes |
|---------------|------------------|----------------|
| `josh-bersin` | M&A, platform AI, workforce | **Newsletter** issues only (`ingest/youtube/josh-bersin/` is for transcripts) |
| `open-letter` | SA tech / startup | Regional ecosystem |
| `staffbase-comms` | **Frontline-first**, competitor comms AI | Employee engagement / IC |
| `hr-tech-feed` | Launches, funding, partnerships | Daily aggregator |
| `people-managing-people` | EX, HR tech, tools | |
| `unleash` | Vendor launches, EMEA | |
| `future-work-flexos` | AI in work, tools | Substack |
| `mining-magazine` | Mining tech, ESG, safety | Frontline / regulated |
| `hse-network` | Connected-worker, EHS software | Safety |
| `emergence-capital` | **Deskless** VC thesis | Market |
| `aihr` | People analytics, digital HR | EX-HR, Product |
| `edelman-trust` | Employer trust, expectations | EX / IC |
| `worktrends-talentculture` | Engagement, leadership | |
| `lennys-newsletter` | Product, growth, AI | |
| `product-growth-aakash` | PLG, AI PM | |

**Per issue:** use [_template_issue.md](./newsletters/_template_issue.md) → one `.md` per issue in the slug folder.

**RSS automation:** [`fetch_intel_rss.py`](../../../.scripts/market-intelligence/fetch_intel_rss.py) + **`../intel_feeds.json`** writes markdown here with frontmatter (`source: rss`, `article_url`, `published_at`, `themes`). Same slug folders as manual paste; dedupe by URL in **`../.intel_seen_urls.json`**.

---

## HR / engagement / AI — quick pick

| Need | Start with these slugs |
|------|------------------------|
| **Employee engagement & IC** | `staffbase-comms`, `worktrends-talentculture`, `edelman-trust`, `people-managing-people` |
| **AI in HR / EX** | `ai-future-of-work`, `aihr`, `josh-bersin`, `future-work-flexos` (YT + NL), `lennys-*`, `product-growth-aakash` |
| **Deskless / frontline** | `emergence-capital`, `mining-magazine`, `safety-of-work`, `hse-network` |
| **Market & M&A** | `hr-tech-feed`, `unleash`, `hr-huddle-wrkdefined`, `josh-bersin` |

---

## Related

| Doc | Role |
|-----|------|
| [../sources_manifest.yaml](../sources_manifest.yaml) | Full list + URLs + `web-scrapable` hints |
| [../WORKFLOW.md](../WORKFLOW.md) | How to fetch transcripts & paste newsletters safely |
| [../../Market_intelligence_Source_Guide.md](../../Market_intelligence_Source_Guide.md) | Broader source strategy (parent guide) |
| [../README.md](../README.md) | Hub layout |

**Skill:** [.claude/skills/intelligence-scanning/SKILL.md](../../../.claude/skills/intelligence-scanning/SKILL.md) — step 1 should list folders above when scanning.

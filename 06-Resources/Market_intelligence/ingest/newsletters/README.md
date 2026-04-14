# Newsletter ingest

One **folder per publication** — folder name = **`slug`** in [`../sources_manifest.yaml`](../../sources_manifest.yaml) (see **[`../README.md`](../README.md)** for the full table: HR, engagement, AI, deskless, safety).

## What to drop here

- **Employee engagement / IC / comms** (e.g. Staffbase, TalentCulture)
- **HR tech & product launches** (HR Tech Feed, UNLEASH, People Managing People)
- **AI in workforce** (AIHR, FlexOS Future Work, Lenny’s, product-growth)
- **Deskless / mining / safety** (Emergence, Mining Magazine, HSE Network)
- **Trust / employer brand** (Edelman)

## How

1. Pick the matching **`ingest/newsletters/<slug>/`** folder (create it if missing — use the slug from the manifest).
2. Add one **`.md` file per issue** using [_template_issue.md](./_template_issue.md).
3. Run **`/intelligence-scanning`** so the daily brief can pick it up.

**No broad mailbox access required** — RSS, “view in browser”, or paste. See [WORKFLOW.md](../../WORKFLOW.md).

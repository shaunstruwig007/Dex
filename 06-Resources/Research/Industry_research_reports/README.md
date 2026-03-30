# Industry research reports (deskless / frontline)

**Purpose:** Durable **markdown summaries** of PDFs you keep in **SharePoint** (or your `Downloads/Industry research reports` mirror). **No PDFs are committed to git** — only text extracts and `source_pdf` paths that **preserve your filenames and folder names** so an MCP → SharePoint link later stays predictable.

**Company name in vault:** **Wyzetalk** (STT tools may output “Wise Talk”; Dex uses the profile spelling.)

**Start here:** [[_INDEX|Index of all reports]]

## Planning and tasks

- Link a summary from **`03-Tasks/Tasks.md`**, quarter goals, or project docs when a task depends on this evidence, e.g. `[[06-Resources/Research/Industry_research_reports/summaries/Global - all industries/Deskless_Report_2024_UK|Deskless UK 2024]]`.
- Each summary’s frontmatter includes `source_pdf: "Industry research reports/…"` — same relative path as your local/SharePoint tree.

## Regenerating or adding reports

When you add PDFs under your source folder:

```bash
python3 .scripts/research-ingest/extract_industry_reports.py \
  --source "$HOME/Downloads/Industry research reports" \
  --dest "06-Resources/Research/Industry_research_reports"
```

This overwrites **`_INDEX.md`** and per-PDF `summaries/**/*.md` (partial extract: first ~12 pages or ~14k characters). For scanned PDFs with no text, the note says to use the SharePoint original.

## Related

- Rolling signals: [[../Market_and_deal_signals.md|Market and deal signals]]
- Pipeline ingest: [[../Market_intelligence/README.md|Market intelligence hub]]

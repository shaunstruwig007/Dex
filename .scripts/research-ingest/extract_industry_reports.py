#!/usr/bin/env python3
"""
Extract capped text from industry PDFs into vault markdown summaries.
PDFs stay outside git; paths preserve Downloads folder naming for SharePoint mapping.
"""
from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    print("pip install pypdf", file=sys.stderr)
    raise


MAX_PAGES = 12
MAX_CHARS = 14_000


def slug_base(name: str) -> str:
    base = Path(name).stem
    base = re.sub(r'[^\w\-.]+', '_', base).strip('_')
    if not base:
        base = "report"
    return base[:120]


def extract_pages(reader: PdfReader, max_pages: int, max_chars: int) -> tuple[str, int, int]:
    parts: list[str] = []
    total_pages = len(reader.pages)
    n = min(max_pages, total_pages)
    count = 0
    for i in range(n):
        text = reader.pages[i].extract_text() or ""
        text = text.strip()
        if text:
            parts.append(f"### Page {i + 1}\n\n{text}\n")
            count += len(text)
            if count >= max_chars:
                break
    body = "\n".join(parts)
    if len(body) > max_chars:
        body = body[:max_chars] + "\n\n*[Extract truncated at character cap — full PDF in SharePoint.]*\n"
    return body, n, total_pages


def vertical_from_rel(rel: Path) -> str:
    parts = rel.parts
    if len(parts) >= 2:
        return parts[0]
    return "root"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", type=Path, required=True, help="Folder with PDFs (e.g. Downloads/Industry research reports)")
    ap.add_argument("--dest", type=Path, required=True, help="Vault Research folder (contains summaries/)")
    args = ap.parse_args()

    src: Path = args.source.expanduser().resolve()
    dest_root: Path = args.dest.expanduser().resolve()
    summaries = dest_root / "summaries"
    summaries.mkdir(parents=True, exist_ok=True)

    pdfs = sorted(src.rglob("*.pdf")) + sorted(src.rglob("*.PDF"))
    if not pdfs:
        print("No PDFs under", src, file=sys.stderr)
        return 1

    rows = []
    for pdf in pdfs:
        try:
            rel = pdf.relative_to(src)
        except ValueError:
            rel = Path(pdf.name)
        rel_posix = rel.as_posix()
        vdir = vertical_from_rel(rel)
        sub = summaries / Path(rel).parent
        sub.mkdir(parents=True, exist_ok=True)
        md_name = slug_base(pdf.name) + ".md"
        md_path = sub / md_name

        try:
            reader = PdfReader(str(pdf))
        except Exception as e:
            md_path.write_text(
                f"---\nsource_pdf: \"Industry research reports/{rel_posix}\"\n"
                f"ingested: {date.today().isoformat()}\nerror_open: \"{e}\"\n---\n\n"
                f"# {pdf.stem}\n\nCould not open PDF. Use SharePoint copy.\n",
                encoding="utf-8",
            )
            rows.append((rel_posix, md_path.relative_to(dest_root).as_posix(), "error"))
            continue

        body, used_pages, total_pages = extract_pages(reader, MAX_PAGES, MAX_CHARS)
        if not body.strip():
            body = "_No extractable text from first pages (likely scanned PDF). Use original in SharePoint or OCR._\n"

        wyz = (
            "**Wyzetalk (draft):** Frontline / deskless context for planning and ICP work. "
            f"Vertical folder: `{vdir}`. Skim extracted text below; cite SharePoint file for quotes."
        )

        front = "\n".join(
            [
                "---",
                f'source_pdf: "Industry research reports/{rel_posix}"',
                f"ingested: {date.today().isoformat()}",
                f"pages_extracted: \"1-{used_pages} of {total_pages}\"",
                "canonical_copy: SharePoint (not in git)",
                "tags:",
                "  - industry-research",
                "  - frontline-deskless",
                f'vertical: "{vdir}"',
                "---",
                "",
                f"# {pdf.stem}",
                "",
                f"**Original path:** `Industry research reports/{rel_posix}`",
                "",
                "## Wyzetalk relevance",
                "",
                wyz,
                "",
                "## Extracted text (partial)",
                "",
                body,
                "",
            ]
        )

        md_path.write_text(front, encoding="utf-8")
        rows.append((rel_posix, md_path.relative_to(dest_root).as_posix(), "ok"))

    # Write _INDEX.md
    lines = [
        "# Industry research reports — index",
        "",
        f"_Generated {date.today().isoformat()}. PDFs are **not** in git; summaries below are partial extracts._",
        "",
        "## How to use",
        "",
        "- Planning / tasks: link the summary note from [[03-Tasks/Tasks]] or quarter/week docs when a decision leans on this evidence.",
        "- Full document: open the SharePoint copy using the same **filename** and folder names as `source_pdf`.",
        "",
        "| Source PDF (relative) | Summary |",
        "|-------------------------|---------|",
    ]
    vault_prefix = "06-Resources/Research/Industry_research_reports"
    for rel_posix, md_rel, st in sorted(rows, key=lambda x: x[0].lower()):
        link = f"{vault_prefix}/{md_rel.removesuffix('.md')}"
        lines.append(f"| `{rel_posix}` | [[{link}]] |")

    (dest_root / "_INDEX.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(rows)} summaries under {summaries}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

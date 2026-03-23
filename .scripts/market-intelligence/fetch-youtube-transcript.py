#!/usr/bin/env python3
"""Fetch YouTube transcript and write vault markdown under Market_intelligence/ingest/youtube/."""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    print("Install: pip install youtube-transcript-api", file=sys.stderr)
    sys.exit(1)


def slugify(text: str, max_len: int = 80) -> str:
    s = re.sub(r"[^\w\s-]", "", text.lower())
    s = re.sub(r"[-\s]+", "-", s).strip("-")
    return s[:max_len] or "untitled"


def vault_root() -> Path:
    p = Path(__file__).resolve()
    for parent in p.parents:
        if (parent / "06-Resources").is_dir():
            return parent
    return Path.cwd()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--video-id", required=True)
    ap.add_argument("--channel-slug", required=True)
    ap.add_argument("--title", default="")
    args = ap.parse_args()
    vid = args.video_id.strip()
    channel = args.channel_slug.strip().lower().replace(" ", "-")
    title = args.title.strip() or vid

    api = YouTubeTranscriptApi()
    fetched = api.fetch(vid)
    lines = []
    for item in fetched:
        t = getattr(item, "text", str(item))
        if hasattr(item, "start"):
            lines.append(f"[{item.start:.1f}s] {t}")
        else:
            lines.append(t)

    body = "\n".join(lines)
    day = date.today().isoformat()
    slug = slugify(title)
    out_dir = vault_root() / "06-Resources" / "Market_intelligence" / "ingest" / "youtube" / channel
    out_dir.mkdir(parents=True, exist_ok=True)
    fname = f"{day}__{slug}__{vid}.md"
    out_path = out_dir / fname

    header = f"""---
source: youtube
channel_slug: {channel}
video_id: {vid}
title: "{title.replace('"', "'")}"
fetched: {day}
---

# {title}

**Video:** https://www.youtube.com/watch?v={vid}

## Transcript

"""
    out_path.write_text(header + body + "\n", encoding="utf-8")
    print(out_path)


if __name__ == "__main__":
    main()

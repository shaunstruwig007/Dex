#!/usr/bin/env python3
"""
Fetch configured RSS feeds into the vault ingest folder, then advance fetch state.

Run *before* /intelligence-scanning when intel_feeds.json lists feeds.

Output: 06-Resources/Market_intelligence/ingest/newsletters/<slug>/*.md

Requires: pip install -r .scripts/market-intelligence/requirements.txt (feedparser, certifi)

TLS: Uses a proper CA bundle — `SSL_CERT_FILE` / `REQUESTS_CA_BUNDLE` if set (e.g. corporate
root combined with public CAs), otherwise the Mozilla bundle from `certifi`. Verification is
never disabled. See .scripts/market-intelligence/README.md.

Config: Default `Market_intelligence/intel_feeds.json`; override with `--feeds` or `INTEL_FEEDS_FILE`.
Optional merge: `intel_feeds.local.json` (gitignored) appends to `feeds` — keep tokens/private URLs there.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import ssl
import sys
from datetime import datetime, timezone, timedelta
from html import unescape
from pathlib import Path

try:
    import feedparser
except ImportError:
    print("Install: pip install -r .scripts/market-intelligence/requirements.txt", file=sys.stderr)
    sys.exit(1)


def configure_tls_trust() -> None:
    """
    Ensure urllib/https uses a CA file. Prefer env (corporate or custom bundle); else certifi.
    Never disables certificate verification.
    """
    cafile = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
    if not cafile:
        try:
            import certifi

            cafile = certifi.where()
            os.environ.setdefault("SSL_CERT_FILE", cafile)
        except ImportError:
            return

    if not cafile:
        return

    def _https_context_factory():
        return ssl.create_default_context(cafile=cafile)

    ssl._create_default_https_context = _https_context_factory  # type: ignore[assignment]


def vault_root() -> Path:
    p = Path(__file__).resolve()
    for parent in p.parents:
        if (parent / "06-Resources").is_dir():
            return parent
    return Path.cwd()


def slugify(text: str, max_len: int = 50) -> str:
    s = re.sub(r"[^\w\s-]", "", (text or "").lower())
    s = re.sub(r"[-\s]+", "-", s).strip("-")
    return (s[:max_len] or "item").strip("-")


def dt_from_struct(t) -> datetime | None:
    if not t:
        return None
    try:
        return datetime(
            t.tm_year, t.tm_mon, t.tm_mday, t.tm_hour, t.tm_min, t.tm_sec, tzinfo=timezone.utc
        )
    except (ValueError, TypeError):
        return None


def load_json(path: Path) -> dict:
    if not path.is_file():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def strip_html(s: str) -> str:
    if not s:
        return ""
    s = re.sub(r"<[^>]+>", " ", s)
    return unescape(re.sub(r"\s+", " ", s)).strip()


def main() -> None:
    ap = argparse.ArgumentParser(description="Fetch RSS into Market_intelligence ingest.")
    ap.add_argument(
        "--since-days",
        type=int,
        default=None,
        metavar="N",
        help="Ignore state; fetch items from the last N days (UTC).",
    )
    ap.add_argument("--dry-run", action="store_true", help="Print actions only; no writes.")
    ap.add_argument("--verbose", action="store_true", help="Log skips.")
    ap.add_argument(
        "--feeds",
        type=Path,
        default=None,
        help="Path to feeds JSON (default: Market_intelligence/intel_feeds.json, or INTEL_FEEDS_FILE env).",
    )
    args = ap.parse_args()

    configure_tls_trust()

    root = vault_root()
    mi = root / "06-Resources" / "Market_intelligence"
    if args.feeds is not None:
        feeds_path = args.feeds.expanduser().resolve()
    elif os.environ.get("INTEL_FEEDS_FILE"):
        feeds_path = Path(os.environ["INTEL_FEEDS_FILE"]).expanduser().resolve()
    else:
        feeds_path = mi / "intel_feeds.json"

    state_path = mi / ".intel_fetch_state.json"
    seen_path = mi / ".intel_seen_urls.json"

    if not feeds_path.is_file():
        print(f"Missing {feeds_path} — create it (see intel_feeds.example.json).", file=sys.stderr)
        sys.exit(1)

    cfg = load_json(feeds_path)
    local_overlay = mi / "intel_feeds.local.json"
    if local_overlay.is_file():
        extra = load_json(local_overlay).get("feeds") or []
        base = cfg.get("feeds") or []
        cfg["feeds"] = base + extra
    feeds = cfg.get("feeds") or []
    if not feeds:
        print("intel_feeds.json has empty feeds[] — add { slug, rss_url } entries, then re-run.")
        sys.exit(0)

    state = load_json(state_path)
    seen_list = load_json(seen_path).get("urls") or []
    seen: set[str] = set(seen_list)

    now = datetime.now(timezone.utc)
    if args.since_days is not None:
        since_dt = now - timedelta(days=max(1, args.since_days))
    else:
        raw = state.get("last_fetch_utc")
        if raw:
            try:
                since_dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
                if since_dt.tzinfo is None:
                    since_dt = since_dt.replace(tzinfo=timezone.utc)
            except ValueError:
                since_dt = now - timedelta(days=7)
        else:
            since_dt = now - timedelta(days=7)

    written = 0
    max_pub: datetime | None = None

    for feed in feeds:
        slug = (feed.get("slug") or "").strip().lower()
        rss_url = (feed.get("rss_url") or "").strip()
        max_items = int(feed.get("max_items") or 30)
        tags = feed.get("tags") or []

        if not slug or not rss_url:
            print(f"Skip invalid feed (need slug + rss_url): {feed!r}", file=sys.stderr)
            continue

        out_dir = mi / "ingest" / "newsletters" / slug
        if not args.dry_run:
            out_dir.mkdir(parents=True, exist_ok=True)

        parsed = feedparser.parse(rss_url)
        if parsed.bozo and parsed.bozo_exception:
            print(f"Warning [{slug}] {parsed.bozo_exception}", file=sys.stderr)

        for entry in parsed.entries[:max_items]:
            link = (entry.get("link") or "").strip()
            if not link:
                continue
            if link in seen:
                if args.verbose:
                    print(f"  skip (seen): {link[:90]}")
                continue

            pub = dt_from_struct(entry.get("published_parsed")) or dt_from_struct(
                entry.get("updated_parsed")
            )
            if pub is None:
                if args.verbose:
                    print(f"  skip (no date): {(entry.get('title') or '')[:60]}")
                continue
            if pub < since_dt:
                if args.verbose:
                    print(f"  skip (before window): {pub.date()} {(entry.get('title') or '')[:40]}")
                continue

            title = (entry.get("title") or "Untitled").strip()
            summary = strip_html(entry.get("summary") or entry.get("description") or "")
            title_slug = slugify(title, 50)
            h = hashlib.sha256(link.encode("utf-8")).hexdigest()[:10]
            day = pub.strftime("%Y-%m-%d")
            fname = f"{day}__{title_slug}__{h}.md"

            themes = ", ".join(tags) if tags else "HR, engagement, AI (set tags in intel_feeds.json)"
            body = "\n".join(
                [
                    "---",
                    "source: rss",
                    f"slug: {slug}",
                    f"feed_url: {rss_url}",
                    f"article_url: {link}",
                    f"published_at: {pub.isoformat()}",
                    f"fetched_at: {now.isoformat()}",
                    f"themes: {themes}",
                    "---",
                    "",
                    f"# {title}",
                    "",
                    f"**Published:** {pub.strftime('%Y-%m-%d %H:%M UTC')}  ",
                    f"**Link:** {link}",
                    "",
                    "## Excerpt",
                    "",
                    (
                        (summary[:4000] + ("…" if len(summary) > 4000 else ""))
                        if summary
                        else "(no summary in feed)"
                    ),
                    "",
                    "---",
                    "*Ingested by fetch_intel_rss.py — open article for full text if needed.*",
                    "",
                ]
            )

            fpath = out_dir / fname
            if args.dry_run:
                print(f"[dry-run] would write {fpath.relative_to(root)}")
                continue

            if fpath.is_file():
                seen.add(link)
                if args.verbose:
                    print(f"  skip (file exists): {fname}")
                continue

            fpath.write_text(body, encoding="utf-8")
            seen.add(link)
            written += 1
            print(f"Wrote {fpath.relative_to(root)}")
            if max_pub is None or pub > max_pub:
                max_pub = pub

    if not args.dry_run:
        save_json(seen_path, {"urls": sorted(seen)[-8000:]})
        save_json(state_path, {"last_fetch_utc": now.isoformat()})
        if written:
            print(f"Done: {written} new file(s). last_fetch_utc = {now.isoformat()}")
        else:
            print(f"No new items after {since_dt.isoformat()}. State bumped to {now.isoformat()}.")
    else:
        print("Dry run — no files written.")


if __name__ == "__main__":
    main()

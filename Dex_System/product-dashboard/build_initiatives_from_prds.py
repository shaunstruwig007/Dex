#!/usr/bin/env python3
"""
Build initiatives.json from PRD folders only — product ideas / features, not operational tasks.

Stable ids: prd-{slug} where slug comes from the PRD filename (not Current/Next/Future).
Tier is prdTier (and optional YAML frontmatter in Product_ideas/*.md); see README.

Discovery/workspace markdown: 06-Resources/Product_ideas/prd-{slug}.md

Run from product-dashboard/:
  python3 build_initiatives_from_prds.py
"""
from __future__ import annotations

import json
import re
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VAULT = ROOT.parents[1]  # …/Dex_System/product-dashboard → vault root
PRD = VAULT / "06-Resources" / "PRDs"
PRODUCT_IDEAS = VAULT / "06-Resources" / "Product_ideas"

LANES = [
    "idea",
    "discovery",
    "design",
    "spec_ready",
    "in_build",
    "test_uat",
    "shipped_live",
]

# Current PRDs that are typically in active engineering for Essential GA
CURRENT_IN_BUILD = {"WhatsApp_Channel.md", "Payslip_PDF.md"}

SKIP_NAMES = {"README.md", "Template_Remote_App.md", "Template_Feature_Essential.md"}

SCHEMA_VERSION = "2.4.0"

# Template body is shorter; above this we assume user edits and skip overwrite
PRESERVE_MIN_BYTES = 650


def prd_stage_for_lane(lane: str) -> str:
    """Idea/Discovery = no vault PRD in dashboard modal; Design = draft; Spec+ = full PRD."""
    if lane in ("spec_ready", "in_build", "test_uat", "shipped_live"):
        return "spec_ready"
    if lane == "design":
        return "draft"
    return "none"


def slug(name: str) -> str:
    base = name.replace(".md", "")
    s = re.sub(r"[^a-zA-Z0-9._-]+", "-", base.lower()).strip("-")
    return s[:96] or "prd"


def rel_href(folder: str, fname: str) -> str:
    return f"06-Resources/PRDs/{folder}/{fname}"


def context_file_vault_path_for_id(init_id: str) -> str:
    return f"06-Resources/Product_ideas/{init_id}.md"


def parse_simple_frontmatter(raw: str) -> tuple[dict[str, str], str]:
    """Minimal YAML subset (key: value per line). Returns (meta, body)."""
    if not raw.startswith("---\n"):
        return {}, raw
    end = raw.find("\n---\n", 4)
    if end == -1:
        return {}, raw
    fm = raw[4:end]
    body = raw[end + 5 :]
    meta: dict[str, str] = {}
    for line in fm.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        k = k.strip()
        v = v.strip().strip('"').strip("'")
        meta[k] = v
    return meta, body


def truthy(val: str | None) -> bool:
    if val is None:
        return False
    return val.lower() in ("true", "1", "yes")


def excerpt_from_markdown_body(md: str, max_len: int = 280) -> str:
    """First substantive paragraph after headings, for card summary."""
    meta, body = parse_simple_frontmatter(md)
    if not body.strip():
        body = md
    lines = body.strip().splitlines()
    para: list[str] = []
    for line in lines:
        s = line.strip()
        if s.startswith("#"):
            continue
        if not s:
            if para:
                break
            continue
        para.append(s)
    text = " ".join(para)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    if len(text) <= max_len:
        return text
    cut = text[: max_len - 1].rsplit(" ", 1)[0]
    return cut + "…"


def should_preserve_product_ideas_file(path: Path) -> bool:
    if not path.exists():
        return False
    raw = path.read_text(encoding="utf-8")
    if len(raw.encode("utf-8")) >= PRESERVE_MIN_BYTES:
        return True
    meta, _ = parse_simple_frontmatter(raw)
    if truthy(meta.get("preserve")) or truthy(meta.get("dex_dashboard_preserve")):
        return True
    return False


def normalize_prd_tier_fm(tier: str) -> str:
    t = tier.strip().lower()
    aliases = {
        "now": "Current",
        "current": "Current",
        "next": "Next",
        "future": "Future",
        "backlog": "Backlog",
    }
    return aliases.get(t, tier.strip())


def merge_frontmatter_into_record(rec: dict, md_path: Path) -> None:
    """If workspace file exists, apply prdTier/summary from frontmatter; excerpt for summary when useful."""
    if not md_path.exists():
        return
    raw = md_path.read_text(encoding="utf-8")
    meta, body = parse_simple_frontmatter(raw)
    tier = (meta.get("prdTier") or meta.get("prd_tier") or "").strip()
    if tier:
        rec["prdTier"] = normalize_prd_tier_fm(tier)

    sum_m = (meta.get("summary") or "").strip()
    if sum_m:
        rec["summary"] = sum_m
        return

    # Excerpt from body when file has real content and summary is still the default template
    if len(raw) > 200 and body.strip():
        ex = excerpt_from_markdown_body(raw)
        default_sum = (rec.get("summary") or "").startswith("PRD in **")
        if ex and default_sum:
            rec["summary"] = ex


def template_body(title: str, summary: str, href: str, label: str = "PRD") -> str:
    return (
        f"---\n"
        f"# Product idea workspace (dashboard)\n"
        f"dex_dashboard_preserve: false\n"
        f"# Set prdTier: Current | Next | Future | Backlog to override PRD folder on rebuild\n"
        f"# summary: \"Short card text\"\n"
        f"---\n\n"
        f"# {title}\n\n{summary}\n\n## PRD\n\n- [{label}]({href})\n\n"
        f"## Discovery notes\n\n*(Workshops, evidence, links.)*\n\n## Design\n\n"
        f"- Figma: *(add link in dashboard detail or here)*\n\n## Orchestration\n\n"
        f"Move lanes in the dashboard; export JSON when stable.\n"
    )


def lane_for_file(sub: str, fname: str, default_lane: str) -> str:
    if sub == "Current" and fname in CURRENT_IN_BUILD:
        return "in_build"
    if sub == "Current":
        return "test_uat"
    if sub in ("Next", "Future"):
        return "idea"
    return default_lane


def gather_prd_rows() -> list[dict]:
    """One row per PRD file: sub, fname, lane, prd_tier, priority, title, href."""
    rows: list[dict] = []
    scans = [
        ("Current", "test_uat", "Current", "P1"),
        ("Next", "idea", "Next", "P2"),
        ("Future", "idea", "Future", "P3"),
    ]
    for sub, _default_lane, prd_tier, priority in scans:
        d = PRD / sub
        if not d.is_dir():
            continue
        for f in sorted(d.glob("*.md")):
            if f.name in SKIP_NAMES:
                continue
            if f.name.endswith("_acceptance_criteria.md"):
                continue
            lane = lane_for_file(sub, f.name, "idea")
            href = rel_href(sub, f.name)
            title = f.name.replace(".md", "").replace("_", " ")
            rows.append(
                {
                    "sub": sub,
                    "fname": f.name,
                    "lane": lane,
                    "prd_tier": prd_tier,
                    "priority": priority,
                    "title": title,
                    "href": href,
                }
            )
    return rows


def assign_stable_slugs(rows: list[dict]) -> None:
    """Mutates rows with stable_slug (filename-based; disambiguate if same basename in multiple folders)."""
    by_base: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        by_base[slug(r["fname"])].append(r)
    for b, group in by_base.items():
        if len(group) == 1:
            group[0]["stable_slug"] = b
        else:
            for r in group:
                r["stable_slug"] = f"{b}-{r['sub'].lower()}"


def row_to_initiative(r: dict) -> dict:
    sid = f"prd-{r['stable_slug']}"
    sub = r["sub"]
    href = r["href"]
    cf = context_file_vault_path_for_id(sid)
    lane = r["lane"]
    prd_tier = r["prd_tier"]
    return {
        "id": sid,
        "kind": "feature_idea",
        "title": r["title"],
        "summary": f"PRD in **{sub}/** — prioritise with **{prd_tier}** ({r['priority']}).",
        "lane": lane,
        "prdStage": prd_stage_for_lane(lane),
        "prdTier": prd_tier,
        "priority": r["priority"],
        "owner": "",
        "horizon": "Essential GA" if sub == "Current" else ("Post-GA" if sub == "Next" else "Exploration"),
        "rag": "amber",
        "whatsNext": "",
        "figmaUrl": "",
        "links": [{"label": "PRD", "href": href}],
        "contextFile": cf,
        "source": f"PRDs/{sub}",
        "tags": [prd_tier, f"PRDs/{sub}"],
        "intakeSource": "",
        "progress": None,
        "progressLabel": "",
        "milestones": [],
        "steeringFocus": False,
        "workflowStatus": "",
    }


def build_initiatives_list() -> list[dict]:
    rows = gather_prd_rows()
    assign_stable_slugs(rows)
    unique: list[dict] = []
    seen: set[str] = set()
    for r in rows:
        rec = row_to_initiative(r)
        md_path = PRODUCT_IDEAS / f"{rec['id']}.md"
        merge_frontmatter_into_record(rec, md_path)
        if rec["id"] in seen:
            continue
        seen.add(rec["id"])
        unique.append(rec)
    return unique


def write_product_ideas_stubs(initiatives: list[dict]) -> None:
    PRODUCT_IDEAS.mkdir(parents=True, exist_ok=True)
    for x in initiatives:
        md = PRODUCT_IDEAS / f"{x['id']}.md"
        href = x["links"][0]["href"]
        if should_preserve_product_ideas_file(md):
            continue
        body = template_body(x["title"], x["summary"], href)
        md.write_text(body, encoding="utf-8")


def main() -> None:
    unique = build_initiatives_list()

    today = date.today().isoformat()
    out = {
        "schemaVersion": SCHEMA_VERSION,
        "title": "Product dashboard — ideas (PRD-backed)",
        "updated": today,
        "lanes": LANES,
        "orchestrationNote": "Ideas only — not operational tasks. See ORCHESTRATION.md.",
        "executiveContext": "",
        "initiatives": sorted(
            unique, key=lambda z: (LANES.index(z["lane"]), z["prdTier"], z["title"].lower())
        ),
    }

    (ROOT / "initiatives.json").write_text(
        json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    write_product_ideas_stubs(unique)

    print(f"Wrote initiatives.json ({len(unique)} PRD-backed ideas) + markdown under {PRODUCT_IDEAS.relative_to(VAULT)}")
    print("Stable ids: prd-{{slug}} — tier = prdTier / frontmatter, not filename.")
    print("Lanes: Current → mostly test_uat; WhatsApp + Payslip → in_build. Next/Future → idea.")


if __name__ == "__main__":
    main()

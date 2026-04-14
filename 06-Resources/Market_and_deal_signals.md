# Market & deal signals

**Purpose:** Running log of **external market intelligence** and (later) **deal-level themes** so decisions are traceable and Dex can help synthesize patterns. **Phase 1** does not depend on sales process buy-in.

**Canonical source list (26 sources, v2):** [Market_intelligence_Source_Guide.md](./Market_intelligence_Source_Guide.md)

**Evidence linkage:** When a signal informs a PRD or AC, add an entry to [PRDs/Evidence_register.md](./PRDs/Evidence_register.md) and reference `EV-*` from specs.

**Competitors:** [Competitors/COMPETITOR_INDEX.md](./Competitors/COMPETITOR_INDEX.md)

**Internal deal patterns (won/lost reasons, HubSpot export):** [Market_intelligence/synthesis/Deal_Won_Lost_Analysis_Reference.md](./Market_intelligence/synthesis/Deal_Won_Lost_Analysis_Reference.md) — refresh when the spreadsheet updates; use alongside external intel for pricing, ghosting, stack, and deskless feature fit.

**Weekly discovery:** `/weekly-market-discovery` — [.claude/skills/weekly-market-discovery/SKILL.md](../.claude/skills/weekly-market-discovery/SKILL.md)

**Weekly Product & Executive pack:** `/weekly-exec-intel` (after `run-weekly-intel-fetch.sh` or your ingest) — [.claude/skills/weekly-exec-intel/SKILL.md](../.claude/skills/weekly-exec-intel/SKILL.md)

**Daily intelligence (ingest + brief):** [Market_intelligence/[[README]].md](./Market_intelligence/[[README]].md) — transcripts + newsletters → **`synthesis/daily/YYYY-MM-DD_signal_brief.md`** · `/intelligence-scanning` · `/daily-intelligence-brief` (synthesis-only) — [.claude/skills/intelligence-scanning/SKILL.md](../.claude/skills/intelligence-scanning/SKILL.md)

---

## Weekly scanning routine

| When | ~Time | Focus |
|------|-------|--------|
| Monday | 10 min | HR Tech Feed (weekend funding/M&A). Ragan daily + **The Open Letter** (SA + IC). |
| Tuesday | 20 min | Lenny’s weekly post. Skim **Product Growth (Aakash Gupta)** — PLG, AI PM, pricing. |
| Wednesday | 15 min | **One podcast** (rotate): HR Huddle · AI & Future of Work · Safety of Work · HR Happy Hour. |
| Friday | 10 min | Josh Bersin weekly. Emergence Capital + UNLEASH for new pieces. |
| Monthly | 30 min | Mining Technology archive. Edelman / Sapient new reports. |

---

## Priority sources (early signal)

| Source | URL | Typical day |
|--------|-----|-------------|
| HR Tech Feed | [hrtechfeed.com](https://hrtechfeed.com) | Monday |
| The Open Letter | [theopenletter.io](https://theopenletter.io) | Monday |
| Josh Bersin | [joshbersin.com](https://joshbersin.com) | Friday |
| Emergence Capital (deskless) | [emcap.com/thoughts](https://emcap.com/thoughts) | Friday |
| UNLEASH | [unleash.ai](https://unleash.ai) | Friday |

---

## Phase 1 — Signal log

| Week of | Source type | Source name / URL | Competitor or theme | What changed or was claimed | Implication for us | EV-ID |
|---------|-------------|-------------------|---------------------|------------------------------|---------------------|-------|
| 2026-04-14 | Automation + RSS ingest | [intel_feeds.json](./Market_intelligence/intel_feeds.json) · [fetch_intel_rss.py](../.scripts/market-intelligence/fetch_intel_rss.py) | Pipeline | **RSS fetch (`--since-days 14`):** **66** new `ingest/newsletters/**/*.md` (e.g. HR Tech Feed, UNLEASH, Josh Bersin, Lenny’s, mining-technology, worktrends-talentculture, AIHR). Prior daily brief (pre-ingest) had noted empty pipeline — **superseded** by this run. | Re-run **`/intelligence-scanning`** to refresh daily briefs; **weekly exec pack:** [2026-04-14_weekly_exec_brief.md](./Market_intelligence/synthesis/weekly/2026-04-14_weekly_exec_brief.md) | |
| 2026-04-09 | Internal deal intel | [YOOBIC](https://yoobic.com/) · [profile](./Competitors/profiles/Yoobic.md) | [YOOBIC](./Competitors/profiles/Yoobic.md) | **Win-loss:** competitor displaced **Wyzetalk** on an account **150k+ users** (retail store ops / execution positioning) | Sharpen **retail execution vs deskless EX** story; update battle card; capture structured win-loss reason (no client name in vault) | EV-2026-04-001 |
| 2026-03-27 | Social — LinkedIn | [Louis Du Toit — Sentiv × Teamwire partnership](https://www.linkedin.com/feed/update/urn:li:activity:7440477679377817601) | [Sentiv](./Competitors/profiles/Sentiv.md) / [Teamwire](./Competitors/profiles/Teamwire.md) | **Teamwire** (DE **secure messenger**) + **Sentiv** (ZA mission-critical integrator, ex–**Altron Nexus**) — **SA** routes for **public safety, EMS, municipalities, frontline ops**; governance / sovereignty vs **consumer WhatsApp** | **Government & critical-infra** RFPs may bundle **sovereign ops messenger**; disambiguate vs **EX platform**; **coexistence** story where **Teamwire** = governed ops, **Wyzetalk** = employee EX | EV-2026-03-006 |
| 2026-03-26 | Social — LinkedIn | [Jem — Deel Local Payroll (PaySpace) partner post](https://www.linkedin.com/posts/jemhr_weve-done-a-deal-with-deel-very-happy-activity-7439938882831388696-yDmu/) | [JEM HR](./Competitors/profiles/Jem.md) | **Official integration partner** of **Deel Local Payroll, powered by PaySpace**; PaySpace payroll customers can reach frontline via **WhatsApp** through Jem | Strengthens Jem **payroll + WA** bundle; update market brief + battle cards: **coexistence** with payroll vendors, **Essential** payslip / integration story | EV-2026-03-005 |
| 2026-03-25 | Aggregator / web | [HR Tech Feed](https://hrtechfeed.com) | Frontline TA channels + agentic ATS | iCIMS Frontline AI (SMS/WhatsApp conversational hiring); Workable agentic full-cycle features; Persona candidate verification; Deel ATS/platform bundle; Workday×Sana recap | WhatsApp/SMS lane crowded by **hiring** tools — sharpen **employee EX** differentiation; verification trend supports trust/compliance story | EV-2026-03-002 |
| 2026-03-25 | Pass (not scraped) | [Lenny’s Newsletter](https://www.lennysnewsletter.com) · [Aakash Gupta — Product Growth](https://news.aakashg.com) | Product craft / PLG | Tuesday routine — user to skim | PLG + AI PM patterns for Essential GTM | |
| 2026-03-23 | Aggregator / web | [HR Tech Feed](https://hrtechfeed.com) | AI hiring risk + M&A | Workday AI hiring lawsuit (legal risk for automated screening); Findem/Glider acquisition; Paraform $40M Series B; ZipRecruiter ChatGPT app; SAP Release Center 1H 2026 | TA AI consolidating fast; landmark lawsuit signals compliance risk for AI-powered HR; non-TA/EX tools may face less scrutiny | |
| 2026-03-23 | Aggregator / web | [Ragan Comms](https://ragan.com) | Frontline IC + AI rollout | Amazon AI rollout facing internal resistance (IC opportunity); frontline onboarding piece: culture must reach non-corporate job sites; 2026 IC Awards include AI-powered category | Amazon story is direct IC case study for [[Wyzetalk]] positioning; onboarding framing aligns with new product launch | |
| 2026-03-23 | Newsletter / web | [The Open Letter](https://theopenletter.io) | SA tech funding + fintech | SA March raises: $6.1M (Orca Fraud $2.35M + 3 others); Optasia JSE 76% revenue growth ($265M), 432M users / 38 countries; Discovery Bank 80% EFT fraud reduction via AI | SA startup ecosystem maturing + institutionalising; infra-first focus; Optasia scale shows appetite for African fintech at JSE | |
| 2026-03-16 | Aggregator / web | [HR Tech Feed](https://hrtechfeed.com) | HR tech M&A & AI | Findem/Glider; Paraform $40M; EU AI Act; SAP SF updates | TA AI consolidating; track deskless vs TA spend | |
| 2026-03-16 | Newsletter / web | [The Open Letter](https://theopenletter.io) | SA tech | BVNK/Mastercard; CHARGE/Zimi; Cape Town fintech | Home-market M&A signals | |
| 2026-03-16 | Analyst blog | [Josh Bersin](https://joshbersin.com) | Workday × Sana / AI | Front door to work; frontline series; see [ingest transcript](Market_intelligence/ingest/youtube/josh-bersin/2026-03-20__workday-sana-announcement-overview__c73njafYTRY.md) | Coexistence vs replacement narrative | EV-2026-03-001 |
| 2026-03-16 | VC blog | [Emergence Capital](https://www.emcap.com/thoughts) | Funding | AI-native services; deskless tag | Narrative for investors | |
| 2026-03-16 | Competitor (intel) | [Staffbase blog](https://staffbase.com/blog) | Staffbase | AI intranet; frontline 80%; vs Flip | RFP language; USSD/regulated proof | |
| 2026-03-17 | Competitor pass | [Beekeeper](https://www.beekeeper.io) | Beekeeper | Frontline Success; LumApps EX | Mining/energy + urgent + access | |
| 2026-03-17 | Competitor pass | [Appspace](https://www.appspace.com) | Appspace | Workplace + Appspace Intelligence | Deskless vs facilities bundle | |
| 2026-03-17 | Competitor pass | [Workvivo](https://www.workvivo.com) | Workvivo | Frontline Road Trip | Industrial proof | |
| 2026-03-17 | Competitor pass | [Staffbase vs Flip](https://staffbase.com/blog/staffbase-vs-flip) | Staffbase / Flip | Year-two roadmap angle | Triangulation in app RFPs | |

---

## Phase 2 — Deal & CRM themes (when you have buy-in)

| Period | Theme | Frequency | Example evidence | Link | EV-ID |
|--------|-------|-----------|------------------|------|-------|
| | | | | | |

---

## How this connects to delivery

1. Strong signals → [Evidence_register.md](./PRDs/Evidence_register.md) as `EV-*`.  
2. `EV-*` → [Evidence_and_traceability.md](./PRDs/Evidence_and_traceability.md).  
3. Jira / Monday can cite `EV-*` in descriptions.

---

## Granola vs Fathom

- **Fathom + HubSpot:** pipeline truth when sales adopts it.  
- **Granola (you):** your meeting capture into the vault — synthesis layer, not CRM of record.

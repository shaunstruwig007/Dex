# Wyzetalk ICP (Ideal Customer Profile) — v1

**Status:** AUTHORED — Shaun, 2026-04-29
**Scope note:** This ICP describes **Wyzetalk Essential** (the next-gen product). USSD is out of scope for Essential and has been removed throughout — historic Wyzetalk material referencing USSD is preserved in the legacy product, not here.
**Purpose:** Ground the discovery / research skills (formerly known as `/moneypenny-custom`, pending rename) and the strategic-fit scoring used by idea-stage gates and the weekly market sweep.
**Pairs with:** `06-Resources/Competitors/profiles/*` (competitor positioning); `06-Resources/Market_intelligence/synthesis/weekly/*` (Friday market signal); `System/pillars.yaml` (Dex-wide strategic pillars).

---

## Version

`v1 — 2026-04-29` *(authored from internal Wyzetalk product/use-case documentation; USSD references stripped per Essential scope decision)*

---

## WT thesis (one paragraph)

Wyzetalk's ideal customers are organisations with a frontline workforce that need to improve engagement and inclusion, deliver essential employee services and communications via mobile-first channels (**Mobi and App**), and are willing to implement in-app functional use cases — such as HR self-service (payslips, leave, vacancies, shift schedules, learning), updates/news and leadership communications, safety/SHEQ information, feedback mechanisms, and people-focused engagement (recognition, galleries, long service/birthdays). Best-fit customers prioritise data accessibility (e.g., data-free experiences) and avoid relying solely on external links for key employee actions.

---

## ICP segments

### Segment 1 — Core: Large, distributed frontline workforce needing a single "employee front door"

- **Who they are:** Organisations with a frontline workforce where the business goal is enhancing engagement and inclusion among that frontline. Workforces benefitting from multi-channel access (Mobi, App). Environments where data cost and device diversity matter (Datafree-relevant).
- **What problem they buy WT for:** A single mobile-first front door for frontline services and comms — HR Self-Service (vacancies, benefits, skills/learning, pay info/payslips, leave, shift schedules, microlearning, policies); Updates & News (business info, leadership messages, operational news, wellness, competitions/campaigns); Feedback (surveys, social feeds, quizzes/newsfeed/podcast); People-focused engagement (recognition, galleries, birthdays/long service).
- **How they buy:** Multi-stakeholder buying group (HR + Comms + Ops + Admin); a "client champion" is established before launch; ongoing governance via monthly check-ins; escalation stakeholders are named up-front.
- **What disqualifies them:** Customers unwilling to implement in-app functional elements — orgs that only want external links typically see activity decrease and remove their employees' "data free" value. This is the strongest documented anti-pattern.
- **Signals of fit:** Frontline workforce ≥5,000 employees (documented examples cluster at 5k / 6k / 10k / 11k); explicit goal of "engagement and inclusion" for non-desk workers; willingness to commit to ≥2–3 in-app functional elements at launch; named champion; governance capacity.
- **Signals of anti-fit:** Desk-based-only workforce; no governance commitment; "external link wrapper" expectation; no HR data integration capability.

### Segment 2 — Variant: HR Self-Service & secure employee access (sensitive-info use cases)

- **Who they are:** Companies wanting employees to access secure HR information such as digital payslips, critical HR letters, leave balances, employee details — on mobile.
- **What problem they buy WT for:** Reducing HR admin load and improving mobile access to HR services. Sensitive-info use cases require **Elevated Authentication** since default login methods are often not secure enough.
- **How they buy:** HR-led buying group; IT involved for HR-system integration; champion typically a senior HR Operations or HRIS owner.
- **What disqualifies them:** No HR system that can produce the required data artefacts (e.g. PUK distribution for elevated auth; scheduled imports or API endpoints for HR data).
- **Signals of fit:** Existing HR/payroll system with API or scheduled-export capability; documented appetite for digital payslips; concerns about HR-as-a-bottleneck for routine queries.
- **Signals of anti-fit:** HR data only available in spreadsheets; no IT bandwidth for integration; insistence on email-only delivery.

### Segment 3 — Variant: Safety- / operations-led businesses needing SHEQ and operational comms in the flow of work

- **Who they are:** Operational environments (mining, manufacturing, logistics, FMCG operations) where SHEQ and operational information need regular visibility on the frontline.
- **What problem they buy WT for:** A consistent "Updates & News" lane plus operational reporting/updates (SHEQ content categories — Information/News; production results/updates; potentially incident logging and dashboards depending on configuration) surfaced to frontline teams in a place they actually look.
- **How they buy:** SHEQ / Operations-led buying group; HR + Ops jointly fund; champion typically a SHEQ Manager or Ops Communications lead.
- **What disqualifies them:** Operations leadership not committed to platform usage (then frontline ignores it); paper-based safety culture without an explicit digital migration mandate.
- **Signals of fit:** Existing SHEQ programme with defined content cadence; production/operational updates already produced (need a delivery channel); regulatory pressure for documented safety comms.
- **Signals of anti-fit:** Industries with minimal SHEQ obligations; ops culture hostile to top-down comms.

### Segment 4 — Variant: Crisis / Emergency Communications maturity (including WhatsApp as an emergency channel)

- **Who they are:** Organisations that require Emergency Comms surfaced prominently across channels (Mobi and App), and potentially want outbound messaging linked to emergency communications.
- **What problem they buy WT for:** Display emergency messages on top of the navigation home page for as long as enabled, visible on Mobi and App; optionally send linked outbounds (notification / WhatsApp / SMS) per the documented order.
- **How they buy:** Crisis-management owner (often Group Comms or Risk); IT/Security stakeholder; HR for opt-in campaign coordination.
- **What disqualifies them:** No verified Facebook Business account (blocks WhatsApp emergency channel); unwillingness to run the documented opt-in campaign.
- **Signals of fit:** Existing crisis-comms playbook; verified Facebook Business account in place or in flight; risk/audit pressure for documented emergency reach.
- **Signals of anti-fit:** No formal crisis-comms function; refusal to run an opt-in campaign.

---

## Cross-segment ICP qualification checklist

Yes/no — based on documented fit signals. Three or more "yes" with explicit governance commitment is the bar.

- [ ] Frontline engagement & inclusion is a primary outcome they're targeting.
- [ ] They need mobile access across **Mobi and App** for the frontline workforce.
- [ ] They will implement at least **2–3 in-app functional elements** at launch (e.g. payslips/pay info, leave, vacancies, shift schedules, learning).
- [ ] They have governance capacity: named stakeholders, client champion, monthly check-ins, content calendar, KPI review.
- [ ] *(If emergency comms / WhatsApp is in scope)* They have a verified Facebook Business account and will run the opt-in campaign.

---

## Cross-segment disqualifiers

- "External link wrapper" expectation — orgs that don't want to commit to in-app functional elements; documented to *decrease* activity and erode the data-free value to employees.
- Desk-based-only workforce with reliable intranet/email access (no frontline-front-door problem to solve).
- No governance commitment (no champion, no check-ins, no content calendar).
- HR-data isolation (data only in spreadsheets, no integration possible) — disqualifies HR Self-Service variant specifically.

---

## Known near-neighbours (competitor positioning)

*To be expanded as `06-Resources/Competitors/profiles/*` is populated. One line each on "how WT differs in a sentence."*

- **Jem** — see [`Jem.md`](../06-Resources/Competitors/profiles/Jem.md). WT differs because: *(to be added on next competitor pass)*
- **Workplace from Meta** *(sunsetting)* — WT differs because: *(to be added)*
- **Workvivo (Zoom)** — WT differs because: *(to be added)*
- **Microsoft Viva Engage (Yammer)** — WT differs because: *(to be added)*

---

## How the discovery skill uses this

1. **Strategic-fit score on kickoff** — reads segments + cross-segment disqualifiers; compares against the initiative's primary beneficiary / target users / problem; emits strategic-fit = high / med / low.
2. **Competitor filter** — competitor-snapshot output filters for near-neighbours named here; other vendors show in raw signal notes but not in the curated snapshot.
3. **Weekly sweep "still a fit?" check** — if new market signal lands that moves an initiative's segment mapping, the sweep appends a draft open-question asking the PM to revisit.
4. **Anti-fit guard** — initiatives whose primary beneficiary matches a cross-segment disqualifier get a visible flag; PM can override but has to read it first.

---

## Update discipline

- **One editor:** Shaun (until WT strategic leadership expands this scope).
- **Bump the version line** on every edit; the weekly sweep reads the version and re-scores when it has changed.
- **No PII / no customer-specific strategy** in this file — it is vault-general context. Per-customer strategy lives on the relevant `05-Areas/People/External/*.md` or `05-Areas/Companies/*.md` page.

---

*Authored 2026-04-29 from internal Wyzetalk product/use-case documentation. USSD references stripped per Wyzetalk Essential scope decision (Essential is Mobi + App only). Supersedes the v0 placeholder created 2026-04-21.*

---
name: felix-client-signals-custom
description: Felix's first-party customer-intelligence skill. Translates Wyzetalk client activity stats into product signals — churn-risk accounts, expansion candidates, feature gaps. Wyzetalk's actual book of business, not press mentions.
---

# Felix — Client Signals

**Owner:** Felix Leiter (head of research).
**When:** On-demand when Shaun says "give me the client read" / "who's at risk?" **or** on a cadence you choose (e.g. after a new `Clients_*.xlsx` snapshot drops). **Not** part of `/weekly-market-intel-custom` — the Friday Signal excludes book-of-business data by design.
**Default time-budget:** 15–25 min.

---

## What this skill does

Translates **Wyzetalk's own client activity data** (registration %, active users %, member counts) into product implications. This is **first-party intelligence** — no scraping, no LLM speculation about what "the market" thinks. It's "what does our actual book of business tell us about what to build?"

Why it matters: a competitor pinch (Yoobic taking a 150k-user account) is not noise — it's the kind of pattern that, *if Felix is watching the data*, shows up as an **early signal in activity drift before the deal is lost**.

---

## Inputs

| Source | Path | What it tells us |
|---|---|---|
| **Latest client snapshot** | `05-Areas/Companies/Wyzetalk_Clients/_data/Clients_<latest>.xlsx` | Per-account: Total Candidates, Members, Registration %, Active Users, Activity % |
| **Prior month's snapshot** (if exists) | `_data/Clients_<prior-month>.xlsx` | For month-over-month delta |
| **Account meeting notes** | `00-Inbox/Meetings/` keyword-search by account name | CSM-side context (renewal date, complaints, expansion conversations) |
| **Existing client / company pages** | `05-Areas/Companies/<Account>.md` if exists | Relationship history |

The current snapshot at bootstrap (2026-04-22) has 50 accounts:

```
AMSA, Anglo Brazil, Bidvest, Black Rock, Capricorn, CFAO, Clover, Cobre Live,
Combined Anglo American, Combined De Beers, De Beers Engage, Debmarine Namibia,
Exxaro, FLM, G4S, GlassTalk, Glencore DRC, Glencore SA, Harmony, Implats,
Isuzu Motors SA, Italtile, Jonsson CommUnity, Kauai, KEM, Kenmare, KFC, Khumani,
Kumba, Lactalis, Namdeb, Natref, Nu, NVision, Peru, Rainbow, RCL, Sasol, Shoprite,
VW, Sibanye Stillwater, Steelmaking Coal, Sun, Tharisa, Toyota, Ulwazi, Valterra,
Wappin, Woolworths
```

---

## What Felix looks for

### A. Churn-risk patterns (Yoobic-vulnerable accounts)

Flag accounts matching any of:

1. **Activity % below 15%** AND **member count > 1000** — large account that's quietly going cold (current matches per 2026-04-22 snapshot: **Anglo Brazil** 12.02%, **Bidvest** 7.79%, **Cobre Live** 0.78%, **Steelmaking Coal** 2.30%, **CFAO** 200% — *suspect data*, **Kenmare** 0.08%/50%)
2. **Activity % dropped >10pts MoM** — momentum loss
3. **Registration % below 50%** AND **member count > 5000** — large account where adoption never stuck (current: **Bidvest** 31.81%, **Tharisa** 26.23%, **Steelmaking Coal** 34.42%, **Lactalis** 28.82%, **Shoprite** 54.71% — *Shoprite is largest account, 54% is borderline*)

These get the **"Yoobic-vulnerable"** tag. Watch for competitor name-drops in the meeting notes for those accounts in the next pass.

### B. Expansion candidates

Flag accounts matching:

1. **Activity % above 70%** AND **growing registrations MoM** — strong adoption, ripe for SKU upsell
2. **High registration % + low activity %** — onboarded but not engaging (product/feature gap, not commercial)

Current strong-adoption accounts: **Sasol** 96.46%, **G4S** 93.90%, **Woolworths** 83.10%, **FLM** 79.56%, **Rainbow** 77.45%, **VW** 75.93%, **Clover** 73.44%.

### C. Feature gap patterns

Group accounts by activity quartile, then check what features the **bottom quartile lacks** vs the top quartile. Cross-reference with PRD coverage in `06-Resources/PRDs/`. Surface as candidate `EV-*` rows when a clear pattern emerges (e.g., "all 6 bottom-quartile accounts are <X vertical> and lack <Y feature>").

### D. Data quality flags

- Some rows have suspect values (e.g. CFAO showing 200% activity, Isuzu showing 1000% — these are calculation artefacts where actives > members). Flag them and ask Shaun to confirm with the data source on first run.

---

## Outputs

1. **Refresh `05-Areas/Companies/Wyzetalk_Clients/index.md`** — table of all 50 accounts with current snapshot, sorted by activity %, with churn-risk + expansion tags.

2. **Write `05-Areas/Companies/Wyzetalk_Clients/<YYYY-MM-DD>_signals.md`** — analytical write-up:
   - Top 5 churn-risk accounts (with reasoning)
   - Top 5 expansion candidates
   - Feature-gap patterns
   - Data quality flags

3. **For chat handoff** (e.g. after a run, or if CPO wants a one-line read alongside other work) — return a tight headline:
   ```
   Client read (week of <date>):
   - Churn risk (high): <3 accounts>
   - Expansion (warm): <3 accounts>
   - Pattern: <one-line gap or trend if real>
   ```

4. **EV candidates** — only when a pattern is genuinely product-binding (e.g. "5 of 8 mining accounts in churn-risk band are missing the WhatsApp channel — strengthens [Smart_HR_Whatsapp.md](../../../06-Resources/PRDs/Smart_HR_Whatsapp.md) priority").

---

## Hard rules

- **Do not** write to individual `05-Areas/Companies/<Account>.md` pages — that's where person-context-injector + meeting processing operate. Felix's signals folder is the **analytical layer**, not the per-account page.
- **Do not** speculate beyond the data — if activity dropped, *say it dropped*; don't say *"because they're talking to Yoobic"* unless there's a meeting note that says so.
- **Do not** export the raw client list outside the vault.
- **Suspect data values** (>100% activity, etc.) get flagged, not silently corrected.

---

## First-run special pass

On the first Friday after bootstrap (2026-04-22), Felix should additionally:

1. Build the initial `Wyzetalk_Clients/index.md` from the seeded data.
2. Identify the top 3 **Yoobic-vulnerable** accounts (matching churn-risk pattern + retail/comparable vertical to the lost account) and propose them as **active monitoring targets**.
3. Note any account where the activity drop pattern resembles the lost account's pre-loss profile (Shaun to confirm what that profile looked like — informs the model).

---

## Related

- [/weekly-market-intel-custom](../weekly-market-intel-custom/SKILL.md) — weekly outside-in umbrella (**does not** run this skill; read that skill's consolidation table)
- [/customer-intel](../customer-intel/SKILL.md) — generic customer-intelligence skill (`/felix-client-signals-custom` is the Wyzetalk-data flavour)
- [/process-meetings](../process-meetings/SKILL.md) — feeds CSM context Felix reads
- [05-Areas/Companies/Wyzetalk_Clients/](../../../05-Areas/Companies/Wyzetalk_Clients/) — output folder

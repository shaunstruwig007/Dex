---
name: agent-prd
description: Write agent-oriented PRDs (observable behaviors, metrics, work packages, agent-executable validation, technical blueprint). Use when promoting an idea to an implementation-ready spec.
---

## Dex vault (this workspace)

- **Pre-PRD / discovery:** `06-Resources/Product_ideas/` — intake from the product dashboard and `/product-brief`.
- **Binding PRDs:** Flat markdown files under `06-Resources/PRDs/*.md` (no `Current/` / `Next/` / `Future/` subfolders). Each file carries **YAML frontmatter** with **`lifecycle`** aligned to Steerco / PDLC board: `idea` → `discovery` → `design` → **`spec_ready`** → `develop` → `uat` → `deployed`, plus **`parked`**. Older files may still show legacy values (`brief`, `done`) — migrate when touched; **board stage wins** when syncing from `pdlc-ui`. See `06-Resources/PRDs/README.md` and [lifecycle-transitions.md](../../plans/PDLC_UI/lifecycle-transitions.md).
- **Cross-PRD rules:** [PRD_Product_Map.md](../../06-Resources/PRDs/PRD_Product_Map.md).
- **Market evidence (`EV-*`):** [Market_and_competitive_signals.md](../../06-Resources/Market_and_competitive_signals.md).
- **Search:** Use QMD semantic search (`qmd query` with the right collection) per `.cursor/rules/search-routing.mdc`; do not rely on `grep -r` for natural-language vault search.
- **Review swarm:** Parallel sub-agents are orchestration guidance; run the four review passes sequentially if your client does not spawn parallel agents.

---

# Agent-Oriented PRD Writer

**Purpose:** Help users write PRDs that make AI agents more deterministic and successful.

**Based on:** StrongDM's software factory pattern (observable behaviors, satisfaction metrics, holdout scenarios)

**Works in:** Claude Code, Claude Desktop, Cursor, or any AI coding agent harness

---

## When This Skill Activates

User says:
- `/agent-prd [feature description]`
- "Help me write an agent-oriented PRD"
- "Create a PRD for [feature]"

---

## Context Detection (Read First)

Before starting the interactive wizard, detect user's context:

### 1. Company
Search vault for person pages, company pages. Look for:
- User's employer (in their profile or frequently mentioned)
- Current project context

### 2. Analytics Tools
Check for mentions of:
- Pendo
- Amplitude  
- Mixpanel
- Google Analytics
- PostHog

### 3. Project Management Tools
Check for mentions of:
- Linear
- Jira
- Productboard

### 4. Existing PRDs
Search for similar PRDs in vault. Use as templates.

**Output detected context to user:**
```
I see you're at [Company] and use [Analytics Tool] + [PM Tool].
I'll tailor metrics suggestions based on this.
```

### 5. PDLC / design-forward handoff (when applicable)

If the user is writing a PRD from the **`spec_ready`** column (or pastes an **export pack** from `pdlc-ui` / Steerco):

1. **Ingest without asking twice:** brief summary, discovery conclusions, resolved open questions, **Claude Design** session or artefact URLs, **handoff bundle** / `PROMPT.md` path, **HTML export** links, and any notes from **`/anthropic-frontend-design`** (repo paths, branch).
2. **Preserve design intent** in the PRD: reference those artefacts in **Architecture Constraints** or **Technical Blueprint** so implementers do not drift from approved UI.
3. **BDD (Step 3b) is optional:** ask once: *“Do you want Given/When/Then (Gherkin) scenarios for automated tests and Cursor Plan mode, or stick with Success Scenarios prose only for this MVP?”* If they decline or are unsure, **skip Step 3b** and omit the **BDD** section from the generated PRD.

---

## Interactive PRD Wizard

Guide the user through **Steps 1–8** below. After **Step 3**, **offer Step 3b (BDD)** only if the user wants it; otherwise go straight to **Step 4**:

### Step 1: The Job to Be Done
**Ask:** "What should users be able to DO with this feature? (One sentence)"

**Good answer:** "Users can access their terminal session from a mobile browser"
**Bad answer:** "Build a web UI component that renders..."

**If user gives implementation details, redirect:**
"Let's focus on the user outcome first. What job does this feature do for them?"

### Step 2: Observable Behaviors
**Ask:** "Describe what an observer would SEE when this feature works. Be specific."

**Prompt:**
```
Think about:
- What does the user do? (actions)
- What happens on screen? (visible outcomes)
- How fast? (time constraints)
- What changes? (state transitions)
```

**Guide toward scenarios like:**
- User clicks X → Screen shows Y within 2 seconds
- User types message → Response appears in <500ms
- User closes laptop, opens 2 hrs later → Session reconnects automatically

### Step 3: Success Scenarios
**Ask:** "What are the critical scenarios to test? Include at least one error case."

**Generate template:**
```
Scenario 1: [Happy Path]
Setup: [Starting conditions]
Action: [What user does]
Observable Outcome: [What observer sees]
Success Criteria: [Quantifiable target]

Scenario 2: [Error Case]
Setup: [How to trigger error]
Action: [What user does]
Observable Outcome: [How system handles it gracefully]
Success Criteria: [Recovery success rate]
```

### Step 3b (optional): BDD-style acceptance criteria (Gherkin)

**Plain English:** BDD here means writing acceptance checks as **Given** (starting situation), **When** (action), **Then** (what must be true). That format maps cleanly to **automated tests** and to **Cursor Plan mode** (“implement this scenario next”). It adds ceremony; **MVP teams can skip it** and keep **Success Scenarios** from Step 3 only.

**Purpose (when opted in):** Turn scenarios into **Given / When / Then** features that map 1:1 to **automated tests** (e.g. Cucumber, Playwright BDD layer, or pytest-bdd) and to **Cursor Plan mode** work items (“implement scenario X”).

**Ask:** "I'll translate the success scenarios into BDD. Any domain nouns or roles I should fix in the wording?" — **If the user already said they do not want BDD, skip this entire step.**

**Generate for each critical scenario:**

```gherkin
Feature: [Short name aligned to JTBD]

  Scenario: [Happy path name]
    Given [initial context — user state, data, feature flags]
    When [user action or system event]
    Then [observable outcome]
    And [optional extra assertions]

  Scenario: [Error or edge case name]
    Given [context that triggers the edge]
    When [action]
    Then [expected handling — message, redirect, empty state, etc.]
```

**Rules:**

- At least **one** `Scenario` per **happy path** from Step 3 and **at least one** for **errors/edge cases**.
- **Given** sets up **testable state** (avoid vague "user is logged in" — specify role, tenant, or fixture).
- **Then** must describe something an **automated test can assert** (DOM text, URL, API status, DB row), not subjective quality.
- Keep **feature names stable** so file paths for tests can mirror them (e.g. `tests/bdd/<feature-slug>/`).

**Plan mode hint for the user (say aloud once):**

> Use these scenarios as **Plan mode** slices: one scenario (or one `Feature`) per plan chunk so implementation stays traceable to the PRD.

### Step 4: Metrics Strategy
**Context-aware suggestions based on detected analytics tool:**

If analytics tool detected (e.g. Pendo, Amplitude, Mixpanel):
```
For this feature, I recommend tracking:

📊 Events:
- [feature]_started (when user begins)
- [feature]_completed (successful outcome)
- [feature]_error (failure modes)

📈 Metrics:
- Adoption rate (% of users who try feature)
- Completion rate (% who succeed)
- Time-to-complete (median duration)

🎯 Success Targets:
Based on industry benchmarks:
- [X]% adoption within 30 days
- [Y]% completion rate
- <[Z] seconds time-to-complete

Do these metrics align with your goals?
```

If **no analytics tool** detected:
```
What analytics tool do you use?
- Pendo
- Amplitude
- Mixpanel
- Google Analytics
- Other / None

[Based on choice, provide tailored suggestions]
```

### Step 5: Business Outcomes
**Ask:** "How does this feature ladder up to company KPIs?"

**Prompt based on company context:**
```
[If company detected]: 
At [Company], typical product KPIs include [research-based suggestions].
Which does this feature impact?

[If no company]:
What business metric improves if this feature succeeds?
- User acquisition (viral, referral)
- Activation (first value, aha moment)
- Engagement (DAU/MAU, session length)
- Retention (churn reduction)
- Revenue (expansion, upsell)
```

### Step 6: Validation Protocol
**Generate based on feature type:**

For web features:
```
How agents prove it works:

1. Functional Tests
   - [Generate based on observable behaviors]

2. Performance Tests
   - [Generate based on time constraints]

3. Error Handling Tests
   - [Generate based on failure scenarios]

4. Analytics Validation
   - Events fire correctly
   - Data captured accurately

Success Rate: [X] of [Y] checks pass = green light
Target: 85%+ success across 20 test runs
```

### Step 7: Architecture Constraints
**Ask:** "Are there any non-negotiable technical decisions? (frameworks, tools, platforms)"

**Prompt:**
```
Examples:
- "Must use existing component library (don't build custom UI)"
- "Runs as Electron app (not browser extension)"
- "Uses PostHog for analytics (not Amplitude)"

This helps agents avoid exploring paths you've already ruled out.
```

### Step 8: Technical Blueprint

**Purpose:** Give the implementing agent enough architectural detail to start building without a research phase.

**Ask:** "Let me map out how this feature connects to the existing system. I'll research the integration points and draft the technical blueprint — you tell me if anything's wrong."

**The PRD author (AI) should actively research and generate:**

1. **System Integration Map**
   - What existing components does this feature touch?
   - What's the data flow? (draw it as A → B → C)
   - What APIs, SDKs, or protocols are involved?
   - What config files need to change?

2. **Config & Setup Shapes**
   - Show the actual config format (JSON/YAML/env vars) the agent will write
   - Include realistic example values, not placeholders
   - Reference the specific files and their paths

3. **Key Code Patterns**
   - Show the SDK/API calls the agent will use (with actual method signatures)
   - Reference existing code patterns in the codebase the agent should follow
   - Include the critical 2-3 code snippets that define the integration

4. **Dependency Map**
   - What packages/tools need to be installed?
   - What versions? What are the compatibility constraints?
   - What environment variables are required?

5. **Data Flow Diagram**
   ```
   [Component A] --[what data]--> [Component B] --[what data]--> [Component C]
   ```
   Show the actual flow, not abstract boxes.

**Important guidance for the PRD author:**
- This section requires research. Use web search, read docs, inspect the codebase.
- Don't write placeholder text like "[research needed]" — do the research NOW.
- The test: could an agent read this section and start coding within 5 minutes? If not, it's not detailed enough.
- Show real config shapes, real method signatures, real file paths. Not templates.

---

## PRD Generation

After gathering all inputs, generate PRD with this structure:

```markdown
---
prd_id: [feature-name-YYYY-MM-DD]
created_date: [today's date]
project_mgmt_tool: [linear/jira/none]
issue_id: null  # Will be filled when linked
analytics_tool: [pendo/amplitude/etc]
shipped_date: null
metrics_checked_date: null
target_metrics:
  [metric_name]:
    metric_type: [event_count/property_average/funnel]
    target: [X%/Y seconds/Z users]
    timeframe: [7_days/30_days/etc]
    [tool]_event: "[event_name]"
follow_up_tasks:
  - Check metrics 2 weeks post-ship
  - Monthly review (3 month lookback)
---

# [Feature Name]

**Status:** Ready for Agent Implementation  
**Target:** [Who this is for]  
**Estimated Effort:** [X hours agent time]

---

## The Job to Be Done

[One sentence user outcome]

**User value:** [Why this matters]

---

## Work Packages

Break the feature into discrete work packages. Each WP is a unit of work that can be assigned to a single agent. Use this exact heading format for compatibility with agent orchestration tools:

### WP-N: [Title] (P0/P1/P2 — Depends on WP-X, WP-Y / No dependencies)

**Priority:** P0 (critical path), P1 (important), P2 (nice to have)
**Dependencies:** List WP-N IDs this depends on, or "No dependencies"
**Files:** Key files this WP modifies
**VPS-eligible:** Yes/No (can it run on a Linux VPS, or does it need macOS?)

| # | Behavior | Observable |
|---|----------|-----------|
| Na | [What should happen] | [What an observer sees] |

[Repeat for each WP]

**Dependency graph:**
```
WP-1 (P0, no deps) ──> run first
  ├── WP-2 (P0, deps: WP-1)
  └── WP-3 (P1, deps: WP-1)
WP-4 (P2, no deps) ──> can run anytime in parallel
```

---

## Success Scenarios

[Generated from Step 3]

### Scenario 1: [Name]
**Setup:** [Conditions]
**Action:** [User does]
**Observable Outcome:** [What happens]
**Success Criteria:** [Quantifiable]

[Repeat for all scenarios]

---

## BDD / Executable acceptance criteria *(omit this section if Step 3b was skipped)*

**Source:** Step 3b only (map 1:1 from success scenarios).

```gherkin
Feature: [name]

  Scenario: [name]
    Given ...
    When ...
    Then ...
```

**Test mapping (for implementers):**

| Scenario | Suggested test file / suite | Automation notes |
|----------|----------------------------|------------------|
| [name]   | e.g. `tests/e2e/...`       | [Playwright / API / unit — pick based on observability] |

**Cursor Plan mode:** Each `Feature` or `Scenario` can become a **plan step**; complete scenarios before starting unrelated refactors.

---

## Satisfaction Metric

**Overall Success:** [X]% of users [achieve outcome] without [friction]

**Measured by:** [How to validate]

---

## Metrics Strategy

### Events to Track ([Analytics Tool])

[Generated from Step 4]

### Success Targets

[Generated from Step 4]

### Business Outcome Mapping

[Generated from Step 5]

This feature ladders to: [Company KPI]
Expected impact: [Quantified goal]

---

## Architecture Constraints

**Non-Negotiable Decisions:**

[From Step 7]

---

## Technical Blueprint

### System Integration Map

[How this feature connects to existing components]

```
[Component A] --[data/event]--> [Component B] --[data/event]--> [Component C]
```

### Config & Setup

[Actual config file contents the agent will create/modify — real formats, real values]

### Key Implementation Patterns

[SDK/API calls with actual method signatures. Code snippets showing the critical integration points. NOT pseudocode — real, working patterns.]

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [name]  | [ver]   | [why]   |

### Environment Variables

| Variable | Example Value | Where Set | Purpose |
|----------|--------------|-----------|---------|
| [name]   | [value]      | [file]    | [why]   |

---

## Validation Protocol

Every check must be agent-executable — a single shell command that returns a numeric or boolean result. No manual browser interaction. No subjective judgment.

**BDD alignment:** If the PRD includes **BDD / Executable acceptance criteria**, each `Then` (and critical `And`) should eventually have at least one **automated check** here or in the test suite table — if a scenario cannot be checked, tighten the scenario wording until it can. If there is **no** BDD section, rely on **Success Scenarios** + WP checks only.

**Two validation layers:**
1. **Static analysis** (grep, curl, test) — verifies code correctness without a browser
2. **Runtime** (Playwright, if available) — verifies actual behaviour; **prefer tagging** runtime checks to **Gherkin scenario names** when using BDD runners

### WP-N Checks

For each work package, provide checks in this format:

```bash
# Check N.1: [What it verifies]
grep -c "[expected string]" path/to/file.html
# PASS: returns >= 1

# Check N.2: [What it verifies]
curl -s "https://api-url/endpoint" | head -1
# PASS: returns expected content

# Check N.3: [What it verifies]
test ! -d path/to/deleted/dir && echo "PASS" || echo "FAIL"
```

**Rules:**
- Every observable behaviour from the WP table must have a corresponding check
- No `[TBD]` or manual steps — if you can't automate it, redesign the check
- Post-launch metrics (conversion rates, adoption rates) go in a separate "Post-Launch Metrics" subsection and are explicitly flagged as not agent-verifiable at build time

[Repeat for all WPs]

---

## Success Rate Target

**[X] of [Y] checks must pass** in each test run.
**Overall:** [Z]%+ success rate across 20 independent test runs.

---

## Notes for Agent Implementation

**Scout priorities:**
1. [What to research first]
2. [Key docs to read]

**Worker tasks:**
1. [Ordered list of implementation steps]

**Soldier review focus:**
- [Quality checks]
- [Error handling verification]
- [User-friendliness validation]

---

## Files to Create

```
[List with comments]
```

## Files to Modify

```
[List with reasons]
```

## Out of Scope

**Don't Build:**
- [Explicitly ruled out features]
- [Future enhancements]

---

*Generated by `/agent-prd` skill - [date]*
```

---

## PRD Review Swarm (Mandatory — Runs Before User Sees PRD)

**The user never sees a draft.** After generating the PRD, automatically spawn 4 review agents in parallel. Fix everything they find. Only then present the polished PRD.

**Tell the user:** "PRD drafted. Running review swarm — 4 agents are stress-testing it now. I'll come back with the finished version."

### Agent 1: Technical Verification

**Prompt template:**
```
You are reviewing a PRD's Technical Blueprint for factual accuracy. Read the PRD below, then verify every technical claim:

1. **APIs & SDKs** — Do the SDK methods referenced actually exist? Check official docs via web search. Flag any method signature that doesn't match reality.
2. **Config formats** — Do the config file formats match the actual tool's expected format? (e.g., if it references a settings.json hook format, verify that's how the tool actually works)
3. **File paths** — Do referenced file paths exist in the codebase? Are they in the right location?
4. **Dependencies** — Do the packages exist at the specified versions? Are there compatibility issues?
5. **Integration points** — Does the data actually flow the way the diagram claims? Are there missing steps?

For each issue found, return:
- What's wrong (specific line/claim)
- What it should say (corrected version)
- Confidence: HIGH (verified via docs) / MEDIUM (likely but unverified) / LOW (educated guess)

If everything checks out, say so explicitly. Do not invent problems.

PRD:
[full PRD content]
```

### Agent 2: Agent-Readiness

**Prompt template:**
```
You are an implementing agent who has just been handed this PRD. Your job is to build it. Read it carefully, then answer:

1. **5-minute test:** Can you start writing code within 5 minutes of reading this? If not, what's blocking you?
2. **Questions you'd ask:** List every question you would need answered before you could proceed. Each question is a gap in the PRD.
3. **Ambiguity check:** Are there any instructions that could be interpreted two different ways? Flag them.
4. **Missing context:** Is there anything you'd need to look up or research that should have been in the Technical Blueprint?
5. **Dead ends:** Are there any instructions that would lead you down a path that fails? (e.g., "install package X" but package X doesn't support the required feature)

For each issue, return:
- The gap (what's missing or unclear)
- Suggested fix (what the PRD should say instead)
- Severity: BLOCKING (can't proceed) / SLOWING (would waste tokens researching) / MINOR (cosmetic)

If the PRD is implementation-ready, say so explicitly.

PRD:
[full PRD content]
```

### Agent 3: Measurement Audit

**Prompt template:**
```
You are auditing this PRD's success criteria and validation protocol. Every metric and check must be something an agent can evaluate autonomously — binary (yes/no) or numeric (hit threshold or not).

For each success criterion and validation check, answer:

1. **Can an agent run this check?** Without human intervention, without logging into a dashboard, without subjective judgment. Yes or no.
2. **Is it binary or numeric?** "Works well" = FAIL. "Response time < 2s" = PASS. "User is happy" = FAIL. "95% of traces have correct tags" = PASS.
3. **Is the threshold realistic?** Is "95% success rate" achievable or aspirational? Flag thresholds that seem arbitrary.
4. **Can the agent access the data?** If a check requires comparing data across two systems — can an agent actually query both? Or does it need a human to pull data?
5. **Missing measurements:** Are there success scenarios with no corresponding validation check? Are there validation checks with no corresponding success scenario?

For each issue, return:
- The problematic criterion (quote it)
- What's wrong (vague, not automatable, missing, etc.)
- Suggested fix (rewrite to be binary/numeric and agent-executable)

PRD:
[full PRD content]
```

### Agent 4: Completeness & Consistency

**Prompt template:**
```
You are doing a final quality sweep on this PRD. Check for:

1. **Placeholders:** Any "[TBD]", "[TODO]", "[research needed]", "[X]", bracketed placeholders that weren't filled in. Zero tolerance.
2. **Internal contradictions:** Does the Architecture Constraints section say one thing but the Technical Blueprint say another? Do file paths in "Files to Create" match what's referenced in the blueprint?
3. **Orphaned references:** Are there mentions of components, files, or tools that aren't explained elsewhere in the PRD?
4. **Scope creep:** Does the Technical Blueprint or implementation notes include work that's listed in "Out of Scope"?
5. **Missing sections:** Compare against the PRD template structure. Are any required sections empty or missing?
6. **File path accuracy:** Do "Files to Create" and "Files to Modify" match what the Technical Blueprint actually describes?

For each issue, return:
- Location (section and line if possible)
- What's wrong
- Suggested fix

PRD:
[full PRD content]
```

### After Swarm Returns

1. **Collect all findings** from the 4 agents
2. **Fix every BLOCKING and SLOWING issue** — edit the PRD directly, don't just note them
3. **Fix MINOR issues** where the fix is obvious
4. **For issues where the fix requires user input** (e.g., a design decision the agents can't make), note them for the user — but these should be rare. If more than 2 items need user input, the wizard didn't gather enough information.
5. **Re-verify** that fixes didn't introduce new issues (quick scan, not a full re-run)

### Then Present to User

Only after all fixes are applied, present the PRD:

```
PRD complete. Review swarm ran 4 checks:
- Technical Verification: [X issues found, all fixed]
- Agent-Readiness: [X gaps found, all fixed]
- Measurement Audit: [X criteria tightened]
- Completeness: [X issues found, all fixed]

[If any items need user input:]
I need your call on [N] design decisions:
1. [Decision needed]
2. [Decision needed]

PRD saved to: [path]

Ready to proceed?
```

**After user confirms, suggest next step based on complexity:**

- **Complex PRD** (multiple components, UI work, dependencies): "This spec has enough moving parts for the Flywheel. Deploy it to your VPS agent swarm for parallel execution."
- **Simple PRD** (single component, backend-only, straightforward): "Ready to build? Create an issue and start coding, or deploy to a single agent."

If user wants to link to Linear/Jira:
```
I can create a Linear issue and link it to this PRD.

Project: [detect from context or ask]
Title: [feature name]
Description: [brief from PRD]

Create issue? [Y/n]
```

---

## Success Indicators

A good agent-oriented PRD:
- Agents can start coding within 5 minutes of reading the PRD
- Agents don't need a research phase — the blueprint covers integration points
- Agents can build it without asking clarifying questions
- Agents can validate it works without human review
- Every success criterion is binary (yes/no) or numeric (hit threshold or not)
- No subjective language survives the measurement audit ("works well", "good performance", "user is happy")
- The review swarm finds 0 BLOCKING issues — if it finds any, the wizard phase didn't gather enough info
- Metrics are auto-measurable (via analytics tool integrations)
- PRD manages its own lifecycle (ship detection, metrics check)

**The user's job is to validate intent** ("is this the right thing to build?"), **not to QA quality** ("is the PRD well-written?"). Quality is the skill's job. If the user finds technical errors, missing sections, or vague criteria in the PRD, the review swarm failed.

If user needs to explain things to the agent mid-build, the PRD wasn't clear enough.

---

*This skill implements the StrongDM software factory pattern with a mandatory review swarm for quality assurance.*

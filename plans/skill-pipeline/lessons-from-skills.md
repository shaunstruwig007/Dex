# Lessons from the skill pipeline

**Status:** SEED (empty — fills during Sprints 1–6)
**Purpose:** Capture what worked, what didn't, and what a future `pdlc-ui` would need — based on real dogfood evidence from the chat+vault pipeline. This file seeds any future UI replan.

**Fill discipline:** After each sprint's dogfood run, append one dated row per lesson. Be specific. Cite the initiative + the vault path + the minute-cost, not vibes.

---

## Lessons by sprint

### Phase 0 — Freeze + housekeeping

_(nothing to log yet)_

### S1 — Felix (upstream intel umbrella)

_(fill after the first Friday dogfood run)_

- **What worked:**
- **What didn't:**
- **What Moneypenny needs from Felix that wasn't obvious:**
- **Cost actual vs ceiling:**

### S2 — Moneypenny (per-initiative debrief)

_(fill after the first real idea run)_

- **What worked:**
- **What didn't:**
- **Brief-question ergonomics (why / who / what) in chat vs wizard:**
- **How much context did existing PRDs add?**
- **Cost actual vs ceiling ($0.50):**

### S3 — `/design-prompt-custom`

_(fill after first prompt → Claude Design or designer session)_

- **Did the designer work unaided from the prompt?**
- **What information was missing?**
- **Claude Design output quality vs human designer output:**
- **Cost:**

### S4 — M + Q critique

_(fill after critiques run against S2 + S3 outputs)_

- **Were 3 rows (M) enough?**
- **Were 4 rows (Q) enough?**
- **What critique surfaces did the shrunken versions miss?**

### S5 — Bond (PRD author)

_(fill after first real PRD)_

- **Did Cursor Plan mode consume the PRD without re-prompting for structure?**
- **What sections got re-prompted by Plan mode?**
- **What `/agent-prd` features did Bond need to keep?**
- **Cost:**

### S6 — End-to-end dogfood

_(fill after the full-pipeline run on a fresh idea)_

- **Total wall-clock:** (target: <1 working day)
- **Total LLM cost:** (target: <$5)
- **Number of human re-prompts:** (target: <2)
- **Cursor Plan mode consumption quality:**
- **Biggest friction point end-to-end:**
- **Cheapest-possible improvement:**

---

## Cross-cutting lessons (fill any time)

### Context / session-hooks discipline

- **Did the session-start hook save measurable tokens per session?**
- **Which files should be in the preamble vs on-demand?**

### Cost discipline

- **Where did the LLM costs actually concentrate?**
- **Any skill that blew its ceiling — why?**

### Handoff quality (skill → skill)

- **Which output was hardest for the next skill to consume?**
- **Which output was cleanest?**

### What a UI would need (seed for future pdlc-ui revisit)

_(only fill if S6 lands clean and a UI decision is on the table)_

- **What's the single most valuable view on the vault markdown?**
- **Which parts of the pipeline would benefit from a UI vs stay in chat?**
- **What would break if a UI sat on top of this pipeline today?**

---

*Seed file created 2026-04-24 as part of the pivot away from pdlc-ui toward the skill pipeline. Fill as real evidence accumulates.*

---
session_date: 2026-04-30
session_type: walkthrough-4 — first real-world bond_v1 authoring on exec-driven initiative
upstream:
  - 06-Resources/Product_ideas/smart-hr-whatsapp_discovery.md  # Path B discovery, 2026-04-30
  - 06-Resources/Product_ideas/whatsapp-spike-findings.md  # paraphrased Jan, 2026-04-30
deliverables:
  - 06-Resources/PRDs/Smart_HR_Whatsapp.md  # bond_v1 reshape (overwrite of prior agent-prd shape)
related_sessions:
  - plans/skill-pipeline/sessions/2026-04-29.md
  - plans/skill-pipeline/sessions/2026-04-29-walkthrough-2-critiques.md
  - plans/skill-pipeline/sessions/2026-04-29-walkthrough-3-fold-and-handoff.md
---

# Walkthrough 4 — Smart HR on WhatsApp, bond_v1 reshape (Path B)

**One-line outcome:** First real-world exercise of the new exec-roadmap-aware pipeline (`/initiative-discovery-custom` → `/prd-author-custom`) on an exec-driven priority. Spike findings entered the loop mid-flight; bond_v1 spec held up; Slice 1 walking-skeleton was thickened (auth + payslip together) rather than relaxed.

---

## What happened

1. **Yesterday (2026-04-29):** discovery doc authored against exec_roadmap.md priority #1. Sparse-evidence posture worked as intended — discovery cited exco ratification + JEM profile + Friday signal as triangulation, did not invent customer interviews. Surfaced 8 open questions, 6 evidence gaps. Highest-priority gap: **engineering spike verbal-only** (Jan's tech-forum report had no recording).
2. **This morning (2026-04-30):** user provided Jan's spike findings paraphrased. Five concrete data points: (1) WA Flow + endpoint connection works, (2) media URL = payslip transport (needs stress test), (3) Sage = first HRIS, (4) elevated auth required for first access (NOT deferrable), (5) team capacity constrained.
3. **Captured spike findings** as a parallel note (`whatsapp-spike-findings.md`) — not in the discovery doc itself, because the discovery doc operates on vault content and the spike findings are interview-derived. Note explicitly marks "paraphrased pending Jan validation" so we don't pretend the verbal report has been ratified.
4. **Updated discovery doc** to close evidence gap #2, add Sage as Slice 1 HRIS, upgrade exec-roadmap "Identified gaps" from background risk to **binding capacity risk** (engineering can't yet do the work).
5. **Authored bond_v1 PRD** (overwrite of prior agent-prd shape, per user "rerun" instruction; git diff is the audit trail). Slice 1 was originally drafted by discovery as "phone-as-identity, no Magic Link"; the spike findings invalidated that — elevated auth is required for first access, not deferrable. **Slice 1 was therefore thickened, not relaxed.**

---

## Lessons (worth promoting)

### 1. Spike findings can change slicing mid-flight. The skill must accept this gracefully.

The discovery doc proposed Slice 1 = phone-as-identity (no auth gate). The spike findings turned that into Slice 1 = auth + payslip (one slice, two layers). The bond_v1 spec handles this cleanly because the walking-skeleton rule is "smallest end-to-end cut," not "single feature." When the smallest cut needs N features to be a real demo, N features it is.

**Lesson for the skill:** when a spike-findings input is provided alongside the discovery doc, `/prd-author-custom` should treat the spike as a higher-priority overlay than the discovery's slice proposals. Discovery proposes; spike + author refine.

### 2. Capacity is a binding risk, not a footnote.

The user's verbatim line — *"Team is not yet there to do this due to pressure and bug fixes"* — is the kind of constraint that, if not surfaced in the Status line + Slice 1 demo readiness, will silently slip the demo target by another 4–6 weeks. The bond_v1 PRD now puts engineering capacity confirmation as a **demo-readiness gate**, not a risk.

**Lesson for the skill:** when discovery surfaces a "capacity constrained" signal from the exec roadmap or stakeholder commentary, `/prd-author-custom` should auto-promote it from §7 Risks to §5c Slice 1 demo readiness as a checklist gate. Don't let it live only in Risks — Risks are read once; checklists block sign-off.

### 3. Spike-findings note as a parallel artefact (not folded into discovery).

The spike findings are interview-derived; the discovery doc is vault-derived. Folding them into the discovery doc would muddy the provenance — discovery's job is to triangulate from the vault, not to capture interview output. The parallel artefact pattern keeps each input clean:

- `discovery.md` — what the vault says.
- `spike-findings.md` — what the engineer said (paraphrased pending validation).
- `prd.md` — what the build team will pick up (synthesises both).

**Lesson for the skill:** `/initiative-discovery-custom` should explicitly recommend a `<feature>-spike-findings.md` parallel artefact when a verbal-only engineering spike is identified as a gap. This is a small file — 30 lines — but it is the audit trail for the synthesis.

### 4. "Rerun" defaults to overwrite when there's no edit conflict to surface.

Idempotence rule says: "File exists, edited since last bond run → ask before overwriting." But `Smart_HR_Whatsapp.md` had no `last_bond_run` (first time it's been bond-run). Strictly, the skill should still ask — there's a `last_status_update` (2026-04-17) showing human edits. The author's call here was to overwrite (per user "rerun") because the legacy content is preserved in git history and the discovery doc + spike-findings note already capture the audit trail.

**Lesson for the skill:** add a clarification to the Idempotence rule: *when migrating from a non-bond_v1 shape AND the user explicitly says "rerun" (not "save-as"), default to overwrite, with the prior shape preserved in git history. Cite the git commit hash in the PRD's footer.*

### 5. The body Status line is now a load-bearing artefact.

Slice 1 has THREE hard gates (Q1 spike ratification, Q4 Elevated_Auth workshop, Q8 Messaging_Ops Part 2 config seam). Without surfacing those in the body Status line, an external reader (design manager, software dev manager) sees `lifecycle: spec_ready` and assumes "ready to build." It is not. The body Status line names the gates explicitly so the false signal doesn't fire.

**Lesson for the skill:** the bond_v1 spec already requires the body Status line to mirror frontmatter. We should extend it: *when there are hard gates between current lifecycle and the next state, the body Status line must name them.* This is more than mirroring — it's de-risking the false-confidence read.

---

## What's pending

- [ ] Jan to ratify the spike findings paraphrase (Q1 in PRD).
- [ ] Elevated_Auth_Remote_App.md Phase 1 workshop scheduled (Q4 — task-20260323-008).
- [ ] Messaging_Ops Part 2 + Smart HR WhatsApp tenant-config seam joint review (Q8).
- [ ] `/critique-product-custom` and `/critique-engineering-custom` runs on the bond_v1 PRD (`critique_status: pending`).
- [ ] Slice 2 design pass — Magic Link landing in Blue (`design_pass_status: pending`; scheduled when Claude Design credit resets).
- [ ] Engineering capacity confirmation for end-April / end-May 2026 demo target.

---

## What this validates about the pipeline

This is the cleanest end-to-end run of the new pipeline so far. The four pipeline guardrails held:

1. **Discovery refused to invent customer evidence** (sparse-vault posture worked).
2. **Spike findings entered as a parallel artefact** (provenance preserved).
3. **`/prd-author-custom` enforced bond_v1 shape** (test shape per slice, demo readiness, technical failure modes, a11y, build handoff all present).
4. **Hard gates surfaced in body Status line** (no false-confidence read possible).

What still costs friction: the manual capture of Jan's verbal spike. Until the org has a recording / write-up cadence for tech-forum spikes, this will keep happening. The spike-findings note pattern at least makes the cost visible.

---

*Authored 2026-04-30 by Shaun + Cursor agent. First real-world bond_v1 PRD on an exec-driven priority. Lessons should fold back into `plans/skill-pipeline/lessons-from-skills.md` next session.*

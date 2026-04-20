# PDLC export pack — `{{INITIATIVE_TITLE}}`

**Initiative ID:** `{{INITIATIVE_ID}}`  
**Exported:** `{{EXPORT_DATE_ISO}}`  
**Export version:** `1` — bump when re-exporting after material changes (brief, discovery, or design links).

_Use this file as the single upload into **Claude Design** (and as the paste-in header for **`/anthropic-frontend-design`** in Cursor). Replace every `{{…}}` placeholder; remove sections that do not apply._

---

## 1. One-line intent

{{ONE_LINE_OUTCOME}}

---

## 2. Context for design (from brief + discovery)

### Problem / opportunity

{{PROBLEM_OR_OPPORTUNITY}}

### Target user / persona

{{TARGET_USER}}

### Scope — in

{{SCOPE_IN}}

### Scope — out

{{SCOPE_OUT}}

### Constraints (ICT, brand, performance, locales)

{{CONSTRAINTS}}

### Discovery conclusions (resolved)

{{DISCOVERY_RESOLVED_BULLETS}}

### Open questions still pending (if any)

{{OPEN_QUESTIONS_OR_NONE}}

---

## 3. Design system instructions (read before designing)

**Do not invent a parallel visual system.** This initiative must align with the **design system already connected in Claude Design** for our organisation (themes, colour tokens, typography, spacing, and core components).

1. In **Claude Design**, confirm the **active team / org design system** matches our **Figma library** (manual sync is expected between Figma and Claude Design — treat Figma as naming reference if anything looks stale).
2. Use **existing primitives and patterns** from that DS for this feature. If a pattern does not exist, **extend minimally** and call out **new tokens or components** in the “Notes for spec” section below — do not silently introduce one-off styles.
3. **Figma library (reference):** {{FIGMA_LIBRARY_URL}}  
   **Optional node / frame:** {{FIGMA_NODE_URL_OR_REMOVE}}

**Accessibility:** Meet the same bar as the rest of the product (contrast, focus order, hit targets) unless this export explicitly documents a temporary exception for prototype-only review.

---

## 4. Artefacts to attach in Claude Design (if not pasted above)

| Kind | URL or path |
|------|-------------|
| Prior mocks / screenshots | {{URL_OR_REMOVE}} |
| Related PRD (read-only) | {{PRD_PATH_OR_URL_OR_REMOVE}} |

---

## 5. Lo-fi / hi-fi ask (for Claude Design)

**Lo-fi (required):** {{LO_FI_ASK — e.g. key screens, empty/loading/error states, primary flow}}

**Hi-fi (only if `hiFiRequired` on card):** {{HI_FI_ASK_OR_REMOVE}}

---

## 6. Notes for spec / engineering (after visual sign-off)

{{ENGINEERING_NOTES — APIs, data, edge cases}}

---

## 7. Implementation polish (Cursor — after Claude Design)

**When:** After **lo-fi** (and **hi-fi** if applicable) is approved in **design review**, and you have **Claude Design** output to hand off.

**Do:**

1. Copy into **Cursor** (or open the repo that will receive the UI): the **handoff bundle**, **`PROMPT.md`**, **HTML export**, or the **key screens** Claude Design produced.
2. Run **`/anthropic-frontend-design`** and paste **this entire export pack** plus the **handoff materials**. Instruct the agent to **preserve layout and hierarchy** from the Design session and only refactor toward **production** concerns (routing, state, accessibility hardening, tests).

**Repo / branch (if known):** `{{REPO_OR_BRANCH_OR_REMOVE}}`

**Do not:** Start a fresh visual direction that contradicts the signed-off Claude Design session unless Steerco explicitly requests a reset.

---

## 8. Checklist before upload

- [ ] All `{{placeholders}}` filled or removed  
- [ ] Section **3** read and understood — DS is **in Claude Design**, not re-specified from scratch here  
- [ ] Figma library link is current  
- [ ] Section **7** deferred until after design review (unless doing a spike)

---

*Canonical template: `plans/PDLC_UI/export-pack-template.md` — copy per initiative; keep exports in git or attach store per org policy.*

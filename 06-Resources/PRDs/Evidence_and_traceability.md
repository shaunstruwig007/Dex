# Evidence & traceability (lightweight)

**Purpose:** Tie **discovery** to **PRDs and acceptance criteria** without duplicating Jira, Confluence, Monday, or Bitbucket. The vault stays the **narrative + decision record**; other tools stay **system of record** for tickets and code.

**Companion:** [Evidence_register.md](./Evidence_register.md) — central list of `EV-*` IDs.

---

## What “evidence” means here

| Type | Examples | Typical source |
|------|----------|----------------|
| **market** | Category trend, analyst take, competitor move | Newsletter, YouTube transcript, webinar notes |
| **competitive** | Feature comparison, pricing motion, positioning | Competitor site, G2, release notes |
| **customer** | Pain, request, workaround (non-sensitive) | Call notes, CS summary, sanitized CRM theme |
| **internal** | Stakeholder decision, constraint | Meeting note, ADR, design review |

Nothing sensitive belongs in the register — **themes and links**, not account names unless policy allows.

---

## Minimal workflow

1. Something informs a spec or AC → add one row to [Evidence_register.md](./Evidence_register.md), assign `EV-YYYY-MM-NNN`.
2. In the PRD or AC file → reference `EV-*` where it matters.
3. In Jira/Monday (optional) → put `EV-*` in the description.

---

## Where to put references

### Option B — PRD body (recommended to start)

After the title block:

```markdown
## Evidence (discovery)

| ID | Relevance |
|----|-----------|
| [EV-2026-03-001](./Evidence_register.md) | Informs audience + publish rules |
```

### Option C — Acceptance criteria companion

End of file:

```markdown
## AC ↔ evidence (optional)

| AC ID | Evidence IDs | Note |
|-------|----------------|------|
| PO-06 | EV-2026-03-001 | Why “no group” blocks publish |
```

---

## Maintenance

- **Product map** ([PRD_Product_Map.md](./PRD_Product_Map.md)): update when **cross-PRD** evidence changes canonical rules.

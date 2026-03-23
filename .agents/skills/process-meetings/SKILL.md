---
name: process-meetings
description: Process synced Granola meetings to update person pages, extract tasks, and organize meeting notes
model_hint: balanced
context: fork
hooks:
  PostToolUse:
    - matcher: Write
      type: command
      command: "node .claude/hooks/post-meeting-person-update.cjs"
  Stop:
    - type: command
      command: "node .claude/hooks/meeting-summary-generator.cjs"
---

# Process Meetings (canonical)

**Canonical instructions:** `.claude/skills/process-meetings/SKILL.md`

Follow that file for the full workflow, arguments, and edge cases. Hooks above stay in sync with `/process-meetings`. Do not duplicate long-form content here — edit only `.claude/skills/process-meetings/SKILL.md`.

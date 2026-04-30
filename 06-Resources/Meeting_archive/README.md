# Meeting Archive

Durable, tracked meeting records that need to survive ownership changes (handoffs, role transitions, archived projects).

**This is NOT the personal inbox.** Routine meeting capture goes to `00-Inbox/Meetings/` (gitignored, local-only). Files in this folder are deliberate — they capture decisions, exec direction, or context that future maintainers will need.

**Conventions:**
- Filename: `YYYY-MM-DD - <Topic>.md`
- Frontmatter: include `participants`, `date`, `type`, `related` (links to PRDs, roadmap, etc.)
- Body: TL;DR · Decisions · Action items · Threads
- If a meeting authored or amended `System/exec_roadmap.md`, link it explicitly.

**When in doubt:** if losing this meeting record would cost the next owner more than 30 minutes to reconstruct, it belongs here.

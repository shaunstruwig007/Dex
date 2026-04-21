# Operator cheatsheet — when you run things by hand

**Who this is for:** you’re vibe-coding the UI; you don’t want a laundry list of terminal commands. This page is the **one place** that says what you touch yourself vs what runs automatically.

---

## Every coding session (almost always this only)

1. Open a terminal.
2. Run:

```bash
cd pdlc-ui
npm run dev
```

3. Open your browser:

| What to open            | URL                                                                  | What you should see                                                     |
| ----------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Main app (shell)**    | [http://localhost:3000](http://localhost:3000)                       | Header “PDLC Orchestration”, card, buttons, menu — no red error overlay |
| **Health check (JSON)** | [http://localhost:3000/api/health](http://localhost:3000/api/health) | `{"status":"ok",...}` in the browser                                    |
| **Readiness stub**      | [http://localhost:3000/api/ready](http://localhost:3000/api/ready)   | `{"ready":true}`                                                        |

Stop the app: in the terminal, press **Ctrl+C**.

---

## Before you merge (if you use GitHub + pull requests)

**Expect:** you push your branch and open a PR — **GitHub Actions** runs lint, tests, schema check, and a quick accessibility smoke test. You **do not** need to run those scripts yourself unless CI is red and you’re debugging.

If you’re **not** using PRs/CI, run once before you consider the work “done”:

```bash
cd pdlc-ui
npm ci
npm run lint && npm run format:check && npm run typecheck && npm run schema:validate && npm test
```

After a sprint merges (or before a demo), optional human pass: [Sprint smoke checklists](./smoke/README.md) — short UX steps; CI still owns regression.

---

## Rare: backups and restore

**When:** you have real data under `pdlc-ui/data/` (mostly **Sprint 1 onward**) or you want a snapshot before a risky change.

**Where to read:** [BACKUP_RUNBOOK.md](./BACKUP_RUNBOOK.md) — daily script path, retention, restore steps.

**Manual command (example):** from the repo root, after `cd pdlc-ui`:

```bash
./scripts/backup-daily.sh
```

On a server you’d usually schedule that once a day (cron) — same runbook explains the idea; you don’t run it every vibe session.

---

## Optional: TipTap dev page (not linked from the home page)

| URL                                                                                  | Purpose                                                                                                                |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| [http://localhost:3000/dev/editor-preview](http://localhost:3000/dev/editor-preview) | Read-only rich text demo — proves the editor packages build; **not** wired to real initiative data until later sprints |

---

## Deeper detail (only when you need it)

| Topic                            | Doc                                                                      |
| -------------------------------- | ------------------------------------------------------------------------ |
| Deploy / rollback / audit policy | [OPERATIONS.md](./OPERATIONS.md)                                         |
| Backups + restore drill          | [BACKUP_RUNBOOK.md](./BACKUP_RUNBOOK.md)                                 |
| Sprint-close smoke (manual UX)   | [smoke/README.md](./smoke/README.md)                                     |
| All `npm run` scripts            | [README.md](../README.md) (Scripts table)                                |
| Stack and persistence decisions  | [adr/0001-stack-and-persistence.md](./adr/0001-stack-and-persistence.md) |

---

_Keep this file short. If a new “you must run this by hand” step appears, add **one row** to the right section above — don’t scatter commands across the repo._

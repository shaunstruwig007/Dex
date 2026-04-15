# Fork maintenance (this vault)

This repository is a **personal Dex vault** built on the public template **[davekilleen/dex](https://github.com/davekilleen/dex)**.

## Remotes

| Remote | URL | Purpose |
|--------|-----|---------|
| **origin** | Your GitHub fork (e.g. `shaunstruwig007/Dex`) | Push your vault, tasks, PRDs, and customizations. |
| **upstream** | `https://github.com/davekilleen/dex.git` | Pull Dex core updates (skills, `core/`, installer). |

Add upstream once:

```bash
git remote add upstream https://github.com/davekilleen/dex.git
```

## Updating Dex core

Prefer **`/dex-update`** in Claude Code (handles merge, protected blocks, dependencies). From the CLI:

```bash
git fetch upstream
git merge upstream/release --no-edit
```

Resolve conflicts; preserve **`CLAUDE.md`** `USER_EXTENSIONS_START` … `END` and your vault data under `00-`–`07-`, `System/user-profile.yaml`, etc.

## What lives here

- **Tracked in this fork:** Wyzetalk work (projects, PRDs, market intelligence, competitors, quarter goals) as you choose to commit.
- **Do not open PRs to upstream** with customer-specific content; keep those commits on **origin** only.

## Related docs

- [README.md](README.md) — Dex product overview (template)
- [Dex_System/Dex_Technical_Guide.md](Dex_System/Dex_Technical_Guide.md) — technical setup
- [.claude/skills/dex-update/SKILL.md](.claude/skills/dex-update/SKILL.md) — guided update flow

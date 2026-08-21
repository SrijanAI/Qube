# Qube - Shared Team Context for Claude CLI

This repo stores conversation context, decisions, and project knowledge so all team members share the same Claude CLI context.

## Structure

```
Qube/
  README.md               # This file
  projects/               # Per-project context
    <project-name>/
      context.md          # Project overview, stack, decisions
      decisions.md        # Key architectural/product decisions
      progress.md         # Current state and what's in progress
  team/
    conventions.md        # Coding conventions and standards
    workflow.md           # Team workflow and processes
  conversations/
    YYYY-MM-DD-topic.md   # Notable conversation summaries
```

## How It Works

- **Auto-sync**: Claude CLI automatically pulls this repo at session start and pushes updates at session end
- **During conversations**: Claude writes context files as discussions happen
- **Team usage**: Any team member's Claude CLI picks up the latest shared context on startup

## Setup for Team Members

```bash
git clone https://github.com/SrijanAI/Qube.git ~/Qube
```

Then add the qube-sync hook to your Claude CLI settings (`~/.claude/settings.json`):

```json
"SessionStart": [{ "hooks": [{ "type": "command", "command": "CLAUDE_HOOK_EVENT=SessionStart node ~/.claude/hooks/qube-sync.js", "timeout": 15 }] }],
"Stop": [{ "hooks": [{ "type": "command", "command": "CLAUDE_HOOK_EVENT=Stop node ~/.claude/hooks/qube-sync.js", "timeout": 30 }] }]
```

And copy `~/.claude/hooks/qube-sync.js` from Srijan's machine (or from `hooks/qube-sync.js` in this repo).

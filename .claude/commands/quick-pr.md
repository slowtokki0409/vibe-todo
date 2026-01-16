---
description: Commit changes, push to origin, and create a Pull Request in one go.
allowed-tools: run_command
---

## Context
- Git Status: !`git status`
- Current Branch: !`git branch --show-current`

## Task
1. Check if there are uncommitted changes.
2. If yes, stage all changes (`git add .`).
3. Commit with a descriptive message based on the changes.
4. Push the branch to origin.
5. Create a PR using `gh pr create --fill` (if `gh` CLI is available) or output the URL to create it manually.
6. Provide a summary of actions taken.

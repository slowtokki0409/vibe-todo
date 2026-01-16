---
description: Create a checkpoint of the current context for a fresh session.
allowed-tools: run_command
---

## Context
- Git Status: !`git status`
- Task Status: !`cat Tasks.md`
- Recent Artifacts: !`ls -t _artifacts/ | head -5`

## Task
You are the **Memory Keeper**. Your goal is to compress the current state so the next agent can pick up exactly where we left off.

1. **State Summary**:
   - Analyze `Tasks.md` to see what was just finished and what is next.
   - Summarize any uncommitted changes or pending decisions.

2. **Generate Checkpoint**:
   - Create a file `_artifacts/checkpoint_latest.md`.
   - Content format:
     ```markdown
     # 🚩 Checkpoint: [Date]
     ## 🟢 Completed
     - ...
     ## 🟡 In Progress
     - ...
     ## 🔴 Next Targets
     - ...
     ## 🧠 Context Notes for Next Agent
     - ...
     ```

3. **User Instruction**:
   - Save the file.
   - Tell the user: "Checkpoint saved. Please start a **New Chat** and ask me to 'Load Checkpoint'."

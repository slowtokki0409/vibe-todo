---
description: Perform an AntiGravity Quality Assurance Review against the CLAUDE.md protocol.
allowed-tools: view_file, run_command, list_dir
---

## Context
- Project Protocol: !`cat CLAUDE.md`
- Recent Artifacts: !`ls -dt _artifacts/* | head -5`
- Git Status: !`git status`

## Task
You are the **AntiGravity QA Sentinel**. Your job is to verify alignment with our "Hybrid Relay Protocol".

1. **Protocol Check**:
   - Verify that `CLAUDE.md` is being followed.
   - Specifically check if "Artifacts" have been created for recent major changes.

2. **Visual Vibe Check (Skill)**:
   - Execute: `python3 .claude/skills/vibe-check/scripts/capture_evidence.py`
   - Verify `_artifacts/vibe_check.png` was created.

3. **Code Vibe Check**:
   - Briefly review recent changes in `src/`.
   - Does the code reflect the "Premium Vibe" (Tailwind v4, Framer Motion)?

4. **Report Generation**:
   - **Load Rubric**: !`cat .claude/Scorecard.md`
   - **Precognition**: Use a `<thinking>` block to analyze evidence criticaly.
   - **Grading**: Evaluate the current state against the Scorecard rubrics.
   - **Output**: Generate a filled-out Scorecard in `_artifacts/review_<date>.md` and print the summary to the terminal.



4. **Output**:
   - Print the report to the terminal.
   - (Optional) Save it to `_artifacts/qa_report_<timestamp>.md`.

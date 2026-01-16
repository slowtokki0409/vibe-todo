---
name: vibe-check
description: Automated visual verification skill. Launches the app, captures a screenshot, and saves it to _artifacts for review.
---

# Vibe Check Skill

This skill automates the process of "seeing" the current state of the application. It is used by the QA Sentinel to verify UI changes without manual intervention.

## Components
- `scripts/capture_evidence.py`: A Python script that:
  1. Starts the Vite dev server on port 5174 (to avoid conflicts).
  2. Uses Playwright to navigate to the app.
  3. Captures a full-page screenshot.
  4. Saves it to `_artifacts/vibe_check.png`.
  5. Cleanly shuts down the server.

## Usage
To use this skill, run the following command:
```bash
python3 .claude/skills/vibe-check/scripts/capture_evidence.py
```

## Dependencies
- `playwright` (python)
- `npm` (project dependencies installed)

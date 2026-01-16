---
description: Lightweight triage command to identify relevant files before heavy lifting
allowed-tools: run_command, find_by_name, grep_search
---

# Triage Command: File Scout

This command acts as a "scout" to identify *only* the comprehensive list of files relevant to a user request, without attempting to modify them or generate full code. This saves token costs and context window space for the subsequent "Heavy" agents.

## Algorithm

1.  **Analyze Request**: Extract key terms (e.g., "auth", "login", "header", "animation").
2.  **Broad Search**: Use `find` or `ls -R` to map the directory structure.
3.  **Deep Search**: Use `grep` to find specific occurrences of key terms in the codebase.
4.  **Filter**: Exclude `node_modules`, `dist`, `.git`, and lockfiles.
5.  **Output**: Generate a minimal JSON list of relevant files.

## Usage

```bash
/triage "Add a login button to the header"
```

## Protocol

1.  **Do NOT read file contents** unless absolutely necessary to distinguish between files with same names.
2.  **Do NOT propose code changes.**
3.  **Output Format**: STRICTLY return a JSON block at the very end.

```json
{
  "relevant_files": [
    "/absolute/path/to/src/components/Header.tsx",
    "/absolute/path/to/src/styles/header.css"
  ],
  "reasoning": "Header.tsx contains the nav logic, header.css handles styling."
}
```

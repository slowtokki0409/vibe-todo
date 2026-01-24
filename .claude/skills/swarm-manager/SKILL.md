---
name: swarm-manager
description: Advanced Orchestrator-Workers pattern implementation for parallel task execution using Anthropic API.
---

# Swarm Manager (Parallel Architecture)

This skill enables the **Orchestrator-Workers** pattern, allowing AntiGravity to spawn multiple sub-agents (Workers) to execute tasks in parallel.

## Architecture
- **Orchestrator**: Defines the sub-tasks and assigns them.
- **Workers**: Independent LLM instances that execute the sub-tasks.
- **Synthesizer**: Merges the results.

## Usage
This skill is primarily used via the `/swarm` command.

```bash
/swarm "Refactor all files in src/components to use arrow functions"
```

## Prerequisite
- You must have a valid `ANTHROPIC_API_KEY` exported in your environment.
- Python packages: `anthropic`, `tqdm`

## Scripts
- `orchestrator.py`: The main engine.

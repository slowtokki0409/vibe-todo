# Command: /swarm

## Description
Launch the AntiGravity Swarm (Multi-Agent Parallel Execution) to modify multiple files simultaneously.
Uses the "Orchestrator-Workers" pattern.

## Usage
`/swarm "Instruction"`

## Example
`/swarm "Add JSDoc comments to all components in src/components"`
`/swarm "Refactor all CSS files to use Tailwind classes"`

## Execution
This command executes the localized python orchestrator.
Use `pip install -r .claude/skills/swarm-manager/requirements.txt` if dependencies are missing.

```bash
python3 .claude/skills/swarm-manager/orchestrator.py "$1"
```

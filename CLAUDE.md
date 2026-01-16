# 🧠 AntiGravity Orchestration Context

> **SYSTEM INSTRUCTION**: You are an autonomous agent working under the AntiGravity Orchestrator.

## 🚨 CRITICAL: Rule Loading Protocol
Before executing ANY task, you must strictly adhere to the following Constitution.
You are NOT just a chatbot; you are a role-based worker.

### 1. Read Your Orders
### 2. Hybrid Relay Protocol (AG x CC)
> **Single Source of Truth**: This file is the Master Protocol.

| Agent | Role | Responsibility | Token Strategy |
| :--- | :--- | :--- | :--- |
| **Architect** | Claude Code | Initial Setup, Big Refactors | High Value / Paid |
| **Builder** | AntiGravity | Logic, UI, Bugfixes | Zero Cost / Free |

**Standard Operating Procedure**:
1. **Architect Phase**: Claude Code builds the skeleton/scaffolding -> Handover via `_artifacts/`.
2. **Builder Phase**: AntiGravity takes over for direct implementation.
3. **Handover Rule**: "If it's not in `_artifacts/`, it didn't happen."

### 3. Accelerated Workflows (Commands)
You can trigger specialized agent workflows using custom commands defined in `.claude/commands/`:
- **`/quick-pr`**: Automates the git add-commit-push-pr cycle.
- **`/ag-review`**: Runs an AntiGravity QA check on code and protocol compliance.
- **`/checkpoint`**: Saves context and guides a session reset.


### 4. Load Your Skills (Role-Based)
Act according to the specific rules defined involved in your task:
- **Coding?** -> Apply `.claude/rules/code_architect.md`
- **Testing?** -> Apply `.claude/rules/qa_engineer.md`
- **Planning?** -> Apply `.claude/rules/project_manager.md`

### 5. Execution Standard
- **No Artifact = No Success**: If you didn't save a file to `_artifacts/`, you didn't do the job.
- **Context Awareness**: Always check `_artifacts/` to see what previous agents have done.

### 6. Language & Communication Standard
- **Terminal Output (Final Report)**: MUST be in **Korean (한국어)**. This is for the User.
- **Artifacts (Logs/Docs)**: Write in **English** for speed and token efficiency.
- **Code Comments**: English is preferred for technical accuracy.

---
*End of System Instruction*

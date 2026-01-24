# Claude Code 분석 보고서
**대상**: AntiGravity & Claude Code 통합 검토  
**작성일**: 2026-01-17  
**분석 범위**: https://github.com/anthropics/claude-code 및 공식 문서

---

## 📋 실행 요약 (Executive Summary)

Claude Code 저장소와 문서를 정밀 분석한 결과, **AntiGravity에 적용 가능한 7가지 핵심 개념**을 발견했습니다. 특히 **플러그인 시스템, Skills 아키텍처, 서브에이전트 자동 위임, CLAUDE.md 메모리 관리** 등이 현재 AntiGravity의 Skills System과 시너지를 낼 수 있습니다.

---

## 🎯 핵심 발견 사항

### 1. **Plugin System Architecture** ⭐⭐⭐⭐⭐
**우선순위**: 최상  
**적용 난이도**: 중상

#### Claude Code의 접근 방식
```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # 플러그인 메타데이터
├── commands/                # Slash commands (optional)
├── agents/                  # Specialized agents (optional)
├── skills/                  # Agent Skills (optional)
├── hooks/                   # Event handlers (optional)
├── .mcp.json                # External tool configuration (optional)
└── README.md                # Plugin documentation
```

#### AntiGravity에 적용 가능한 부분
- **현재 상황**: AntiGravity는 `.agent/skills/` 폴더에 SKILL.md 방식으로 스킬을 관리
- **개선 방향**: 
  1. **플러그인 메타데이터 시스템 도입**: `.agent/plugins/plugin-name/.ag-plugin/plugin.json` 형태로 확장
  2. **Hooks 시스템 구현**: `beforeEdit`, `afterEdit`, `onError` 등의 라이프사이클 훅 지원
  3. **모듈화된 구조**: 명령어, 에이전트, 스킬, 훅을 하나의 플러그인으로 번들링

```json
// 제안: .ag-plugin/plugin.json 구조
{
  "name": "qa-engineer-plugin",
  "version": "1.0.0",
  "description": "QA Engineer with Scorecard evaluation",
  "author": "AntiGravity Team",
  "components": {
    "skills": ["qa-engineer"],
    "commands": ["ag-review", "scorecard"],
    "hooks": ["afterEdit-quality-check"],
    "agents": ["qa-engineer-agent"]
  },
  "dependencies": {
    "mcp-servers": ["filesystem", "github"]
  }
}
```

---

### 2. **Skills vs Slash Commands 구분** ⭐⭐⭐⭐⭐
**우선순위**: 최상  
**적용 난이도**: 하

#### Claude Code의 철학
| 항목 | Skills | Slash Commands |
|------|--------|----------------|
| **활성화** | Claude가 자동 선택 (AI-driven) | 사용자가 명시적 호출 |
| **복잡도** | 복잡한 다단계 워크플로우 | 단순한 1회성 작업 |
| **상태 관리** | 스킬 실행 컨텍스트 유지 | 상태 없음 (stateless) |
| **예시** | `explaining-code` (코드 설명) | `/bug` (버그 리포트 제출) |

#### AntiGravity 적용 전략
**현재 문제점**:
- `/ag-review`, `/quick-pr` 등의 명령어가 Skill처럼 복잡한 로직을 포함
- 사용자가 매번 명시적으로 호출해야 함 → 자동화 부족

**개선안**:
1. **Skill로 전환해야 할 명령어**:
   - `/ag-review` → `qa-evaluation` Skill (자동 트리거: "evaluate this", "review quality")
   - `/swarm` → `parallel-execution` Skill (자동 트리거: "modify multiple files")

2. **Slash Command로 유지해야 할 명령어**:
   - `/quick-pr` (명시적 PR 생성)
   - `/scorecard` (스코어카드 보기)

3. **새로운 Skill 제안**:
   - `spec-driven-dev` Skill: "create a spec for X" 트리거 시 자동으로 Spec → Implementation 워크플로우 실행
   - `brand-dna-injection` Skill: "make this premium" 트리거 시 Vibe Director 활성화

---

### 3. **Subagent Auto-Delegation** ⭐⭐⭐⭐
**우선순위**: 상  
**적용 난이도**: 중

#### Claude Code의 구현
```markdown
# .claude/agents/code-reviewer.md
---
name: code-reviewer
description: Reviews code for quality and best practices. Use proactively after code changes.
tools: Read, Glob, Grep
model: sonnet
---
You are a senior code reviewer. Focus on code quality, security, and best practices.
```

**핵심 포인트**:
- `description` 필드에 **"Use proactively after code changes"** 같은 트리거 힌트 포함
- Claude가 사용자 요청을 분석하여 **자동으로 적합한 에이전트 선택**
- 사용자가 "review my recent code changes" 입력 시 → `code-reviewer` 에이전트 자동 실행

#### AntiGravity 적용
**현재 상황**: 
- `Chief_Orchestrator`, `Frontend_Agent`, `QA_Engineer` 등이 정의되어 있으나 자동 위임 메커니즘 부재
- 사용자가 명시적으로 "use QA Engineer to review" 같은 요청 필요

**개선안**:
```markdown
# .agent/skills/qa_engineer/SKILL.md
---
name: qa-engineer
description: Evaluates code quality using Scorecard.md metrics. Use proactively when user asks for quality review, evaluation, or grading.
trigger-keywords: ["evaluate", "review quality", "grade this", "scorecard", "S-rank"]
auto-delegate: true
---
...
```

**구현 단계**:
1. SKILL.md에 `trigger-keywords` 메타데이터 추가
2. 사용자 입력 분석 시 키워드 매칭
3. 매칭되면 해당 Skill 자동 실행 (사용자 확인 없이)

---

### 4. **CLAUDE.md Memory System** ⭐⭐⭐⭐⭐
**우선순위**: 최상  
**적용 난이도**: 하

#### Claude Code의 메모리 계층 구조
```
System > Organization > Project > User > Session
```

| 파일 위치 | 스코프 | 용도 |
|-----------|--------|------|
| `/etc/claude-code/CLAUDE.md` | System | 조직 전체 규칙 |
| `./CLAUDE.md` or `./.claude/CLAUDE.md` | Project | 프로젝트별 컨텍스트 |
| `~/.claude/CLAUDE.md` | User | 개인 선호도 |
| `./.claude/rules/*.md` | Project (Modular) | 경로별 룰 (예: `frontend.md`, `backend.md`) |

#### 핵심 기능: `@path` Import Syntax
```markdown
# CLAUDE.md
See @README for project overview and @package.json for available npm commands.

# Git Workflow
@docs/git-instructions.md

# Individual Preferences
@~/.claude/my-preferences.md
```

#### AntiGravity 적용
**현재 상황**:
- `.agent/protocols/`, `.agent/skills/` 등 파일 기반 컨텍스트 관리
- 프로젝트 메모리 vs. 사용자 메모리 구분 없음

**개선안**:
1. **`ANTIGRAVITY.md` 파일 도입** (CLAUDE.md의 AntiGravity 버전)
   - 위치: `./ANTIGRAVITY.md` (프로젝트 루트)
   - `.agent/ANTIGRAVITY.md` (AntiGravity 전용 설정)

2. **계층 구조 정립**:
   ```
   ~/.agent/ANTIGRAVITY.md        # 사용자 글로벌 설정 (개인 코딩 스타일)
   ./ANTIGRAVITY.md                # 프로젝트별 컨텍스트 (Vibe Todo 특화)
   ./.agent/rules/frontend.md      # 경로별 룰 (frontend/ 폴더에만 적용)
   ./.agent/rules/protocols.md     # 프로토콜별 룰
   ```

3. **Import Syntax 구현**:
   ```markdown
   # ANTIGRAVITY.md
   @README.md  # 프로젝트 개요
   @.agent/protocols/hybrid_perfect.md  # 개발 프로토콜
   @~/.agent/personal-preferences.md  # 개인 스타일
   ```

---

### 5. **Confidence-Based Issue Filtering** ⭐⭐⭐⭐
**우선순위**: 상  
**적용 난이도**: 중

#### Claude Code의 Code Review Plugin 방식
```markdown
# plugins/code-review/commands/code-review.md
1. Launch 4 parallel agents to review
2. Each issue independently scored 0-100 for confidence
3. Filter out issues below 80 confidence threshold
4. Output only high-quality feedback
```

**핵심 아이디어**:
- 에이전트가 발견한 이슈마다 **신뢰도 점수 (0-100)** 부여
- 예: "Line 45의 null check 누락 (신뢰도: 95)"
- 임계값(기본 80) 이하 이슈는 자동 필터링 → **False Positive 감소**

#### AntiGravity QA Engineer에 적용
**현재 상황**:
- QA Engineer가 Scorecard 기반 평가 수행
- 모든 발견 사항을 동일한 중요도로 보고 → 노이즈 많음

**개선안**:
```markdown
# .agent/skills/qa_engineer/SKILL.md

## Confidence Scoring Protocol
For each issue found:
1. Assign confidence score (0-100)
   - 100: Objective metric violation (e.g., lint error)
   - 80-99: Clear best practice violation
   - 60-79: Subjective improvement suggestion
   - <60: Opinion-based observation

2. Include confidence in report:
   "❌ Missing error handling in submitTodo() [Confidence: 95]"

3. Filter threshold: Only report issues ≥ 70 confidence
```

**Scorecard.md 통합**:
```markdown
## Code Quality [0-25]
- ❌ No error handling in API calls [Confidence: 95] (-10 points)
- ⚠️  Could extract inline function [Confidence: 65] (Suggestion only)
```

---

### 6. **Plan Mode (Read-Only Analysis)** ⭐⭐⭐⭐
**우선순위**: 상  
**적용 난이도**: 하

#### Claude Code의 Plan Mode
```bash
claude --permission-mode plan
```

**동작 방식**:
- Write/Edit 도구 접근 **차단**, Read-only 도구만 허용
- 코드베이스 탐색 → 계획 수립 → 사용자에게 제안
- 실제 코드 수정 전 **안전한 분석 단계**

**사용 사례**:
```
User: "I need to refactor authentication to OAuth2. Create a migration plan."
Claude (Plan Mode):
- Reads auth/ directory
- Analyzes dependencies
- Proposes step-by-step migration plan
- Asks for approval before editing
```

#### AntiGravity 적용
**현재 상황**:
- Chief Orchestrator가 계획 수립 후 바로 실행
- 분석 단계와 실행 단계가 혼재 → 위험 가능성

**개선안**:
1. **Two-Phase Protocol**:
   ```
   Phase 1 (Plan Mode): Chief Orchestrator + Explore Agent
   - Read-only analysis
   - Generate detailed spec
   - User approval required
   
   Phase 2 (Execute Mode): Frontend Agent + Build Verifier
   - Write/Edit allowed
   - Implement spec
   - Incremental verification
   ```

2. **`.agent/settings.json` 설정**:
   ```json
   {
     "workflows": {
       "spec-driven-dev": {
         "phases": [
           {
             "name": "Planning",
             "permission-mode": "plan",
             "agents": ["chief-orchestrator", "explore-agent"]
           },
           {
             "name": "Implementation",
             "permission-mode": "default",
             "agents": ["frontend-agent"],
             "requires-approval": true
           }
         ]
       }
     }
   }
   ```

---

### 7. **MCP Slash Commands Integration** ⭐⭐⭐
**우선순위**: 중  
**적용 난이도**: 하

#### Claude Code의 MCP Prompts 기능
```markdown
# .mcp.json
{
  "mcpServers": {
    "github": {
      "prompts": {
        "create-issue": {
          "name": "create-issue",
          "description": "Create a GitHub issue",
          "arguments": ["title", "body"]
        }
      }
    }
  }
}
```

**사용 방법**:
```
/github/create-issue "Bug in login" "Steps to reproduce..."
```

**장점**:
- MCP 서버의 Prompt를 Slash Command로 직접 노출
- 복잡한 API 호출을 간단한 명령어로 추상화

#### AntiGravity 적용
**현재 상황**:
- MCP 서버(TestSprite, GitHub, Memory 등) 사용 중
- 각 서버의 기능을 명령어로 직접 노출하지 않음

**개선안**:
1. **Quick Access Commands**:
   ```
   /testsprite/bootstrap          # testsprite_bootstrap 직접 호출
   /github/quick-pr "title"       # quick-pr.md 대신 MCP 직접 사용
   /memory/save-entity "name"     # Knowledge graph에 빠른 저장
   ```

2. **`.agent/commands/` 폴더 정리**:
   - MCP Prompt 기반 명령어는 MCP 서버가 자동 생성
   - Custom 로직이 필요한 명령어만 `.agent/commands/`에 유지

---

## 🚀 우선순위별 적용 로드맵

### Phase 1: Quick Wins (1-2주)
✅ **ANTIGRAVITY.md 메모리 시스템 도입**
- 파일 생성: `./ANTIGRAVITY.md`, `.agent/ANTIGRAVITY.md`
- Import syntax 구현: `@filepath` 지원
- 계층 구조 정립: User > Project > Session

✅ **Skills vs Commands 재분류**
- `/ag-review` → `qa-evaluation` Skill로 전환
- `trigger-keywords` 메타데이터 추가
- 자동 위임 메커니즘 구현

### Phase 2: Core Enhancements (3-4주)
🔧 **Confidence Scoring for QA Engineer**
- Scorecard 평가 시 신뢰도 점수 추가
- 임계값 기반 필터링 (기본 70)
- 리포트 포맷 개선

🔧 **Plan Mode 도입**
- Two-Phase Protocol 구현
- Chief Orchestrator에 Plan Mode 추가
- `.agent/settings.json`에 workflow 설정

### Phase 3: Advanced Features (5-8주)
🚧 **Plugin System 구축**
- `.ag-plugin/plugin.json` 스펙 정의
- Hooks 시스템 구현 (beforeEdit, afterEdit, onError)
- 플러그인 마켓플레이스 준비

🚧 **MCP Slash Commands 통합**
- MCP 서버 Prompt를 자동으로 명령어 생성
- `.agent/commands/` 폴더 최적화

---

## 📊 비교 분석: AntiGravity vs Claude Code

| 항목 | AntiGravity (현재) | Claude Code | 권장 방향 |
|------|-------------------|-------------|-----------|
| **Skills 시스템** | SKILL.md 기반 | SKILL.md + 자동 위임 | ✅ 자동 위임 추가 |
| **메모리 관리** | 파일 기반 (산재) | CLAUDE.md 계층 구조 | ✅ ANTIGRAVITY.md 도입 |
| **플러그인** | 없음 | plugin.json 기반 | 🔧 Phase 3 도입 |
| **에이전트 위임** | 수동 | 자동 (description 기반) | ✅ Phase 1 구현 |
| **QA 평가** | Scorecard 정성적 | Confidence Score | 🔧 Phase 2 추가 |
| **Plan Mode** | 없음 | Read-only 분석 모드 | 🔧 Phase 2 구현 |
| **MCP 통합** | 수동 호출 | Slash Commands | 🔧 Phase 3 통합 |

---

## 💡 즉시 적용 가능한 액션 아이템

### 1. **ANTIGRAVITY.md 생성** (30분)
```bash
# 프로젝트 루트에 생성
touch ANTIGRAVITY.md

# 초기 템플릿
cat > ANTIGRAVITY.md << 'EOF'
# Vibe Todo - AntiGravity Context

## Project Overview
@README.md

## Development Protocol
@.agent/protocols/hybrid_perfect.md

## Team Standards
- UI/UX: @.agent/rules/frontend.md
- Testing: @.agent/rules/testing.md

## Personal Preferences
@~/.agent/personal-style.md
EOF
```

### 2. **QA Engineer Skill에 Trigger Keywords 추가** (15분)
```markdown
# .agent/skills/qa_engineer/SKILL.md
---
name: qa-engineer
description: Evaluates code quality using Scorecard.md. Use when user requests quality review or evaluation.
trigger-keywords: ["evaluate", "review", "grade", "scorecard", "quality check"]
auto-delegate: true
---
```

### 3. **Confidence Score Template for Scorecard** (20분)
```markdown
# _artifacts/Scorecard_Report_YYYYMMDD.md

## Code Quality [Score: 18/25] [Confidence: 90]
- ✅ Error handling implemented [Confidence: 100]
- ❌ Missing input validation [Confidence: 95] (-5 points)
- ⚠️  Could use TypeScript enums [Confidence: 60] (Suggestion)

## UI/UX Design [Score: 22/25] [Confidence: 85]
...
```

---

## ⚠️ 주의사항 및 고려사항

### 1. **과도한 자동화 위험**
- **문제**: 자동 위임이 과하면 사용자가 제어력 상실
- **완화책**: `auto-delegate: true` 옵션을 선택적으로만 활성화

### 2. **Confidence Score 주관성**
- **문제**: AI가 부여하는 신뢰도 점수가 실제와 다를 수 있음
- **완화책**: 임계값을 프로젝트별로 조정 가능하게 (60-80 range)

### 3. **ANTIGRAVITY.md와 기존 파일 충돌**
- **문제**: `.agent/protocols/`, `.agent/skills/` 등 기존 구조와 중복
- **완화책**: ANTIGRAVITY.md는 "entry point"로만 사용, 기존 파일은 유지

---

## 📚 참고 자료

1. **Claude Code 공식 문서**:
   - Overview: https://code.claude.com/docs/en/overview
   - Skills: https://code.claude.com/docs/en/skills
   - Subagents: https://code.claude.com/docs/en/sub-agents
   - Memory: https://code.claude.com/docs/en/memory

2. **GitHub 저장소**:
   - Main Repo: https://github.com/anthropics/claude-code
   - Plugins: https://github.com/anthropics/claude-code/tree/main/plugins

3. **참고할 플러그인**:
   - `code-review`: Confidence-based filtering
   - `pr-review-toolkit`: Multi-agent parallel review
   - `plugin-dev`: Plugin creation guide

---

## ✅ 최종 권장 사항

### 즉시 시작 (This Week)
1. ✅ **ANTIGRAVITY.md 파일 생성** → 프로젝트 메모리 통합
2. ✅ **QA Engineer에 trigger-keywords 추가** → 자동 위임 테스트
3. ✅ **Scorecard에 Confidence Score 추가** → False Positive 감소

### 단기 목표 (This Month)
1. 🔧 **Plan Mode 구현** → Two-Phase Protocol for Spec-Driven Dev
2. 🔧 **Skills vs Commands 재분류** → 자동화 강화
3. 🔧 **`.agent/rules/` 폴더 구조화** → 모듈식 룰 관리

### 장기 비전 (This Quarter)
1. 🚧 **Plugin System 구축** → 커뮤니티 확장성
2. 🚧 **MCP Slash Commands 통합** → 개발자 경험 개선
3. 🚧 **Multi-Agent Orchestration V2** → Confidence-based agent selection

---

**보고서 작성자**: AntiGravity AI  
**검토 대상**: Claude Code Repository & Documentation  
**적용 대상**: AntiGravity Skills System & Vibe Todo Project

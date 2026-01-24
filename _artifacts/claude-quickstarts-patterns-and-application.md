# 🚀 Claude Quickstarts 핵심 패턴 및 즉시 적용

**출처**: https://github.com/anthropics/claude-quickstarts  
**분석 일시**: 2026-01-17 02:55  
**목적**: 5개 실전 Quickstarts의 핵심 아키텍처 패턴을 AntiGravity에 즉시 적용

---

## 🎯 Quickstarts 개요

### **5개 Production-Ready 예제**:
1. **Customer Support Agent** - 지식 기반 챗봇
2. **Financial Data Analyst** - 데이터 시각화 + 대화형 분석
3. **Computer Use Demo** - Desktop 제어
4. **Browser Tools API** - 웹 자동화 (Playwright)
5. **Autonomous Coding Agent** - 2-agent 패턴 (코드 생성)

---

## 💡 핵심 발견: CLAUDE.md (프로젝트 컨벤션!)

### **Anthropic 공식 CLAUDE.md 구조**:

```markdown
# Claude Quickstarts Development Guide

## Legal
- Copyright 관리
- CHANGELOG.md 업데이트

## Setup & Development
- 환경 설정 명령어
- Docker 실행 명령어
- 개발 서버 실행

## Testing & Code Quality
- Lint: ruff check .
- Format: ruff format .
- Typecheck: pyright
- Run tests: pytest

## Code Style
- Python: snake_case / PascalCase
- Imports: isort with combine-as-imports
- Error handling: Custom ToolError
- Types: Full type annotations
- Classes: dataclasses + ABC
```

**AntiGravity 즉시 적용** ⭐⭐⭐:
- ✅ 우리도 CLAUDE.md 이미 있음 (`~/.claude/CLAUDE.md`)
- ✅ 동일한 구조 사용 중
- ✅ Code Style 섹션 추가 필요

---

## 🏗️ 아키텍처 패턴 5가지

### **Pattern 1: Customer Support Agent** (Knowledge Base + Chat)

#### **핵심 구조**:
```typescript
// 1. Knowledge Base
interface KnowledgeBase {
  search(query: string): Document[]
  embed(text: string): Vector
}

// 2. Tool 정의
const tools = [
  {
    name: "search_knowledge_base",
    description: "Search internal documentation",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" }
      }
    }
  }
]

// 3. Agentic Loop
while (!taskComplete) {
  // User message
  messages.push({ role: "user", content: userInput })
  
  // Claude response
  response = await client.messages.create({
    model: "claude-sonnet",
    tools: tools,
    messages: messages
  })
  
  // Handle tool use
  if (response.stop_reason === "tool_use") {
    const result = await executeToolCall(response.content)
    messages.push({
      role: "user",
      content: [{ type: "tool_result", tool_use_id: ..., content: result }]
    })
  } else {
    // Display answer
    break
  }
}
```

**AntiGravity 적용**: QA Engineer 이미 유사 패턴 사용 중 ✅

---

### **Pattern 2: Financial Data Analyst** (Data + Visualization + Chat)

#### **핵심 아이디어**:
```typescript
// 1. Tools for data
const tools = [
  {
    name: "query_financial_data",
    description: "Query stock prices, revenue, etc",
    input_schema: {...}
  },
  {
    name: "create_chart",
    description: "Generate interactive chart",
    input_schema: {
      type: "object",
      properties: {
        chart_type: { enum: ["line", "bar", "pie"] },
        data: { type: "array" },
        config: { type: "object" }
      }
    }
  }
]

// 2. Chat + Visualization
User: "Show me Tesla stock trends"
Claude: [calls query_financial_data] → [calls create_chart]
UI: Displays interactive Recharts visualization
```

**AntiGravity 적용 아이디어** ⭐:
```markdown
# QA Dashboard Tool
1. Tool: analyze_project
   - Returns: Scorecard data
   
2. Tool: create_quality_chart
   - Input: Category scores
   - Output: Interactive bar chart (Code Quality, UI/UX, etc)

3. Integration:
   - User: "Show me quality trends"
   - QA Engineer: Analyzes → Generates chart
   - Dashboard: Displays live quality metrics
```

---

### **Pattern 3: Computer Use Demo** (Desktop Automation)

#### **핵심 Tools**:
```python
# 1. Computer Control Tools
computer_tools = [
    "computer",  # Screenshot, mouse, keyboard
    "bash",      # Shell commands
    "text_editor" # File editing
]

# 2. Workflow
Claude sees screen → Plans action → Executes tool → Repeats
```

**Relevance**: 낮음 (Desktop 제어 필요 없음)

---

### **Pattern 4: Browser Tools API** ⭐⭐⭐ (Web Automation)

#### **핵심: Playwright Integration**:
```python
# 1. Browser Tools 정의
browser_tools = [
    {
        "name": "browser_navigate",
        "description": "Navigate to URL",
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {"type": "string"}
            }
        }
    },
    {
        "name": "browser_click",
        "description": "Click element",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {"type": "string"}
            }
        }
    },
    {
        "name": "browser_fill",
        "description": "Fill form field",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {"type": "string"},
                "text": {"type": "string"}
            }
        }
    }
]

# 2. Tool Execution
async def execute_browser_tool(tool_name, tool_input):
    if tool_name == "browser_navigate":
        await page.goto(tool_input["url"])
        screenshot = await page.screenshot()
        return {"screenshot": screenshot, "status": "success"}
    
    elif tool_name == "browser_click":
        await page.click(tool_input["selector"])
        screenshot = await page.screenshot()
        return {"screenshot": screenshot, "status": "clicked"}
    
    # etc...

# 3. Agentic Loop
Claude: "I need to fill out a form"
→ calls browser_navigate
→ calls browser_fill
→ calls browser_click (submit)
```

**AntiGravity 적용** ⭐⭐⭐:
```python
# webapp-testing Skill 업그레이드!
# 이미 browser_subagent 있지만, Browser Tools로 개선

# tools.py (webapp-testing)
WEBAPP_TESTING_TOOLS = [
    {
        "name": "navigate_to_page",
        "description": "Navigate browser to URL and capture screenshot",
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {"type": "string"},
                "wait_for": {"type": "string", "description": "CSS selector to wait for"}
            }
        }
    },
    {
        "name": "click_element",
        "description": "Click on element and verify result",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {"type": "string"},
                "expect_navigation": {"type": "boolean"}
            }
        }
    },
    {
        "name": "fill_form",
        "description": "Fill form fields",
        "input_schema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "selector": {"type": "string"},
                            "value": {"type": "string"}
                        }
                    }
                }
            }
        }
    },
    {
        "name": "verify_element",
        "description": "Check if element exists and is visible",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {"type": "string"},
                "should_exist": {"type": "boolean"}
            }
        }
    }
]

# Usage:
# Claude: "Test the login flow"
# → navigate_to_page(url="/login")
# → fill_form(fields=[{selector: "#username", value: "test"}])
# → click_element(selector="#submit")
# → verify_element(selector: ".success-message", should_exist: true)
```

---

### **Pattern 5: Autonomous Coding Agent** ⭐⭐⭐ (Two-Agent Pattern)

#### **핵심 아이디어**:
```python
# 1. Two-Agent Architecture
class InitializerAgent:
    """Breaks down requirements into feature list."""
    
    def run(self, requirements: str) -> List[Feature]:
        # Claude generates:
        return [
            Feature(id=1, title="User authentication", status="pending"),
            Feature(id=2, title="Todo CRUD", status="pending"),
            Feature(id=3, title="Data persistence", status="pending"),
        ]

class CodingAgent:
    """Implements features one by one."""
    
    def run(self, feature: Feature, context: ProjectContext) -> CodeChanges:
        # Claude:
        # 1. Reads current code
        # 2. Plans implementation
        # 3. Writes code
        # 4. Tests
        # 5. Commits to git
        return CodeChanges(files=[...], commit_msg="...")

# 2. Workflow
features = initializer.run(user_requirements)

for feature in features:
    changes = coding_agent.run(feature, context)
    git.commit(changes)
    feature.status = "completed"
    
# 3. Progress Persistence
# Uses git commits to track progress
# Feature list in JSON file
# Multi-session support (resume from where it left off)
```

**AntiGravity 적용** ⭐⭐⭐:
```markdown
# QA Engineer Two-Agent Pattern

Agent 1: Scanner (Haiku) ← Already implemented!
- Fast, broad scanning
- Generates list of potential issues

Agent 2: Evaluator (Opus) ← Already implemented!
- Deep analysis of filtered issues
- Generates final scorecard

# Extension: Multi-File QA
Agent 1: File Analyzer (Haiku)
- Scans all files in project
- Generates per-file scorecards

Agent 2: Project Evaluator (Opus)
- Aggregates file scorecards
- Generates project-wide scorecard
- Identifies cross-file issues
```

---

## 🎯 즉시 적용 가능한 개선사항

### **Priority 1: Browser Tools for webapp-testing** ⭐⭐⭐

**왜?**
- Playwright 이미 설치됨 (webapp-testing 의존성)
- Tool Use 패턴 이미 적용됨 (QA Engineer v2.2)
- 자연어 테스트 가능: "Test login flow" → Claude가 자동 실행

**구현**:
```python
# ~/.claude/skills/webapp-testing/browser_tools.py

BROWSER_TOOLS = [
    {
        "name": "navigate",
        "description": "Navigate to URL and capture state",
        "input_schema": {...}
    },
    {
        "name": "click",
        "description": "Click element by selector",
        "input_schema": {...}
    },
    {
        "name": "fill",
        "description": "Fill form field",
        "input_schema": {...}
    },
    {
        "name": "verify",
        "description": "Verify element state",
        "input_schema": {...}
    },
    {
        "name": "screenshot",
        "description": "Take screenshot for verification",
        "input_schema": {...}
    }
]

# webapp_tester.py
class WebAppTester:
    def test_with_tools(self, test_description: str):
        """
        User: "Test the Vibe Todo app login"
        
        Claude:
        1. navigate(url="http://localhost:3000/login")
        2. fill(selector="#username", text="test@example.com")
        3. fill(selector="#password", text="password123")
        4. click(selector="#login-button")
        5. verify(selector=".dashboard", should_exist=true)
        6. screenshot()
        """
        response = client.messages.create(
            model="claude-opus",
            tools=BROWSER_TOOLS,
            messages=[{
                "role": "user",
                "content": f"Test this: {test_description}"
            }]
        )
        
        # Execute tool calls
        for tool_use in response.content:
            if tool_use.type == "tool_use":
                result = await execute_browser_tool(tool_use.name, tool_use.input)
                # Continue conversation...
```

---

### **Priority 2: CLAUDE.md 업그레이드** ⭐⭐

**현재 (`~/.claude/CLAUDE.md`)**:
- 기본 설정만

**개선 (`claude-quickstarts/CLAUDE.md` 참고)**:
```markdown
# AntiGravity Development Guide

## Setup & Development
- Install: pip3 install anthropic
- Run QA: python3 .claude/skills/qa-engineer-v2/qa_engineer_v2.py src/App.jsx
- Run Tests: pytest .claude/skills/qa-engineer-v2/tests/

## Testing & Code Quality
- Lint: ruff check .
- Format: ruff format .
- Typecheck: pyright
- Run  tests: pytest

## Code Style
### Python
- Functions/variables: snake_case
- Classes: PascalCase
- Imports: isort with combine-as-imports
- Error handling: Custom exceptions
- Types: Full type annotations
- Classes: dataclasses + ABC

### JavaScript/TypeScript
- Strict mode with proper interfaces
- Function components with React hooks
- ESLint Next.js configuration

## Skills Development
### Adding New Skill
1. Create .claude/skills/[skill-name]/
2. Add SKILL.md with frontmatter
3. Add implementation (Python/JS)
4. Define tools if needed (tools.py)
5. Add tests (test_*.py)

### Skill Structure
```
skill-name/
├── SKILL.md           # Skill definition
├── skill_impl.py      # Implementation
├── tools.py           # Tool definitions (optional)
└── tests/             # Test suite
```
```

---

### **Priority 3: Multi-File QA** ⭐

**Two-Agent Pattern 응용**:
```python
# qa-engineer-v2/multi_file_qa.py

class MultiFileQA:
    """Analyze entire project using two-agent pattern."""
    
    def __init__(self):
        self.file_analyzer = QAEngineerV2()  # Haiku
        self.project_evaluator = QAEngineerV2()  # Opus
    
    def analyze_project(self, project_root: str):
        # Step 1: Analyze each file (parallel with Haiku)
        files = find_all_source_files(project_root)
        file_scorecards = []
        
        for file in files:
            scorecard = self.file_analyzer.evaluate(read_file(file))
            file_scorecards.append({
                "file": file,
                "scorecard": scorecard
            })
        
        # Step 2: Aggregate (Opus)
        project_scorecard = self.project_evaluator.aggregate(
            file_scorecards,
            cross_file_checks=[
                "Consistent naming across files?",
                "Shared utilities extracted?",
                "Import cycles?",
                "Duplicate code?"
            ]
        )
        
        return project_scorecard
```

---

## 📊 적용 계획

### **Week 1: Browser Tools** (최우선!)
```bash
# 1. Browser tools 정의
~/.claude/skills/webapp-testing/browser_tools.py

# 2. Playwright wrapper
~/.claude/skills/webapp-testing/playwright_executor.py

# 3. Integration
~/.claude/skills/webapp-testing/webapp_tester_v2.py

# 4. Test
Claude: "Test Vibe Todo app"
→ Automatically navigates, fills, clicks, verifies!
```

**예상 효과**:
- ✅ 자연어 테스트 가능
- ✅ E2E 자동화
- ✅ Screenshot 기반 검증

---

### **Week 2: CLAUDE.md 업그레이드**
```bash
# Update ~/.claude/CLAUDE.md
# Add:
# - Code Style guidelines
# - Skills development guide
# - Testing conventions
```

---

### **Week 3: Multi-File QA**
```bash
# Implement multi-file analysis
# Agent 1: Per-file scorecards (Haiku, parallel)
# Agent 2: Project aggregation (Opus, cross-file checks)
```

---

## 💡 핵심 Takeaways

### **From Quickstarts**:

1. **Tool Use Everywhere**: 모든 Quickstart가 Tools 사용
2. **Agentic Loops**: while (!done) { call Claude → execute tool → repeat }
3. **Two-Agent Pattern**: Fast scanner + Precise evaluator
4. **Progress Persistence**: Git commits, JSON state files
5. **CLAUDE.md Convention**: 프로젝트 개발 가이드 표준화

### **AntiGravity 적용**:

1. ✅ **Tool Use**: QA Engineer v2.2 이미 적용
2. ⭐ **Browser Tools**: webapp-testing에 즉시 적용 가능
3. ✅ **Two-Agent**: QA Engineer 이미 사용 중 (Haiku + Opus)
4. ⭐ **CLAUDE.md**: Code Style 섹션 추가
5. ⭐ **Multi-File QA**: 프로젝트 전체 분석 패턴

---

## 📁 생성 예정 파일

```
~/.claude/
├── CLAUDE.md                # ✅ 업그레이드 (Code Style 추가)
└── skills/
    ├── qa-engineer-v2/
    │   ├── multi_file_qa.py # ⭐ NEW
    │   └── tests/           # ⭐ NEW
    └── webapp-testing/
        ├── browser_tools.py      # ⭐ NEW
        ├── playwright_executor.py # ⭐ NEW
        └── webapp_tester_v2.py   # ⭐ NEW
```

---

## 🎉 최종 요약

**Claude Quickstarts에서 얻은 것**:

1. **Browser Tools 패턴** → webapp-testing 즉시 적용
2. **Two-Agent 패턴** → Multi-File QA 구현
3. **CLAUDE.md 표준** → Code Style 가이드 추가
4. **Production Best Practices** → 실전 아키텍처 학습

**즉시 구현**: Browser Tools for webapp-testing (Week 1)

---

**작성자**: AntiGravity AI  
**작성 시각**: 2026-01-17 02:55  
**다음 단계**: Browser Tools 구현 시작

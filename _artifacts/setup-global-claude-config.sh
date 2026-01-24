#!/bin/bash
# Global Claude Code Configuration Setup
# Run this script to apply global settings for all projects

set -e

echo "🚀 Setting up global Claude Code configuration..."
echo ""

# Create directories
echo "📁 Creating directory structure..."
mkdir -p ~/.claude/skills/qa-engineer
mkdir -p ~/.claude/templates

# Copy QA Engineer Skill (global)
echo "🤖 Installing QA Engineer Skill (global)..."
cat > ~/.claude/skills/qa-engineer/SKILL.md << 'EOF'
---
name: qa-engineer
description: Evaluates code quality using Scorecard.md metrics with confidence-based scoring. Use proactively when user requests quality review, evaluation, grading, or asks to check if code meets S+ standards.
---

# QA Engineer - Quality Assurance Specialist

You are a meticulous QA Engineer who evaluates code against the Scorecard.md criteria with confidence-based scoring to filter false positives.

## When to Activate
Trigger on these user requests:
- "evaluate this"
- "review quality"
- "grade this code"
- "check if this meets S+ standards"
- "품질 확인해줘"
- "코드 리뷰해줘"
- "이거 평가해줘"

## Evaluation Process

### 1. Load Scorecard Criteria
Read `.claude/Scorecard.md` or `~/.claude/templates/Scorecard.md.template` to understand evaluation metrics:
- Code Quality (0-25 points)
- UI/UX Design (0-25 points)
- Functionality (0-25 points)
- Performance (0-25 points)

### 2. Analyze Code with Confidence Scoring
For each issue found, assign a **Confidence Score (0-100)**:

**Confidence Levels:**
- **90-100**: Objective, verifiable issues (e.g., lint errors, missing error handling)
- **80-89**: Clear best practice violations with strong evidence
- **70-79**: Solid concerns with reasonable evidence
- **60-69**: Subjective improvements, opinion-based
- **<60**: Weak signals, likely false positive

**Filtering Threshold: 70**
- Only report issues with confidence ≥ 70
- Issues below 70 are logged separately as "Low Priority Suggestions"

### 3. Issue Severity Markers
Use emoji to indicate severity based on confidence:
- 🔴 **Critical** [90-100]: Must fix immediately
- 🟡 **Important** [80-89]: Should fix before release
- 🟢 **Recommended** [70-79]: Good to fix
- ⚪ **Suggestion** [60-69]: Optional improvement (filtered out by default)

### 4. Generate Scorecard Report

Create report in `_artifacts/Scorecard_Report_YYYYMMDD_HHMMSS.md`:

```markdown
# QA Evaluation Report
**Date**: YYYY-MM-DD HH:MM:SS
**Evaluator**: QA Engineer (AntiGravity/Claude)
**Overall Confidence**: XX% (weighted average)

---

## Code Quality [Score: XX/25] [Confidence: XX%]

### Critical Issues (≥90)
🔴 **Missing input validation in submitTodo()** [Confidence: 95]
- **Evidence**: No checks for empty strings or special characters
- **Impact**: Users can submit invalid todos
- **Fix**: Add validation before processing input
- **Deduction**: -10 points

### Important Issues (80-89)
🟡 **No error handling for localStorage operations** [Confidence: 85]
- **Evidence**: localStorage.setItem() called without try-catch
- **Impact**: App crashes if storage quota exceeded
- **Fix**: Wrap in try-catch with user feedback
- **Deduction**: -5 points

### Recommended Improvements (70-79)
🟢 **Type definitions could be stricter** [Confidence: 72]
- **Note**: Using generic Object type instead of specific interfaces
- **Impact**: Lower code maintainability
- **Suggestion**: Define proper TypeScript interfaces
- **Deduction**: -2 points

### Low Priority Suggestions (<70, filtered)
⚪ Console.log statements present [Confidence: 60]
⚪ Function names could be more descriptive [Confidence: 55]

---

## Overall Assessment

**Total Score**: XX/100
**Grade**: S+ / S / A / B / C / F
**Overall Confidence**: XX%

### Priority Action Items (Confidence ≥ 80)
1. 🔴 Fix input validation (Confidence: 95)
2. 🔴 Add error handling (Confidence: 85)

### Recommendations (Confidence 70-79)
1. 🟢 Improve type definitions (Confidence: 72)

### Verdict
- ✅ **S+ Grade**: All scores ≥ 23/25, Total ≥ 95/100
- ✅ **S Grade**: All scores ≥ 20/25, Total ≥ 85/100
- ⚠️ **Needs Improvement**: Critical issues must be addressed
```

## Scoring Guidelines

### How to Assign Confidence Scores

**For Code Quality Issues:**
- Missing error handling: 90-95 (objective)
- No input validation: 90-95 (objective)
- Security vulnerabilities: 95-100 (critical)
- Code style preferences: 50-60 (subjective)
- Comment quality: 60-70 (somewhat subjective)

**For UI/UX Issues:**
- Broken layouts: 95-100 (objective)
- Color contrast violations: 85-90 (WCAG standards)
- Animation performance: 80-90 (measurable)
- Design aesthetic opinions: 60-70 (subjective)

**For Functionality Issues:**
- Feature doesn't work: 95-100 (objective)
- Edge cases not handled: 85-90 (verifiable)
- Missing features per spec: 90-95 (spec-based)
- Feature suggestions: 50-60 (subjective)

**For Performance Issues:**
- Measurable slowness (>3s): 90-95 (objective)
- Memory leaks: 95-100 (critical)
- Optimization opportunities: 70-80 (improvement)
- Micro-optimizations: 50-60 (marginal gains)

## Evidence Requirements

For high confidence (≥80), provide:
1. **Specific location**: File name and line number
2. **Concrete evidence**: Code snippet or behavior
3. **Measurable impact**: What breaks or degrades
4. **Clear fix**: How to resolve the issue

## Output Format

1. **Create detailed report** in `_artifacts/Scorecard_Report_YYYYMMDD_HHMMSS.md`
2. **Summarize in chat**:
   ```
   📊 QA Evaluation Complete
   
   🔴 Critical Issues (2): Input validation, Error handling
   🟡 Important Issues (1): Type definitions
   🟢 Recommendations (3): ...
   
   Overall Score: 75/100 (B Grade)
   Overall Confidence: 82%
   
   📄 Full report: _artifacts/Scorecard_Report_20260117_014930.md
   
   Priority: Fix 2 critical issues for S+ grade
   ```

## Best Practices

- **Be objective**: Use evidence, not opinions
- **Be specific**: Point to exact locations and code
- **Be constructive**: Always suggest fixes
- **Be confident**: Only report issues you're confident about (≥70)
- **Be thorough**: Check all Scorecard dimensions

---

Remember: Your goal is to provide **high-signal, low-noise** feedback that helps developers focus on what truly matters for S+ quality.
EOF

# Create global CLAUDE.md
echo "📝 Creating global CLAUDE.md..."
cat > ~/.claude/CLAUDE.md << 'EOF'
# Kevin's Global Coding Standards & Preferences

> This file applies to ALL projects unless overridden by project-specific settings

---

## 👤 Personal Coding Style

### Language Preferences
- **JavaScript/TypeScript**: Prefer TypeScript where possible
- **Modern Syntax**: Use ES2024+ features
- **Async/Await**: Prefer over callbacks and raw Promises

### Code Structure
- **Function Length**: Keep functions under 50 lines
- **File Length**: Keep files under 500 lines (split if larger)
- **Naming**: Descriptive names over brevity
  - Functions: `getUserById()` not `get()`
  - Variables: `userEmailAddress` not `email`

### Error Handling
- **Always validate inputs**: Never trust user or external data
- **Always handle errors**: Use try-catch for async operations
- **User-friendly messages**: Technical errors → friendly UX

---

## 🎯 Quality Standards (All Projects)

### Minimum Grades
- **Production Code**: S+ grade (95+) required
- **Feature Branches**: A grade (85+) minimum
- **Experimental/POC**: B grade (75+) acceptable

### QA Evaluation
- **Confidence Threshold**: 70 (filter out subjective opinions)
- **Required Tools**: QA Engineer skill auto-enabled
- **Report Storage**: All reports in `_artifacts/` directory

### Code Review Checklist
Before committing, verify:
- [ ] No console.log or debug code
- [ ] All error cases handled
- [ ] Input validation present
- [ ] Performance acceptable (<3s load)
- [ ] Mobile responsive (if UI)

---

## 🛠️ Development Protocols

### Spec-Driven Development
1. **Write Spec First**: No coding before spec approved
2. **Incremental Build**: Test after each component
3. **QA Before Merge**: Evaluate quality before committing

### Git Workflow
- **Branch Naming**: `feature/description` or `fix/description`
- **Commit Messages**: Descriptive, present tense ("Add feature" not "Added")
- **PR Size**: Max 500 lines changed per PR

---

## 🎨 UI/UX Standards (Web Projects)

### Design Principles
- **Premium First**: Avoid basic/generic designs
- **No Placeholders**: Use real content or generate with AI
- **Mobile First**: Design for mobile, scale up to desktop

### Color Guidelines
- **Avoid**: Basic red (#FF0000), blue (#0000FF), green (#00FF00)
- **Use**: HSL-based curated palettes with gradients
- **Dark Mode**: Prefer dark themes for modern apps

### Typography
- **Google Fonts**: Inter, Roboto, Outfit preferred
- **Font Pairing**: Max 2 font families per project
- **Hierarchy**: Clear h1-h6 structure

---

## 📦 Project Templates

### New Project Checklist
When starting a new project:
1. Copy `~/.claude/templates/ANTIGRAVITY.md.template` → `./ANTIGRAVITY.md`
2. Copy `~/.claude/templates/Scorecard.md.template` → `./.claude/Scorecard.md` (if needed)
3. Update ANTIGRAVITY.md with project-specific info
4. Create `.claude/` directory for project-specific settings

### Required Files
- `ANTIGRAVITY.md`: Project context (always)
- `README.md`: Project overview (always)
- `_artifacts/`: Directory for reports/screenshots (always)

---

## 🔧 Tools & MCP Servers

### Always Enabled
- **filesystem**: File management
- **github**: Git integration
- **memory**: Knowledge graph

### Project-Specific
- **testsprite**: For testing workflows
- **brave-search**: For research tasks
- **context7**: For library documentation

---

## 💡 AI Collaboration Tips

### Effective Prompting
- **Be specific**: "Add input validation to login form" not "improve code"
- **Provide context**: Mention relevant files/components
- **Set quality bar**: "Make this S+ grade" not "make it better"

### Auto-Delegation Keywords
- **QA Review**: "evaluate", "review", "grade", "품질 확인"
- **Spec Creation**: "write spec for", "create plan"
- **Code Improvement**: "refactor", "optimize", "clean up"

---

## 📊 Success Metrics

### Monthly Goals
- [ ] 90%+ of commits are A+ grade
- [ ] <10% QA rejections (confidence <70 filtered)
- [ ] Zero critical (90+) issues in production

### Quarterly Reviews
- Review this CLAUDE.md and update based on learnings
- Update templates based on successful patterns
- Archive deprecated practices

---

**Version**: 1.0  
**Last Updated**: 2026-01-17  
**Owner**: Kevin  
**AI Partners**: AntiGravity (Gemini) + Claude Code
EOF

# Create ANTIGRAVITY.md template
echo "📄 Creating ANTIGRAVITY.md template..."
cat > ~/.claude/templates/ANTIGRAVITY.md.template << 'EOF'
# [PROJECT NAME] - AntiGravity Project Context

> **프로젝트 통합 설정 파일** - 모든 개발 컨텍스트의 진입점

---

## 📖 프로젝트 개요
@README.md

**핵심 정보**:
- **이름**: [프로젝트명]
- **목적**: [프로젝트 목표]
- **기술 스택**: [사용 기술]
- **브랜드 정체성**: [디자인 컨셉]

---

## 🛠️ 개발 프로토콜
@~/.claude/CLAUDE.md  # 글로벌 표준 상속

**프로젝트별 추가 규칙**:
1. [프로젝트 특수 규칙 1]
2. [프로젝트 특수 규칙 2]

---

## 🎨 UI/UX 가이드라인

### 디자인 철학
- [프로젝트별 디자인 컨셉]

### 색상 팔레트
```css
/* 기본 */
--primary: hsl(XXX, XX%, XX%);
--secondary: hsl(XXX, XX%, XX%);
```

---

## 🧪 테스팅 & 품질 기준

### QA Evaluation
- **Target Grade**: S+ (95+)
- **Confidence Threshold**: 70
- **Scorecard**: @.claude/Scorecard.md (프로젝트별) or @~/.claude/templates/Scorecard.md.template (글로벌)

---

## 📁 프로젝트 구조

```
project-name/
├── [주요 파일 설명]
└── _artifacts/              # 산출물 저장소
```

---

## 🤖 사용 가능한 Skills & Commands

### Skills (자동 실행)
- **qa-engineer**: "evaluate", "review" 키워드로 자동 트리거 (글로벌)
- [프로젝트별 추가 Skills]

### Slash Commands
- `/quick-pr`: PR 생성
- [프로젝트별 Commands]

---

## 🎯 현재 개발 상태

**Phase X: [현재 단계]**
- ✅ [완료 항목 1]
- ✅ [완료 항목 2]
- 🔄 [진행중 항목]

**Next Steps**:
- [ ] [다음 할 일 1]
- [ ] [다음 할 일 2]

---

## 💡 개발 팁

### 새로운 기능 추가 시
1. **Spec 작성**: "Write a spec for X feature"
2. **Incremental Build**: 단계별 빌드/테스트
3. **QA Review**: "evaluate this" 자동 평가

---

## 🔗 참고 문서

- **글로벌 표준**: @~/.claude/CLAUDE.md
- **프로토콜**: [프로젝트별 프로토콜 문서]
- **QA 기준**: @.claude/Scorecard.md or @~/.claude/templates/Scorecard.md.template

---

**최종 업데이트**: YYYY-MM-DD  
**관리자**: [Your Name]  
**AI 파트너**: AntiGravity (Gemini) + Claude Code
EOF

# Create Scorecard template
echo "📋 Creating Scorecard template..."
cat > ~/.claude/templates/Scorecard.md.template << 'EOF'
# 📊 Project Scorecard (v2.0)
**Updated**: 2026-01-17 - Confidence-Based Scoring System

---

## 🎯 Evaluation Rubric

### 1. Code Quality (25 pts)
> "Is the code robust, maintainable, and error-free?"

#### Error Handling (0-8 pts) [High Confidence Domain]
- [ ] **Try-Catch Blocks**: All async operations wrapped? [Confidence: 95+]
- [ ] **Input Validation**: All user inputs validated? [Confidence: 95+]
- [ ] **Error Messages**: User-friendly error feedback? [Confidence: 90+]

#### Code Structure (0-8 pts) [Medium Confidence Domain]
- [ ] **Function Size**: Functions < 50 lines? [Confidence: 80+]
- [ ] **Separation of Concerns**: Logic separated from UI? [Confidence: 85+]
- [ ] **No Code Duplication**: DRY principle followed? [Confidence: 75+]

#### Best Practices (0-9 pts) [Variable Confidence Domain]
- [ ] **TypeScript Ready**: Type-safe patterns used? [Confidence: 80+]
- [ ] **Security**: No XSS/injection vulnerabilities? [Confidence: 95+]
- [ ] **Clean Console**: No errors or warnings? [Confidence: 100]

### 2. UI/UX Design (25 pts)
> "Does it feel premium and modern?"

#### Visual Excellence (0-10 pts) [Subjective-Objective Mix]
- [ ] **Color Palette**: HSL-based, curated colors? [Confidence: 90+]
- [ ] **Modern Typography**: Google Fonts? [Confidence: 100]
- [ ] **Premium Feel**: Looks polished? [Confidence: 70+]

#### Interactions (0-8 pts) [High Confidence Domain]
- [ ] **Micro-animations**: Smooth effects (60fps)? [Confidence: 90+]
- [ ] **Responsive**: Works on all devices? [Confidence: 100]
- [ ] **Accessibility**: Keyboard + ARIA? [Confidence: 85+]

#### Brand Identity (0-7 pts) [Medium Confidence Domain]
- [ ] **Consistency**: Design system followed? [Confidence: 85+]
- [ ] **No Placeholders**: Real content? [Confidence: 100]

### 3. Functionality (25 pts)
> "Does everything work as expected?"

#### Core Features (0-12 pts) [High Confidence Domain]
- [ ] **CRUD Operations**: All work correctly? [Confidence: 100]
- [ ] **Data Persistence**: Storage working? [Confidence: 95+]
- [ ] **Edge Cases**: Handled properly? [Confidence: 90+]

#### Advanced Features (0-8 pts) [High Confidence Domain]
- [ ] **[Feature 1]**: Working? [Confidence: 95+]
- [ ] **[Feature 2]**: Functional? [Confidence: 100]

#### User Experience (0-5 pts) [Medium Confidence Domain]
- [ ] **Intuitive**: Easy to navigate? [Confidence: 75+]
- [ ] **Feedback**: Clear messages? [Confidence: 85+]

### 4. Performance (25 pts)
> "Is it fast and smooth?"

#### Load Time (0-10 pts) [Objective Measurable]
- [ ] **Initial Load**: < 1 second? [Confidence: 100]
- [ ] **Asset Optimization**: Compressed? [Confidence: 95+]

#### Runtime Performance (0-10 pts) [Objective Measurable]
- [ ] **Smooth Animations**: 60fps? [Confidence: 95+]
- [ ] **No Memory Leaks**: Cleaned up? [Confidence: 90+]

#### Optimization (0-5 pts) [Medium Confidence Domain]
- [ ] **Code Splitting**: Lazy-loaded? [Confidence: 85+]

---

## 📏 Confidence-Based Scoring System

### Confidence Levels
- **🔴 Critical (90-100)**: Must fix
- **🟡 Important (80-89)**: Should fix
- **🟢 Recommended (70-79)**: Good to fix
- **⚪ Suggestion (60-69)**: Optional (filtered)

### Filtering Threshold: 70
Issues below 70 confidence are not counted in final score.

---

## 🏆 Final Grade Scale

| Grade | Score | Criteria |
|-------|-------|----------|
| **S+** | 95-100 | Ship immediately |
| **S** | 90-94 | Minor polish |
| **A** | 85-89 | Few improvements |
| **B** | 75-84 | Needs work |
| **C** | 60-74 | Functional but lacking |
| **F** | <60 | Refactor needed |

---

**Version**: 2.0  
**Maintained By**: AntiGravity QA Team
EOF

echo ""
echo "✅ Global Claude Code configuration complete!"
echo ""
echo "📁 Created files:"
echo "   ~/.claude/CLAUDE.md                          (Global coding standards)"
echo "   ~/.claude/skills/qa-engineer/SKILL.md       (QA Engineer - works in all projects)"
echo "   ~/.claude/templates/ANTIGRAVITY.md.template (Project template)"
echo "   ~/.claude/templates/Scorecard.md.template   (QA criteria template)"
echo ""
echo "🎯 Next steps:"
echo "   1. Review ~/.claude/CLAUDE.md and customize your preferences"
echo "   2. When starting a new project, run:"
echo "      cp ~/.claude/templates/ANTIGRAVITY.md.template ./ANTIGRAVITY.md"
echo "   3. QA Engineer skill is now available in ALL projects automatically!"
echo ""
echo "🧪 Test it:"
echo "   In any project, just say: 'evaluate this code' or '품질 확인해줘'"
echo "   QA Engineer will automatically run with confidence-based filtering!"
echo ""
echo "🎉 Setup complete! Your global configuration is ready."
EOF

chmod +x /Users/kevin/.gemini/antigravity/scratch/vibe-pilot/vibe-todo/_artifacts/setup-global-claude-config.sh

echo "✅ Created setup script!"

# AURA (Vibe Todo) - AntiGravity Project Context

> **프로젝트 통합 설정 파일** - 모든 개발 컨텍스트의 진입점

---

## 📖 프로젝트 개요
@README.md

**핵심 정보**:
- **이름**: AURA (구 Vibe Todo)
- **목적**: 미니멀하면서도 강력한 Todo 관리 앱
- **기술 스택**: HTML, Vanilla CSS, Vanilla JavaScript
- **브랜드 정체성**: 프리미엄하고 현대적인 디자인

---

## 🛠️ 개발 프로토콜
@.agent/protocols/hybrid_perfect.md

**핵심 원칙**:
1. **Spec-Driven Development**: Spec 작성 → 구현 → 검증
2. **Incremental Verification**: 단계별 빌드/실행 확인
3. **S+ Grade Target**: 모든 단계에서 최고 품질 목표

---

## 🎨 UI/UX 가이드라인

### 디자인 철학
- **프리미엄 미학**: 일반적인 색상(빨강, 파랑, 초록) 사용 금지
- **현대적 타이포그래피**: Google Fonts (Inter, Roboto, Outfit 등)
- **마이크로 애니메이션**: 부드러운 hover 효과와 전환
- **글래스모피즘**: 반투명 효과로 깊이감 연출

### 색상 팔레트 (HSL 기반)
```css
/* 기본 */
--primary: hsl(220, 90%, 60%);
--secondary: hsl(280, 80%, 65%);
--accent: hsl(340, 85%, 60%);

/* 배경 (다크 모드 우선) */
--bg-primary: hsl(220, 20%, 10%);
--bg-secondary: hsl(220, 18%, 15%);
```

### 금지 사항
- ❌ 플레이스홀더 이미지 사용
- ❌ 단순한 MVP 수준 디자인
- ❌ Device Frame 포함 (명시 요청 시만)

---

## 🧪 테스팅 & 품질 기준

### S+ Grade 요구사항
- **Code Quality**: 25/25
  - Error handling 완벽
  - Input validation 철저
  - TypeScript-ready structure
  
- **UI/UX Design**: 25/25
  - 프리미엄 디자인
  - 반응형 레이아웃
  - 마이크로 애니메이션
  
- **Functionality**: 25/25
  - 모든 기능 정상 작동
  - Edge case 처리
  - 데이터 영속성

- **Performance**: 25/25
  - 빠른 로딩 (<1s)
  - 부드러운 애니메이션 (60fps)

### 평가 프로세스
1. Chief Orchestrator → Spec 작성
2. Frontend Agent → 구현
3. QA Engineer → Scorecard 평가
4. S+ 미달 시 재작업

---

## 📁 프로젝트 구조

```
vibe-todo/
├── index.html              # 메인 HTML
├── index.css               # 디자인 시스템 & 스타일
├── index.js                # 애플리케이션 로직
├── ANTIGRAVITY.md         # 이 파일
├── .agent/
│   ├── protocols/          # 개발 프로토콜
│   ├── skills/             # AI Skills
│   └── workflows/          # Workflow 정의
└── _artifacts/             # 산출물 저장소
```

---

## 🤖 사용 가능한 Skills & Commands

### Skills (자동 실행)
- **qa-engineer**: "evaluate", "review", "grade" 키워드로 자동 트리거
- **vibe-director**: "make this premium" 등으로 브랜드 DNA 주입
- **frontend-agent**: 프론트엔드 구현 전문

### Slash Commands (명시적 호출)
- `/ag-review`: QA Engineer 실행
- `/quick-pr`: 빠른 PR 생성
- `/swarm`: 병렬 파일 수정

---

## 🎯 현재 개발 상태

**Phase 3: Advanced Features** (완료)
- ✅ Recurring Tasks
- ✅ Due Dates
- ✅ Reminders
- ✅ Tag System
- ✅ Search Functionality
- ✅ Export (JSON, CSV, Markdown)

**Next Steps**:
- 🔄 Claude Code 개선 사항 적용
- 🔄 Confidence-based QA 평가
- 🔄 Auto-delegation 시스템

---

## 💡 개발 팁

### 새로운 기능 추가 시
1. **항상 Spec부터 작성**: "Write a spec for X feature"
2. **Incremental Build**: 단계별로 빌드/테스트 확인
3. **QA Review**: 완료 후 "evaluate this" 자동 평가

### AI와 협업 시
- 자연스러운 표현 사용: "품질 확인해줘", "이거 리뷰해줘"
- Spec-Driven 유지: 구현 전 항상 계획 단계
- S+ 목표: 타협하지 않는 품질 추구

---

## 🔗 참고 문서

- **프로토콜**: @.agent/protocols/hybrid_perfect.md
- **QA 평가 기준**: @_artifacts/Scorecard.md
- **워크플로우**: @.agent/workflows/

---

**최종 업데이트**: 2026-01-17  
**관리자**: Kevin  
**AI 파트너**: AntiGravity (Gemini) + Claude Code

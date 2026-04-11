# MOIN AI Design — Figma Plugin (v0.6)

자연어로 화면을 설명하면 MOIN 디자인 시스템 컴포넌트로 Figma에 직접 렌더링하는 플러그인.

## 사전 준비

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) 설치 및 인증 완료
- Node.js 18+
- Figma Desktop App

## 설치

```bash
git clone https://github.com/your-username/figma-ai-design.git
cd figma-ai-design
```

별도 `npm install` 필요 없음.

## 실행

### 1. 로컬 서버 시작

```bash
node server.js
```

`http://localhost:3333` 에서 서버가 실행됩니다.

### 2. Figma 플러그인 등록

1. Figma Desktop App 열기
2. 메뉴 → Plugins → Development → **Import plugin from manifest...**
3. 이 폴더의 `manifest.json` 선택
4. 플러그인 목록에 **MOIN AI Design** 등록 확인

### 3. 사용

1. Figma에서 Plugins → Development → **MOIN AI Design** 실행
2. 프롬프트 입력 (예: `당발송금 목록 페이지`)
3. **생성하기** 클릭 → Claude가 JSON 생성 → Figma에 렌더링

## 기능

### 생성 모드
프롬프트로 새 화면을 생성합니다.

### 편집 모드
플러그인으로 만든 프레임을 선택하면 자동으로 편집 모드 진입.
- 빠른 편집 (Claude 없이 즉시): `목 데이터 채워줘`, `row 10개로`, `모달 추가`, `처리중 탭으로`
- 복잡한 편집: Claude가 기존 JSON을 수정

### 지원 컴포넌트 (28개)

| 분류 | 컴포넌트 |
|------|----------|
| 레이아웃 | LNB, Card, FormGroup |
| 네비게이션 | Breadcrumb, Tab |
| 섹션 | Top, Accordion |
| 검색/필터 | SearchBar, FilterBar, ChipGroup |
| 데이터 | Table, Pagination, StatusBadge, Signal |
| 입력 | TextField, TextArea, Dropdown |
| 컨트롤 | Checkbox, RadioButton, Switch |
| 버튼 | Button, IconButton, TextButton |
| 오버레이 | Modal, Dialog, Toast, Tooltip |
| 피드백 | Spinner |
| 범용 | Custom (Foundation 토큰 기반 자유 레이아웃) |

## 폴더 구조

```
figma-ai-design/
  manifest.json       Figma 플러그인 설정
  code.js             렌더 엔진 (JSON → Figma 컴포넌트)
  ui.html             플러그인 UI
  server.js           로컬 서버 (Claude CLI 래핑)
  plugin_reference/   디자인 시스템 레퍼런스
    Principles/       디자인 원칙 (버튼 위계, 레이아웃, 색상 등)
    Component/        복합 컴포넌트 (Table, Modal, Accordion 등)
    Atom/             단일 컴포넌트 (Button, TextField, Checkbox 등)
    Foundation/       디자인 토큰 (Colors, Typography)
```

## 동작 원리

```
사용자 프롬프트 입력
    ↓
Figma 플러그인 UI (ui.html)
    ↓ (빠른 편집 패턴 감지 시 → JSON 직접 패치 → 즉시 렌더)
로컬 서버 (server.js, 포트 3333)
    ↓
Claude CLI (plugin_reference를 시스템 프롬프트에 포함)
    ↓
구조화된 JSON 반환
    ↓
렌더 엔진 (code.js) → Figma Plugin API로 컴포넌트 인스턴스 생성
```

## v0.6 변경사항

### AI 디자인 품질 가드레일 추가

[Impeccable](https://impeccable.style/) 디자인 스킬 프레임워크를 참고하여 AI 생성 품질 규칙을 추가.

- **`QualityGuard.md`**: 안티패턴 방지 규칙
  - 레이아웃 반복 방지 (매번 Top+Table 금지)
  - 버튼 계층 강제 (Primary 1개/화면)
  - 테이블 컬럼 과다 방지, 동일 카드 반복 금지
- **`CognitiveLoad.md`**: 인지 부하 관리
  - 8항목 체크리스트 (단일 초점, 청킹, 점진적 공개 등)
  - 화면 유형별 적정 복잡도 가이드
  - 선택지 수 관리 규칙 (버튼 3~4개, 탭 5개, 컬럼 5~7개)
- **시스템 프롬프트 강화**: 품질 가드레일 규칙을 Claude 프롬프트에 직접 포함

## 디자인 레퍼런스 수정

`plugin_reference/` 폴더의 md 파일을 수정하면 Claude의 화면 설계에 반영됩니다.
서버 재시작 필요: `Ctrl+C` 후 `node server.js`

## 트러블슈팅

| 증상 | 해결 |
|------|------|
| 서버 시작 안 됨 | `lsof -ti:3333 \| xargs kill -9` 후 재시작 |
| Claude 응답 없음 | `claude` CLI가 터미널에서 동작하는지 확인 |
| 컴포넌트 안 그려짐 | Figma 파일에 MOIN Design System 라이브러리가 활성화되어 있는지 확인 |
| 편집 모드 안 됨 | 플러그인으로 생성한 프레임만 편집 가능 (pluginData 필요) |

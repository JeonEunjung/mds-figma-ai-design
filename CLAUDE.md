# MOIN AI Design — Figma Plugin

## 프로젝트 개요
자연어 프롬프트로 MOIN 디자인 시스템 컴포넌트를 피그마에 직접 렌더링하는 플러그인.

## 기술 스택
- Figma Plugin API (code.js) + Node.js 로컬 서버 (server.js) + Claude CLI
- 별도 빌드/번들 없음. Vanilla JS.

## 핵심 파일
- `code.js` — 렌더 엔진. JSON → 피그마 컴포넌트 인스턴스 생성. KEYS 객체에 컴포넌트 키 매핑.
- `server.js` — Claude CLI 래핑. plugin_reference/ 마크다운을 시스템 프롬프트에 포함.
- `ui.html` — 플러그인 UI. 빠른 편집 패턴 감지 + Claude 호출.
- `plugin_reference/` — 디자인 원칙, 컴포넌트 문서. server.js가 자동으로 읽음.

## 컴포넌트 variant 변경 규칙

**반드시 `COMPONENT_MAPPING.md`를 참고할 것.**

피그마 컴포넌트는 중첩 구조를 가진다. variant property 변경 시:
1. 인스턴스 자체에 property가 있을 수 있음
2. **자식 인스턴스**에 property가 있을 수 있음 (예: ContentsCell > Status Badge)

variant 전환이 안 될 때는 반드시 `cell.findAll(n => n.type === 'INSTANCE')`로 자식을 순회해서 원하는 property를 가진 인스턴스를 찾을 것.

## 트러블슈팅 기록 의무

컴포넌트 관련 버그를 수정했을 때, 반드시 `COMPONENT_MAPPING.md`의 트러블슈팅 이력 테이블에 기록을 추가할 것:

| 날짜 | 컴포넌트 | 문제 | 원인 | 해결 |

이력이 쌓여야 같은 실수를 반복하지 않는다.

## 서버 실행
```bash
cd ~/Projects/mds-figma-ai-design
node server.js
# http://localhost:3333
```

## 변경 로그 규칙
- 코드 변경을 커밋할 때 `CHANGELOG.md`도 반드시 함께 업데이트할 것.
- 기능 추가, 버그 수정 등 사용자에게 의미 있는 변경이면 버전을 올리고 기록.
- 사용자가 언급하지 않아도 먼저 챙길 것.

## 코딩 규칙
- code.js는 피그마 플러그인 샌드박스에서 실행됨. ES 모듈, import/export 사용 불가.
- `var` 사용 (피그마 플러그인 호환성).
- `figma.notify()` 로 사용자에게 메시지 표시 (console.log는 개발자 콘솔에서만 보임).
- 컴포넌트 키(SHA-1 해시)는 KEYS 객체에 집중 관리.

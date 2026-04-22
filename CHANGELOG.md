# Changelog

## v0.8.1-resume (2026-04-22) — 실험: Claude 세션 재사용

### MCP 연결 유지를 위한 `--resume` 도입
- `claude -p`는 매 호출마다 새 세션이라 Notion MCP 등 OAuth 기반 MCP가 재인증되는 문제 해결 시도
- `--output-format json`으로 응답 받아 `session_id` 추출 → `.claude-session-id` 파일에 저장
- 이후 호출은 `--resume <session_id>`로 이전 세션을 이어받아 MCP 연결 상태 보존
- 세션 만료/유실 감지 시 자동으로 새 세션 시작 (1회 재시도)
- `GET /session`, `DELETE /session` 엔드포인트 추가 — 세션 상태 조회/초기화
- `.gitignore`에 `.claude-session-id`, `.notion-session.json` 추가

### 전제 조건
- 첫 세션은 반드시 대화형 `claude`에서 `/mcp connect notion` + OAuth 완료 후 시작해야 함 (비대화형 `-p` 모드에서는 OAuth 브라우저 플로우 불가)
- 자세한 절차는 `SETUP_SESSION.md` 참조

## v0.8.0 (2026-04-22)

### Notion 기획안 → 멀티 화면 자동 설계
- **기획안 모드 추가**: 플러그인 UI에 "프롬프트/기획안" 탭 전환 추가
- **Claude Code 연동**: Claude Code에서 Notion 기획안을 읽고 디자인을 Figma 플러그인으로 자동 전송
- **멀티 화면 렌더링**: 기획안에서 파악한 여러 화면을 Figma 캔버스에 나란히 배치 (100px 간격)
- **서버 엔드포인트**: `/push-designs` (Claude Code → 서버), `/pending-designs` (서버 → 플러그인 폴링)
- 기획안 탭 진입 시 2초 간격 자동 폴링, 편집 모드에서는 기획안 탭 자동 숨김

## v0.7.0 (2026-04-13)

### DS Variable & Text Style 바인딩
- **Color Variable 바인딩**: 렌더링 시 Color System Token Variable을 노드에 자동 바인딩 (Surface, Contents, Border 등)
- **Text Style 바인딩**: custom 텍스트 렌더링 시 DS Text Style (`m14/l3`, `b24/l2` 등) 자동 적용
- manifest.json에 `teamlibrary` 권한 추가
- 페이지 배경색 Surface/Secondary로 변경

## v0.6.4 (2026-04-13)

### 디자인 토큰 적용
- code.js 내 하드코딩된 RGB 색상을 TOKENS 상수 객체로 교체 (Foundation/Colors.md 기반)
- TYPO 토큰 추가 — 유효 폰트 크기(12/14/16/18/20/24/28/32)로 자동 스냅, lineHeight 자동 적용
- 20px 이상은 Bold, 미만은 Medium 자동 적용 (weight 미지정 시)
- 시스템 프롬프트에 custom 요소 토큰 규칙 추가 — Claude가 임의 색상/폰트 대신 DS 토큰만 사용하도록 강제

## v0.6.3 (2026-04-13)

### 버그 수정 및 개선
- manifest.json에서 `version` 필드 제거 — Figma 플러그인 로드 시 "unexpected extra property" 에러 수정
- 서버 시작 시 자동 `git pull` 추가 — 항상 최신 버전으로 실행 (실패 시 기존 버전으로 정상 시작)

## v0.6.2 (2026-04-11)

### 부분 편집 기능 추가
- 프레임 내부 컴포넌트를 선택하면 해당 부분만 수정하는 **부분 편집 모드** 추가
- 전체 children 삭제 → 재렌더 대신, 선택된 노드만 교체하여 나머지 보존
- 렌더링 시 각 노드에 `jsonPath` 태깅 → 부분 선택 감지 및 교체 가능
- 서버에 부분 편집 프롬프트 추가 (컴포넌트 JSON만 Claude에 전달)
- RENDER_PARTIAL 후 새 노드 자동 선택으로 연속 편집 지원

## v0.6.1 (2026-04-11)

### StatusBadge variant 버그 수정
- 테이블 내 StatusBadge의 status variant 전환이 안 되던 문제 수정
- ContentsCell > Status Badge 중첩 구조에서 자식 인스턴스를 순회하여 property 변경하도록 수정
- COMPONENT_MAPPING.md, CLAUDE.md 추가 (트러블슈팅 기록 체계화)

## v0.6.0 (2026-04-11)

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

## v0.5.0

- 초기 버전
- 자연어 → Claude → JSON → Figma 렌더링 파이프라인
- 생성 모드 + 편집 모드 (빠른 편집 / Claude 편집)
- 28개 컴포넌트 지원
- 디자인 원칙 6개 (ButtonHierarchy, ColorTokens, ComponentSelection, DataDisplay, DesignPhilosophy, Layout)

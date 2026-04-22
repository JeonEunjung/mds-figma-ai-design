# MCP 영속화 + 자동 OAuth 온보딩 가이드

이 브랜치(`feat/mcp-persistence`)는 **MCP 연결 유지**와 **신규 유저 자동 온보딩**을 함께 지원합니다.

## 아키텍처

```
요청 처리 (기존 흐름):
  /generate              → claude -p --resume + --dangerously-skip-permissions
  /generate-from-notion  → 위와 동일 + 프롬프트에 mcp__notion__notion-fetch 호출 지시

MCP 상태 확인 (UI 폴링):
  GET /mcp/status        → `claude mcp get notion` 파싱 → connected/needs_auth 등 반환

OAuth 온보딩 (사용자 클릭):
  POST /mcp/auth         → node-pty로 대화형 claude 띄움
                           → /mcp 자동 전송 → URL 파싱 → Chrome 실행
                           → 승인 감지 → /quit → 토큰 저장
```

**장수명 daemon 없음.** 세 기능 모두 필요할 때만 subprocess spawn.

## 처음 한 번만: 의존성 설치

```bash
cd ~/mds-figma-ai-design-final   # 이 worktree
npm install                       # node-pty (auth용) + playwright (legacy)
```

## 서버 실행

```bash
node server.js
# → http://localhost:3333
```

## 사용자 시나리오

### 시나리오 A: 이미 Notion MCP 인증된 유저
1. 서버 기동 → Figma 플러그인 그대로 실행
2. Notion 기획안 URL 입력 → 생성 클릭
3. 끝. 기획안 기능 동작.

### 시나리오 B: 신규 유저 (MCP 미인증)
1. 서버 기동 → Figma 플러그인 실행
2. 하단에 "⚠️ Notion MCP 인증 필요" 패널 자동 표시
3. "Notion 인증하기" 클릭
4. 서버가 대화형 claude 띄움 → OAuth URL 감지 → Chrome 자동 실행
5. UI 상태: "🌐 브라우저에서 승인해주세요"
6. 유저가 브라우저에서 Notion 인증 승인
7. claude 내장 콜백 리스너가 토큰 수신 → "Connected" 감지
8. UI에서 패널 자동 숨김 → 기획안 기능 사용 가능

## 상태/제어 커맨드

```bash
# MCP 연결 상태 확인
curl http://localhost:3333/mcp/status
# {
#   "mcpServers": [{"name": "notion", "status": "connected"}],
#   "allConnected": true,
#   "authFlow": {"state": "idle"}
# }

# 세션 상태 확인
curl http://localhost:3333/session

# 세션 초기화 (MCP 재인증 시)
curl -X DELETE http://localhost:3333/session

# 진행 중 인증 취소
curl -X POST http://localhost:3333/mcp/auth/cancel
```

## 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| `/mcp/auth` 호출 시 "node-pty 미설치" | deps 설치 누락 | `npm install` 후 서버 재시작 |
| OAuth URL이 파싱 안 됨 | claude CLI 버전의 출력 포맷 변경 | `mcp-auth.js`의 patterns 배열에 regex 추가 |
| Chrome이 안 열림 | macOS 아닌 OS | `mcp-auth.js`의 `open` 명령을 플랫폼별로 분기 (`xdg-open`, `start`) |
| 승인 후에도 "Connected" 미감지 | 시간 지연 | `mcp-auth.js`의 타임아웃(5분) 내 다시 시도. 수동으로 `claude` → `/mcp` |
| `is_error: session not found` | 세션 파일이 오래됨 | 서버가 자동 재시도. 지속되면 `curl -X DELETE /session` |

## 기존 Figma 플러그인과의 호환성

- 포트 `3333` 동일 → 이미 등록된 MOIN AI Design 플러그인 그대로 사용 가능
- `code.js`, `ui.html` 파일 경로는 기존 워크트리가 가리키는 위치.
  이 브랜치의 UI 변경사항을 쓰려면 Figma에 별도 플러그인으로 import하거나
  기존 플러그인 등록을 삭제 후 이 worktree에서 재등록

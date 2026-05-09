# 세션 재사용 브랜치 셋업 가이드

`feat/claude-resume-session` 브랜치는 `claude -p --resume <session_id>`를 사용해서 MCP 연결 상태를 세션 간에 유지합니다.

## 전제 조건

`claude -p`는 비대화형이라 OAuth 브라우저 플로우를 실행할 수 없습니다.
→ **최초 한 번은 대화형 `claude`에서 MCP 인증을 완료해야 합니다.**

## 설정 절차

### 1. 프로젝트 폴더로 이동
```bash
cd ~/mds-figma-ai-design-resume  # 이 worktree
```

### 2. 대화형 claude 실행 + Notion MCP 연결
```bash
claude
```

claude 프롬프트에서:
```
> /mcp
```

Notion MCP를 선택하고 OAuth 플로우 진행 (브라우저에서 승인).
인증 완료되면 Notion MCP 도구들(`mcp__notion__*`)이 사용 가능한 상태가 됨.

### 3. 세션 확인용 더미 프롬프트 1회 실행
```
> Notion MCP 도구가 보이는지 확인해줘
```

응답이 정상적으로 오면 `/quit` 또는 `Ctrl+D`로 종료.

이 시점에 세션이 `~/.claude/projects/<cwd-encoded>/<uuid>.jsonl`에 저장됨.

### 4. 세션 ID 자동 캐싱
```bash
node server.js
```

첫 `claude -p` 호출 시 `--output-format json` 응답의 `session_id`가 자동으로 `.claude-session-id` 파일에 저장됨.
이후 호출은 모두 `--resume <session_id>`로 MCP 상태를 포함해 이어받음.

## 세션 상태 확인

```bash
# 현재 저장된 세션 확인
curl http://localhost:3333/session

# 세션 초기화 (MCP 재인증이 필요할 때)
curl -X DELETE http://localhost:3333/session
```

## 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| `is_error: true` + "session not found" | 세션 만료됨 | 서버가 자동으로 세션 무효화 후 재시도. 그래도 실패하면 2번부터 다시 |
| Notion MCP 툴이 응답에 없음 | OAuth 인증 안 됨 | 2번 절차 재실행 |
| `--resume` 자체가 실패 | claude CLI 구버전 | `claude --version` 확인, 필요 시 업데이트 |

## 장점 vs 한계

**장점:**
- 기존 `server.js` 구조 최소 변경 (spawn 기반 유지)
- 세션 만료 자동 복구
- Notion MCP OAuth 1회만 수행

**한계:**
- 최초 MCP 인증은 여전히 수동 (OAuth 브라우저 플로우 필요)
- `claude -p` 특성상 호출마다 프로세스 기동 비용 발생 (약 2–3초)
- 병렬 호출 시 세션 ID 경합 가능 (현재는 마지막 호출이 세션을 덮어씀)
